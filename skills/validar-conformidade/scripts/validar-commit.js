#!/usr/bin/env node
'use strict';

/**
 * Confere mensagens de commit contra as regras objetivas do Anexo III
 * (Guia de Desenvolvimento com Git) do PROP 2.4.3.1. Só cobre o que dá para
 * verificar mecanicamente; atomicidade e clareza ficam para o julgamento de
 * quem chamou o script (ver SKILL.md).
 *
 * Uso:
 *   node validar-commit.js --mensagem "<mensagem completa>" [--titulo-issue "<titulo>"]
 *   node validar-commit.js --arquivo <arquivo-com-a-mensagem> [--titulo-issue "<titulo>"]
 *   node validar-commit.js --repo <caminho> --intervalo <ex.: main..HEAD>
 *
 * Saida (JSON): { totalCommits, totalComErros, commits: [{ hash, titulo,
 *   concluiIssue, erros: [...], avisos: [...] }] }
 *
 * "erros" descumprem regra do guia; "avisos" sao regras com "evite" no texto
 * do guia ou heuristicas (idioma, tempo verbal) que podem dar falso positivo.
 */

const fs = require('fs');
const { execFileSync } = require('child_process');

const TIPOS = ['feat', 'fix', 'chore', 'refactor', 'style', 'test', 'docs', 'perf'];
const LIMITE_TITULO = 50;
const LIMITE_CORPO = 72;

// Verbos em ingles que costumam abrir titulos de commit; serve so como aviso.
const VERBOS_INGLES = new Set([
  'add', 'adds', 'added', 'fix', 'fixes', 'fixed', 'update', 'updates', 'updated',
  'removes', 'removed', 'create', 'creates', 'created', 'implement',
  'implements', 'implemented', 'refactor', 'refactored', 'change', 'changes',
  'changed', 'improve', 'improves', 'improved', 'delete', 'deleted', 'rename',
  'renamed', 'moved', 'bump', 'merge', 'revert', 'allow', 'make',
  'set', 'handle', 'prevent', 'support', 'enable', 'disable', 'initial',
]);

