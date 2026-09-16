const { spawnSync } = require("node:child_process");
const { obterToken, obterVariavel, URL_VAR_NAME } = require("./config-vars");

function extrairRepoDosArgs(args) {
  const indice = args.indexOf("--repo");
  return indice !== -1 && args[indice + 1] ? args[indice + 1] : null;
}

/**
 * Monta o ambiente para o processo filho, repassando:
 * - o token resolvido para o --repo presente em args (MRG_GLAB_TOKEN, string
 *   única ou mapa por grupo/projeto, ver lib/config-vars.js) como
 *   GITLAB_TOKEN, nome que o `glab` reconhece nativamente para autenticar
 *   sem precisar de `glab auth login`;
 * - MRG_GLAB_URL_BASE como GITLAB_HOST, para apontar para a instância
 *   correta do GitLab (self-hosted ou gitlab.com).
 * Se nenhuma das duas estiver configurada, o `glab` cai na autenticação já
 * gravada em disco por um `glab auth login` anterior, se existir.
 */
function montarAmbiente(args) {
  const env = { ...process.env };
  const token = obterToken(extrairRepoDosArgs(args));
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
 * Executa `glab <args>` e retorna um resultado uniforme, nunca lança.
 */
function executarGlab(args) {
  const resultado = spawnSync("glab", args, {
    env: montarAmbiente(args),
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

module.exports = { executarGlab };
