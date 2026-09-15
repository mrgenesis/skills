#!/usr/bin/env node
'use strict';

// Varre um diretorio inteiro procurando por um simbolo (nome de funcao, classe,
// metodo etc.) e retorna, agrupado por arquivo, toda DEFINICAO e toda REFERENCIA
// (chamada, instanciacao, uso de tipo...) encontrada com esse nome.
//
// Esse e o script central do fluxo "buscar definicao -> buscar todas as
// referencias -> so entao editar": ele responde as duas primeiras perguntas de
// uma vez, para o modelo saber o raio de impacto de uma mudanca antes de fazer
// qualquer edicao em codigo de producao.
//
// Uso:
//   node scripts/find-symbol.js <diretorio-raiz> <nomeDoSimbolo> [opcoes]
//
// Opcoes:
//   --contains       casa por substring em vez de nome exato (default: exato)
//   --kind=<tipo>     filtra so definition, reference ou import (default: todos)
//   --json            forca saida so em JSON, sem o resumo legivel no topo (default ja e JSON,
//                     essa flag existe so para deixar explicito em automacoes)

const path = require('path');
const { analyzeFile, walkSourceFiles } = require('./lib/analyzer');

function parseArgs(argv) {
  const positional = [];
  const options = { contains: false, kind: null };
  for (const arg of argv) {
    if (arg === '--contains') options.contains = true;
    else if (arg.startsWith('--kind=')) options.kind = arg.slice('--kind='.length);
    else if (arg === '--json') options.json = true;
    else positional.push(arg);
  }
  return { positional, options };
}

function matchesName(entryName, target, contains) {
  if (entryName === null) return false;
  return contains ? entryName.includes(target) : entryName === target;
}

async function main() {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const [rootDir, symbolName] = positional;

  if (!rootDir || !symbolName) {
    console.error('Uso: node scripts/find-symbol.js <diretorio-raiz> <nomeDoSimbolo> [--contains] [--kind=definition|reference|import]');
    process.exit(1);
  }

  const results = [];
  let totalDefinitions = 0;
  let totalReferences = 0;
  let totalImports = 0;
  let filesScanned = 0;
  let filesWithErrors = 0;

  for (const filePath of walkSourceFiles(path.resolve(rootDir))) {
    filesScanned++;
    let analysis;
    try {
      analysis = await analyzeFile(filePath);
    } catch (err) {
      filesWithErrors++;
      continue;
    }
    if (!analysis) continue;

    const groups = ['definitions', 'references', 'imports'].filter(
      (g) => !options.kind || g.startsWith(options.kind)
    );

    const matches = [];
    for (const group of groups) {
      for (const entry of analysis[group]) {
        if (matchesName(entry.name, symbolName, options.contains)) {
          matches.push({ group: group.slice(0, -1), ...entry });
        }
      }
    }

    if (matches.length > 0) {
      matches.sort((a, b) => a.line - b.line);
      results.push({ file: filePath, matches });
      totalDefinitions += matches.filter((m) => m.group === 'definition').length;
      totalReferences += matches.filter((m) => m.group === 'reference').length;
      totalImports += matches.filter((m) => m.group === 'import').length;
    }
  }

  const output = {
    symbol: symbolName,
    filesScanned,
    filesWithErrors,
    summary: {
      filesWithMatches: results.length,
      totalDefinitions,
      totalReferences,
      totalImports,
    },
    results,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error('Erro ao buscar simbolo:', err.message);
  process.exit(1);
});