function parseArgs(argv) {
  const args = { mensagem: null, arquivo: null, repo: null, intervalo: null, tituloIssue: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--mensagem') args.mensagem = argv[++i];
    else if (a === '--arquivo') args.arquivo = argv[++i];
    else if (a === '--repo') args.repo = argv[++i];
    else if (a === '--intervalo') args.intervalo = argv[++i];
    else if (a === '--titulo-issue') args.tituloIssue = argv[++i];
  }
  return args;
}

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function validarMensagem(mensagem, tituloIssue) {
  const erros = [];
  const avisos = [];
  // Linhas de comentario do git (editor) nao fazem parte da mensagem.
  const linhas = mensagem.replace(/\r\n/g, '\n').split('\n').filter((l) => !l.startsWith('#'));
  while (linhas.length && linhas[linhas.length - 1].trim() === '') linhas.pop();
  const titulo = (linhas[0] || '').trim();
  const resto = linhas.slice(1);

  const resultado = { titulo, concluiIssue: false, erros, avisos };

  if (!titulo) {
    erros.push('Mensagem sem título.');
    return resultado;
  }
  if (/^Merge (branch|remote-tracking branch|pull request|.* into )/i.test(titulo)) {
    avisos.push('Commit de merge gerado pelo Git; regras de título não se aplicam.');
    return resultado;
  }
  if (titulo === 'cmd: track') {
    return resultado; // commit vazio previsto no início do desenvolvimento
  }

  const m = titulo.match(/^([a-zA-Z]+)(\([^)]*\))?(!)?: (.+)$/);
  let quebra = false;
  let descricao = '';
  if (!m) {
    erros.push(
      `Título fora do formato Conventional Commits "<tipo>: <descrição>" (tipos: ${TIPOS.join(', ')}).`
    );
  } else {
    const tipo = m[1];
    quebra = Boolean(m[3]);
    descricao = m[4].trim();
    if (!TIPOS.includes(tipo)) {
      erros.push(`Tipo "${tipo}" não está entre os permitidos: ${TIPOS.join(', ')}.`);
    } else if (tipo !== tipo.toLowerCase()) {
      erros.push(`Tipo "${tipo}" deve ser escrito em minúsculas.`);
    }
    const primeira = normalizar(descricao.split(/\s+/)[0] || '');
    if (VERBOS_INGLES.has(primeira)) {
      avisos.push(`Descrição parece estar em inglês ("${descricao.split(/\s+/)[0]}"); o guia exige português.`);
    } else if (/(ado|ada|ido|ida|ando|endo|indo)$/.test(primeira) && primeira.length > 4) {
      avisos.push(
        `Descrição parece não estar no imperativo ("${descricao.split(/\s+/)[0]}"); o guia usa a forma "adiciona", "corrige", "impede".`
      );
    }
    if (/\.$/.test(descricao)) {
      avisos.push('Título termina com ponto final.');
    }
  }

  // O guia limita a descrição do título (o texto após "<tipo>: "), não a linha inteira.
  const medido = descricao || titulo;
  if (medido.length > LIMITE_TITULO) {
    avisos.push(
      `Descrição do título com ${medido.length} caracteres; o guia pede para evitar ultrapassar ${LIMITE_TITULO}.`
    );
  }

  if (resto.length && resto[0].trim() !== '') {
    erros.push('Falta a linha em branco entre o título e o corpo.');
  }

  const corpo = resto.filter((l, i) => !(i === 0 && l.trim() === ''));
  corpo.forEach((linha, i) => {
    if (linha.length > LIMITE_CORPO && !/https?:\/\//.test(linha)) {
      avisos.push(
        `Linha ${i + 3} da mensagem com ${linha.length} caracteres; o guia pede para evitar ultrapassar ${LIMITE_CORPO}.`
      );
    }
  });

  const textoCorpo = corpo.join('\n');
  const temBreaking = /^BREAKING[ -]CHANGE:/m.test(textoCorpo);
  const fecha = textoCorpo.match(/^\s*(Closes|Fixes|Resolves|Close|Fix|Resolve)\s+#(\d+)/im);

  if (temBreaking && !quebra) {
    erros.push('Corpo tem "BREAKING CHANGE:" mas o título não tem "!" (ex.: "feat!: ...").');
  }
  if (quebra && !temBreaking) {
    avisos.push('Título marca breaking change ("!") mas o corpo não explica o impacto com "BREAKING CHANGE:".');
  }

  if (fecha) {
    resultado.concluiIssue = true;
    if (fecha[1] !== 'Closes') {
      avisos.push(`Usado "${fecha[1]} #${fecha[2]}"; o guia determina "Closes #<ID da issue>".`);
    }
    // Corpo descritivo: alguma linha que nao seja rodape/comando.
    const rodape = /^\s*(Closes|Fixes|Resolves|Close|Fix|Resolve)\s+#\d+|^\s*Chamado\s+\d+|^\s*CMD:|^\s*BREAKING[ -]CHANGE:|^\s*[A-Za-z-]+:\s/i;
    const descritivas = corpo.filter((l) => l.trim() && !rodape.test(l));
    if (!descritivas.length) {
      erros.push('Commit que conclui issue precisa de corpo descrevendo o commit (além do "Closes #").');
    }
    if (tituloIssue && descricao && normalizar(descricao) !== normalizar(tituloIssue)) {
      erros.push(
        `Título do commit ("${descricao}") diferente do título da issue ("${tituloIssue}"); o guia exige o mesmo nome.`
      );
    }
  } else if (tituloIssue) {
    erros.push('Informado --titulo-issue, mas o corpo não tem "Closes #<ID da issue>".');
  }

  return resultado;
}

function lerCommitsDoRepo(repo, intervalo) {
  const saida = execFileSync('git', ['-C', repo, 'log', '--format=%H%x1f%B%x1e', intervalo], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return saida
    .split('\x1e')
    .map((s) => s.replace(/^\n+/, ''))
    .filter((s) => s.trim())
    .map((s) => {
      const [hash, mensagem] = s.split('\x1f');
      return { hash: hash.trim().slice(0, 12), mensagem: mensagem || '' };
    });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let entradas;
  try {
    if (args.mensagem !== null) entradas = [{ hash: null, mensagem: args.mensagem }];
    else if (args.arquivo) entradas = [{ hash: null, mensagem: fs.readFileSync(args.arquivo, 'utf8') }];
    else if (args.repo && args.intervalo) entradas = lerCommitsDoRepo(args.repo, args.intervalo);
    else {
      console.error('Uso: --mensagem "<texto>" | --arquivo <caminho> | --repo <caminho> --intervalo <a..b> [--titulo-issue "<titulo>"]');
      process.exit(2);
    }
  } catch (e) {
    console.log(JSON.stringify({ erro: e.message }, null, 2));
    process.exit(1);
  }

  const commits = entradas.map(({ hash, mensagem }) => ({
    hash,
    ...validarMensagem(mensagem, args.tituloIssue),
  }));
  console.log(
    JSON.stringify(
      {
        totalCommits: commits.length,
        totalComErros: commits.filter((c) => c.erros.length).length,
        commits,
      },
      null,
      2
    )
  );
}

main();
