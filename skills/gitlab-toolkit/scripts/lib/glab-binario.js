const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const NOME_EXECUTAVEL = process.platform === "win32" ? "glab.exe" : "glab";

// __dirname é scripts/lib; sobe dois níveis para chegar na raiz da skill,
// funciona tanto no repositório de desenvolvimento quanto numa instalação
// via plugin (o caminho relativo entre este arquivo e a raiz da skill é o
// mesmo nos dois casos).
const SKILL_DIR = path.join(__dirname, "..", "..");
const GLAB_VENDOR_DIR = path.join(SKILL_DIR, "vendor", "glab");
const GLAB_BIN_DIR = path.join(GLAB_VENDOR_DIR, "bin");
const GLAB_BIN_PATH = path.join(GLAB_BIN_DIR, NOME_EXECUTAVEL);

let caminhoEmCache = null;

function glabDoSistemaFunciona() {
  try {
    execFileSync("glab", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve qual executável do glab usar nesta execução, sempre priorizando
 * um `glab` já disponível no PATH sobre o binário vendorizado por esta
 * skill: se o usuário já tem o glab instalado (de qualquer forma: gerenciador
 * de pacotes, instalação manual, etc.), não há motivo para baixar outra
 * cópia. Só cai para GLAB_BIN_PATH (baixado por instalar-glab.js, dentro da
 * própria skill em vendor/glab/bin, nunca commitado, ver .gitignore) quando
 * não existir nenhum glab no PATH.
 *
 * O resultado é cacheado no processo: scripts que chamam o glab várias vezes
 * na mesma execução (ex.: editar-issue.js, que pode rodar update + close)
 * não precisam checar de novo a cada chamada.
 */
function resolverCaminhoGlab() {
  if (caminhoEmCache) return caminhoEmCache;

  if (glabDoSistemaFunciona()) {
    caminhoEmCache = "glab";
  } else if (fs.existsSync(GLAB_BIN_PATH)) {
    caminhoEmCache = GLAB_BIN_PATH;
  } else {
    // Nenhum dos dois disponível: mantém "glab" mesmo assim, para o erro de
    // spawn (ENOENT) explicar o problema com a mensagem padrão do sistema,
    // em vez de mascarar com um caminho vendorizado que também não existe.
    caminhoEmCache = "glab";
  }

  return caminhoEmCache;
}

module.exports = {
  NOME_EXECUTAVEL,
  GLAB_VENDOR_DIR,
  GLAB_BIN_DIR,
  GLAB_BIN_PATH,
  glabDoSistemaFunciona,
  resolverCaminhoGlab,
};
