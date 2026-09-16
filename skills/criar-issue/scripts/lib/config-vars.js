const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CONFIG_PATH = path.join(os.homedir(), ".mrg.skills.vars.json");

const CAMPOS_TEMPLATE = {
  MRG_GLAB_TOKEN:
    "<preencha: token de acesso pessoal gerado em <URL da sua instância GitLab>/-/user_settings/personal_access_tokens, com escopo 'api'>",
  MRG_GLAB_URL_BASE:
    "<opcional, preencha só se usar uma instância própria do GitLab (não gitlab.com), ex.: gitlab.suaempresa.com.br>",
};

/**
 * Um valor entre "<" e ">" é tratado como instrução de preenchimento ainda
 * não substituída pelo usuário, nunca como valor real.
 */
function ehPlaceholder(valor) {
  return typeof valor === "string" && /^<.*>$/.test(valor.trim());
}

/**
 * Lê ~/.mrg.skills.vars.json, um arquivo de configuração compartilhado entre
 * as skills desta família (mrgenesis-skills). Ele é lido do zero a cada
 * execução, então uma edição no arquivo já vale na próxima chamada do
 * script, sem precisar reiniciar o Claude Code (diferente de variável de
 * ambiente, que só é herdada por processos novos a partir do momento em que
 * já estava definida na sessão que os lançou).
 *
 * Formato esperado: um objeto plano, ex. { "MRG_GLAB_TOKEN": "...", "MRG_GLAB_URL_BASE": "..." }.
 * Arquivo ausente ou inválido é tratado como "nenhuma variável configurada",
 * nunca lança.
 */
function lerArquivoConfig() {
  try {
    const conteudo = fs.readFileSync(CONFIG_PATH, "utf8");
    const dados = JSON.parse(conteudo);
    return dados && typeof dados === "object" ? dados : {};
  } catch {
    return {};
  }
}

/**
 * Resolve o valor de uma variável, priorizando a variável de ambiente (para
 * quem preferir configurar assim, ex. CI) e caindo para o arquivo de
 * configuração em seguida. Um placeholder ainda não preenchido conta como
 * "não configurado".
 */
function obterVariavel(nome) {
  if (process.env[nome] && process.env[nome].trim() && !ehPlaceholder(process.env[nome])) {
    return process.env[nome].trim();
  }
  const config = lerArquivoConfig();
  const valor = config[nome];
  if (typeof valor === "string" && valor.trim() && !ehPlaceholder(valor)) {
    return valor.trim();
  }
  return null;
}

/**
 * Cria ~/.mrg.skills.vars.json com um template (todas as chaves conhecidas,
 * cada uma com a instrução de preenchimento no lugar do valor) caso o
 * arquivo ainda não exista. Nunca sobrescreve um arquivo já existente, para
 * não apagar valores que o usuário já tenha preenchido. Retorna true se
 * acabou de criar o arquivo agora, false se ele já existia.
 */
function garantirArquivoTemplate() {
  if (fs.existsSync(CONFIG_PATH)) return false;

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(CAMPOS_TEMPLATE, null, 2) + "\n", {
    mode: 0o600,
  });
  fs.chmodSync(CONFIG_PATH, 0o600);
  return true;
}

module.exports = { obterVariavel, garantirArquivoTemplate, CONFIG_PATH };
