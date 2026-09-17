const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CONFIG_DIR = path.join(os.homedir(), ".mrg.skills");
const CONFIG_PATH = path.join(CONFIG_DIR, "credenciais.json");

const TOKEN_VAR_NAME = "MRG_GLAB_TOKEN";
const URL_VAR_NAME = "MRG_GLAB_URL_BASE";
const URL_BASE_PADRAO = "https://gitlab.ms.sebrae.com.br/";

const CAMPOS_TEMPLATE = {
  [TOKEN_VAR_NAME]:
    "<preencha: token de acesso pessoal gerado em <URL da sua instância GitLab>/-/user_settings/personal_access_tokens, com escopo 'api'. Se usar tokens diferentes por grupo/projeto, troque este valor por um objeto, ex.: { \"grupo/subgrupo\": \"token1\", \"outro-grupo/projeto\": \"token2\" }>",
  [URL_VAR_NAME]: URL_BASE_PADRAO,
};

/**
 * Um valor entre "<" e ">" é tratado como instrução de preenchimento ainda
 * não substituída pelo usuário, nunca como valor real.
 */
function ehPlaceholder(valor) {
  return typeof valor === "string" && /^<.*>$/.test(valor.trim());
}

function valorValido(valor) {
  return typeof valor === "string" && valor.trim() && !ehPlaceholder(valor);
}

/**
 * Lê ~/.mrg.skills/credenciais.json, um arquivo de configuração compartilhado
 * entre as skills desta família (mrgenesis-skills). Ele é lido do zero a cada
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
 * Resolve o valor de uma variável simples (não aninhada), priorizando a
 * variável de ambiente (para quem preferir configurar assim, ex. CI) e
 * caindo para o arquivo de configuração em seguida. Um placeholder ainda não
 * preenchido conta como "não configurado". Para MRG_GLAB_URL_BASE, se nem
 * env var nem arquivo tiverem um valor válido, cai para URL_BASE_PADRAO
 * (nunca retorna null para essa variável). Não serve para MRG_GLAB_TOKEN
 * quando ele estiver no formato aninhado por grupo/projeto, use obterToken
 * para isso.
 */
function obterVariavel(nome) {
  if (valorValido(process.env[nome])) return process.env[nome].trim();
  const config = lerArquivoConfig();
  if (valorValido(config[nome])) return config[nome].trim();
  if (nome === URL_VAR_NAME) return URL_BASE_PADRAO;
  return null;
}

/**
 * Entre as chaves do mapa de tokens, encontra a mais específica cujo
 * caminho é igual a repoPath ou é um prefixo de diretório dele (ex.: a
 * chave "grupo/subgrupo" bate com o repo "grupo/subgrupo/projeto", mas não
 * com "grupo/subgrupo-outro/projeto"). Em caso de mais de uma bater, vence a
 * mais longa (mais específica).
 */
function encontrarChaveMaisEspecifica(mapa, repoPath) {
  let melhor = null;
  for (const chaveBruta of Object.keys(mapa)) {
    const chave = chaveBruta.replace(/\/+$/, "");
    const bate = repoPath === chave || repoPath.startsWith(`${chave}/`);
    if (bate && (!melhor || chave.length > melhor.length)) {
      melhor = chave;
    }
  }
  return melhor;
}

/**
 * Resolve o token para um repositório específico. MRG_GLAB_TOKEN aceita dois
 * formatos:
 * - string: um único token, usado para qualquer repositório;
 * - objeto: { "caminho/do/grupo-ou-projeto": "token" }, escolhendo a entrada
 *   cujo caminho mais especificamente corresponde a repoPath (ex.: um token
 *   de projeto sobrepõe um token de grupo mais genérico).
 * Sem repoPath (ainda não se sabe o repositório de destino), retorna o
 * primeiro valor válido encontrado, só para sinalizar "existe algo
 * configurado" nas checagens que rodam antes de perguntar o repositório.
 */
function obterToken(repoPath) {
  const bruto = valorValido(process.env[TOKEN_VAR_NAME])
    ? process.env[TOKEN_VAR_NAME].trim()
    : lerArquivoConfig()[TOKEN_VAR_NAME];

  if (typeof bruto === "string") {
    return valorValido(bruto) ? bruto.trim() : null;
  }

  if (bruto && typeof bruto === "object") {
    if (repoPath) {
      const chave = encontrarChaveMaisEspecifica(bruto, repoPath);
      return chave && valorValido(bruto[chave]) ? bruto[chave].trim() : null;
    }
    const algumValido = Object.values(bruto).find(valorValido);
    return algumValido ? algumValido.trim() : null;
  }

  return null;
}

/**
 * Cria ~/.mrg.skills/credenciais.json com um template (todas as chaves
 * conhecidas; MRG_GLAB_URL_BASE já preenchida com URL_BASE_PADRAO,
 * MRG_GLAB_TOKEN com a instrução de preenchimento no lugar do valor) caso o
 * arquivo ainda não exista. Nunca sobrescreve um arquivo já existente, para
 * não apagar valores que o usuário já tenha preenchido. Retorna true se
 * acabou de criar o arquivo agora, false se ele já existia.
 */
function garantirArquivoTemplate() {
  if (fs.existsSync(CONFIG_PATH)) return false;

  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(CAMPOS_TEMPLATE, null, 2) + "\n", {
    mode: 0o600,
  });
  fs.chmodSync(CONFIG_PATH, 0o600);
  return true;
}

module.exports = {
  obterVariavel,
  obterToken,
  garantirArquivoTemplate,
  CONFIG_DIR,
  CONFIG_PATH,
  TOKEN_VAR_NAME,
  URL_VAR_NAME,
  URL_BASE_PADRAO,
};
