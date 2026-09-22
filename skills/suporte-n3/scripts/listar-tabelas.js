#!/usr/bin/env node
'use strict';

/**
 * Extrai tabelas, colunas e chaves de um db-schema.md: le todos os blocos de
 * codigo cercados por ``` e procura CREATE TABLE dentro deles, sem exigir
 * que o bloco esteja marcado como ```sql (o formato de entrada usa blocos
 * genericos com DDL dentro).
 *
 * Uso:
 *   node listar-tabelas.js <caminho-db-schema.md>
 *
 * Saida (JSON): { totalBlocosDeCodigo, totalTabelas, tabelas: [...] }
 *
 * Isto e uma extracao best-effort por regex, nao um parser SQL completo:
 * DDL com sintaxe incomum pode nao ser reconhecido. Sempre que uma coluna
 * ou tipo parecer estranho no resultado, confirme lendo o bloco original em
 * db-schema.md antes de usar esse dado num passo de investigacao.
 */

const fs = require('fs');

function main() {
  const caminho = process.argv[2];
  if (!caminho) {
    console.error('Uso: node listar-tabelas.js <caminho-db-schema.md>');
    process.exit(1);
  }

  const conteudo = fs.readFileSync(caminho, 'utf8');
  const blocos = extrairBlocosDeCodigo(conteudo);

  const tabelas = [];
  for (const bloco of blocos) {
    tabelas.push(...extrairTabelas(bloco));
  }

  console.log(JSON.stringify({
    totalBlocosDeCodigo: blocos.length,
    totalTabelas: tabelas.length,
    tabelas,
  }, null, 2));
}

function extrairBlocosDeCodigo(md) {
  const regex = /```[a-zA-Z]*\n([\s\S]*?)```/g;
  const blocos = [];
  let m;
  while ((m = regex.exec(md)) !== null) {
    blocos.push(m[1]);
  }
  return blocos;
}

function extrairTabelas(sql) {
  const tabelas = [];
  const regexInicio = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`\[]?([a-zA-Z0-9_.]+)["`\]]?\s*\(/gi;
  let m;
  while ((m = regexInicio.exec(sql)) !== null) {
    const nomeTabela = m[1];
    const inicioCorpo = m.index + m[0].length;
    const corpo = extrairCorpoBalanceado(sql, inicioCorpo);
    if (corpo === null) continue;

    // Divide uma unica vez em itens de topo nivel (uma coluna ou constraint
    // por item) e reaproveita para colunas, chaves primarias e estrangeiras,
    // em vez de rodar regex solta no corpo inteiro (isso confundia o token
    // anterior a REFERENCES entre itens diferentes).
    const itens = dividirTopoNivel(corpo);
    tabelas.push({
      nome: nomeTabela,
      colunas: extrairColunas(itens),
      chavesPrimarias: extrairChavesPrimarias(itens),
      chavesEstrangeiras: extrairChavesEstrangeiras(itens),
    });
  }
  return tabelas;
}

function extrairCorpoBalanceado(texto, inicio) {
  let profundidade = 1;
  for (let i = inicio; i < texto.length; i++) {
    if (texto[i] === '(') profundidade++;
    else if (texto[i] === ')') {
      profundidade--;
      if (profundidade === 0) return texto.slice(inicio, i);
    }
  }
  return null;
}

function dividirTopoNivel(corpo) {
  const itens = [];
  let profundidade = 0;
  let atual = '';
  for (const ch of corpo) {
    if (ch === '(') profundidade++;
    if (ch === ')') profundidade--;
    if (ch === ',' && profundidade === 0) {
      itens.push(atual.trim());
      atual = '';
    } else {
      atual += ch;
    }
  }
  if (atual.trim()) itens.push(atual.trim());
  return itens;
}

const PALAVRAS_CONSTRAINT = /^(PRIMARY|FOREIGN|UNIQUE|CONSTRAINT|CHECK|KEY|INDEX)\b/i;

function extrairColunas(itens) {
  return itens
    .filter((item) => !PALAVRAS_CONSTRAINT.test(item.trim()))
    .map((item) => {
      // Tipo pode ter precisao com virgula dentro dos parenteses (ex.:
      // NUMERIC(10,2)), por isso o tipo captura ate o parenteses fechar,
      // nao ate a primeira virgula.
      const m = item.trim().match(/^["`\[]?([a-zA-Z0-9_]+)["`\]]?\s+([a-zA-Z0-9_]+(?:\([^)]*\))?)/);
      if (!m) return null;
      return { nome: m[1], tipo: m[2] };
    })
    .filter(Boolean);
}

function extrairChavesPrimarias(itens) {
  const chaves = new Set();
  for (const item of itens) {
    const trimmed = item.trim();

    const tabelaNivel = trimmed.match(/^PRIMARY\s+KEY\s*\(([^)]+)\)/i);
    if (tabelaNivel) {
      tabelaNivel[1].split(',').forEach((c) => chaves.add(c.trim().replace(/["`\[\]]/g, '')));
      continue;
    }

    if (/\bPRIMARY\s+KEY\b/i.test(trimmed)) {
      const nome = trimmed.match(/^["`\[]?([a-zA-Z0-9_]+)["`\]]?/);
      if (nome) chaves.add(nome[1]);
    }
  }
  return Array.from(chaves);
}

function extrairChavesEstrangeiras(itens) {
  const refs = [];
  for (const item of itens) {
    const trimmed = item.trim();

    // Constraint de tabela: [CONSTRAINT nome] FOREIGN KEY (col[,col2]) REFERENCES tabela(col[,col2])
    const tabelaNivel = trimmed.match(
      /^(?:CONSTRAINT\s+["`\[]?[a-zA-Z0-9_]+["`\]]?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+["`\[]?([a-zA-Z0-9_.]+)["`\]]?\s*\(([^)]+)\)/i
    );
    if (tabelaNivel) {
      const colunas = tabelaNivel[1].split(',').map((c) => c.trim().replace(/["`\[\]]/g, ''));
      const colunasRef = tabelaNivel[3].split(',').map((c) => c.trim().replace(/["`\[\]]/g, ''));
      colunas.forEach((coluna, i) => {
        refs.push({ coluna, tabelaReferenciada: tabelaNivel[2], colunaReferenciada: colunasRef[i] || colunasRef[0] });
      });
      continue;
    }

    // Constraint inline na propria coluna: coluna TIPO ... REFERENCES tabela(col)
    const colunaNivel = trimmed.match(
      /^["`\[]?([a-zA-Z0-9_]+)["`\]]?.*?\bREFERENCES\s+["`\[]?([a-zA-Z0-9_.]+)["`\]]?\s*\(([a-zA-Z0-9_]+)\)/i
    );
    if (colunaNivel) {
      refs.push({ coluna: colunaNivel[1], tabelaReferenciada: colunaNivel[2], colunaReferenciada: colunaNivel[3] });
    }
  }
  return refs;
}

main();
