'use strict';

const fs = require('fs');
const path = require('path');

const Parser = require(path.join(__dirname, '..', '..', 'vendor', 'runtime', 'tree-sitter.js'));

const VENDOR_DIR = path.join(__dirname, '..', '..', 'vendor');
const GRAMMARS_DIR = path.join(VENDOR_DIR, 'grammars');
const QUERIES_DIR = path.join(VENDOR_DIR, 'queries');

// Uma linguagem pode ter varias extensoes (ex: .js/.jsx usam a mesma gramatica).
const LANGUAGES = {
  javascript: { extensions: ['.js', '.mjs', '.cjs', '.jsx'], wasm: 'tree-sitter-javascript.wasm', query: 'javascript.scm' },
  typescript: { extensions: ['.ts'], wasm: 'tree-sitter-typescript.wasm', query: 'typescript.scm' },
  tsx: { extensions: ['.tsx'], wasm: 'tree-sitter-tsx.wasm', query: 'tsx.scm' },
  python: { extensions: ['.py'], wasm: 'tree-sitter-python.wasm', query: 'python.scm' },
  c_sharp: { extensions: ['.cs'], wasm: 'tree-sitter-c_sharp.wasm', query: 'c_sharp.scm' },
  php: { extensions: ['.php'], wasm: 'tree-sitter-php.wasm', query: 'php.scm' },
};

const EXTENSION_TO_LANGUAGE = {};
for (const [langId, cfg] of Object.entries(LANGUAGES)) {
  for (const ext of cfg.extensions) EXTENSION_TO_LANGUAGE[ext] = langId;
}

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules', 'vendor', '.git', 'dist', 'build', 'out', 'bin', 'obj',
  '__pycache__', '.venv', 'venv', '.tox', 'target', '.next', 'coverage',
]);

let parserInitialized = false;
const languageCache = new Map(); // langId -> { language, query }

function detectLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return EXTENSION_TO_LANGUAGE[ext] || null;
}

async function ensureParserInitialized() {
  if (!parserInitialized) {
    await Parser.init();
    parserInitialized = true;
  }
}

async function loadLanguage(langId) {
  if (languageCache.has(langId)) return languageCache.get(langId);

  const cfg = LANGUAGES[langId];
  if (!cfg) throw new Error(`Linguagem desconhecida: ${langId}`);

  await ensureParserInitialized();

  const wasmPath = path.join(GRAMMARS_DIR, cfg.wasm);
  const language = await Parser.Language.load(wasmPath);

  const querySource = fs.readFileSync(path.join(QUERIES_DIR, cfg.query), 'utf8');
  const query = language.query(querySource);

  const entry = { language, query };
  languageCache.set(langId, entry);
  return entry;
}

// Converte o nome bruto da captura da query ("definition.function", "reference.call",
// "import") na dupla {group, kind} usada na saida ("definition"/"function").
function splitCaptureName(name) {
  const dot = name.indexOf('.');
  if (dot === -1) return { group: name, kind: null };
  return { group: name.slice(0, dot), kind: name.slice(dot + 1) };
}

function nodeToLocation(node) {
  return {
    line: node.startPosition.row + 1,
    endLine: node.endPosition.row + 1,
    column: node.startPosition.column + 1,
  };
}

function snippetOf(node, maxLen = 120) {
  const text = node.text.replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

/**
 * Analisa um unico arquivo e retorna simbolos categorizados: definitions,
 * references e imports. Cada entrada carrega nome, linha e um snippet curto
 * para o modelo decidir rapido se aquilo importa, sem precisar reler o arquivo inteiro.
 */
async function analyzeFile(filePath) {
  const langId = detectLanguage(filePath);
  if (!langId) return null;

  const { language, query } = await loadLanguage(langId);

  const parser = new Parser();
  parser.setLanguage(language);

  const source = fs.readFileSync(filePath, 'utf8');
  const tree = parser.parse(source);

  const result = { file: filePath, language: langId, definitions: [], references: [], imports: [] };

  for (const match of query.matches(tree.rootNode)) {
    let mainCapture = null;
    let nameCapture = null;
    for (const capture of match.captures) {
      const { group } = splitCaptureName(capture.name);
      if (group === 'name') nameCapture = capture;
      else if (group === 'doc' || group.startsWith('_')) continue; // captura auxiliar so para predicados, ex: @_fn
      else mainCapture = capture;
    }
    if (!mainCapture) continue;

    const { group, kind } = splitCaptureName(mainCapture.name);
    const entry = {
      kind: kind || group,
      name: nameCapture ? nameCapture.node.text : null,
      ...nodeToLocation(mainCapture.node),
      snippet: snippetOf(mainCapture.node),
    };

    if (group === 'definition') result.definitions.push(entry);
    else if (group === 'reference') result.references.push(entry);
    else if (group === 'import') result.imports.push(entry);
  }

  return result;
}

/**
 * Percorre recursivamente um diretorio retornando os caminhos de todo arquivo
 * em uma linguagem suportada, pulando pastas de dependencias/build conhecidas.
 */
function* walkSourceFiles(rootDir, { ignoreDirs = DEFAULT_IGNORED_DIRS } = {}) {
  const stack = [rootDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.') {
        if (entry.isDirectory() && !ignoreDirs.has(entry.name)) {
          // permite entrar em dotfolders nao listados só se o caller quiser;
          // por padrao pulamos qualquer pasta oculta para evitar .git etc.
        }
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) stack.push(fullPath);
      } else if (entry.isFile()) {
        if (detectLanguage(fullPath)) yield fullPath;
      }
    }
  }
}

module.exports = {
  LANGUAGES,
  detectLanguage,
  analyzeFile,
  walkSourceFiles,
};
