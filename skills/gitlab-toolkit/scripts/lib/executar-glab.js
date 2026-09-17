const { spawnSync } = require("node:child_process");
const { obterToken, obterVariavel, URL_VAR_NAME } = require("./config-vars");
const { resolverCaminhoGlab } = require("./glab-binario");

/**
 * Monta o ambiente para o processo filho, repassando:
 * - o token resolvido para repoPath (MRG_GLAB_TOKEN, string única ou mapa
 *   por grupo/projeto, ver lib/config-vars.js) como GITLAB_TOKEN, nome que o
 *   `glab` reconhece nativamente para autenticar sem precisar de
 *   `glab auth login`;
 * - MRG_GLAB_URL_BASE como GITLAB_HOST, para apontar para a instância
 *   correta do GitLab (self-hosted ou gitlab.com).
 * Se nenhuma das duas estiver configurada, o `glab` cai na autenticação já
 * gravada em disco por um `glab auth login` anterior, se existir.
 *
 * repoPath é sempre passado explicitamente por quem chama executarGlab /
 * executarGlabRaw (nunca extraído dos args), porque nem todo comando `glab`
 * recebe o repositório como flag `--repo` (ex.: `glab api`, onde o
 * repositório já faz parte do endpoint).
 */
function montarAmbiente(repoPath) {
  const env = { ...process.env };
  const token = obterToken(repoPath);
  const urlBase = obterVariavel(URL_VAR_NAME);

  if (token && !env.GITLAB_TOKEN) {
    env.GITLAB_TOKEN = token;
  }
  if (urlBase && !env.GITLAB_HOST) {
    env.GITLAB_HOST = urlBase;
  }
  return env;
}

/**
 * Executa `glab <args>` e retorna um resultado uniforme, nunca lança. Usa
 * encoding utf8 e corta espaços do stdout/stderr, adequado para os
 * subcomandos que retornam texto (issue create/update, etc.).
 */
function executarGlab(args, repoPath) {
  const resultado = spawnSync(resolverCaminhoGlab(), args, {
    env: montarAmbiente(repoPath),
    encoding: "utf8",
  });

  if (resultado.error) {
    return {
      ok: false,
      error: `glab não encontrado ou falhou ao executar: ${resultado.error.message}`,
    };
  }

  const stdout = (resultado.stdout || "").trim();
  const stderr = (resultado.stderr || "").trim();

  if (resultado.status !== 0) {
    return {
      ok: false,
      error: stderr || `glab retornou código de saída ${resultado.status}`,
      stdout,
      stderr,
    };
  }

  return { ok: true, stdout, stderr };
}

/**
 * Como executarGlab, mas sem forçar utf8 nem cortar espaços/quebras de linha
 * do stdout: usado para conteúdo que precisa ser gravado em disco
 * exatamente como veio (ex.: baixar-arquivo.js), onde decodificar como texto
 * ou remover espaços corromperia o resultado (arquivos binários, ou
 * arquivos de texto cuja formatação importa byte a byte).
 */
function executarGlabRaw(args, repoPath) {
  const resultado = spawnSync(resolverCaminhoGlab(), args, { env: montarAmbiente(repoPath) });

  if (resultado.error) {
    return {
      ok: false,
      error: `glab não encontrado ou falhou ao executar: ${resultado.error.message}`,
    };
  }

  if (resultado.status !== 0) {
    const stderr = (resultado.stderr || Buffer.alloc(0)).toString("utf8").trim();
    return {
      ok: false,
      error: stderr || `glab retornou código de saída ${resultado.status}`,
    };
  }

  return { ok: true, stdout: resultado.stdout };
}

module.exports = { executarGlab, executarGlabRaw };
