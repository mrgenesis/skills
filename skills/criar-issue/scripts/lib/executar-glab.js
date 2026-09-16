const { spawnSync } = require("node:child_process");
const { obterVariavel } = require("./config-vars");

const TOKEN_VAR_NAME = "MRG_GLAB_TOKEN";
const URL_VAR_NAME = "MRG_GLAB_URL_BASE";

/**
 * Monta o ambiente para o processo filho, repassando:
 * - MRG_GLAB_TOKEN (variável de ambiente ou ~/.mrg.skills.vars.json) como
 *   GITLAB_TOKEN, nome que o `glab` reconhece nativamente para autenticar
 *   sem precisar de `glab auth login`;
 * - MRG_GLAB_URL_BASE como GITLAB_HOST, para apontar para a instância
 *   correta do GitLab (self-hosted ou gitlab.com).
 * Se nenhuma das duas estiver configurada, o `glab` cai na autenticação já
 * gravada em disco por um `glab auth login` anterior, se existir.
 */
function montarAmbiente() {
  const env = { ...process.env };
  const token = obterVariavel(TOKEN_VAR_NAME);
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
    env: montarAmbiente(),
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
