#!/usr/bin/env node
'use strict';

// Extrai o esqueleto estrutural de UM arquivo: definicoes (funcoes, classes,
// metodos, interfaces...), imports/usings e chamadas/referencias encontradas
// nele. Use isso para entender rapidamente um arquivo antes de mexer nele,
// sem precisar ler o arquivo inteiro linha a linha.
//
// Uso: node scripts/outline.js <caminho-do-arquivo>

const { analyzeFile, detectLanguage } = require('./lib/analyzer');

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Uso: node scripts/outline.js <caminho-do-arquivo>');
    process.exit(1);
  }

  if (!detectLanguage(filePath)) {
    console.error(`Extensao nao suportada para: ${filePath}`);
    console.error('Linguagens suportadas: javascript/typescript/tsx, python, c_sharp, php.');
    process.exit(1);
  }

  const result = await analyzeFile(filePath);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('Erro ao analisar arquivo:', err.message);
  process.exit(1);
});
