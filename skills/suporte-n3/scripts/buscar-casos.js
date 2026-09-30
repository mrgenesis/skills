#!/usr/bin/env node
'use strict';

/**
 * Busca casos parecidos na base de conhecimento, lendo SOMENTE o frontmatter
 * de cada arquivo .md (nunca o corpo inteiro), pelos mesmos motivos de
 * performance e foco descritos em SKILL.md: o frontmatter já concentra tudo
 * que é comparável (titulo, sintomas, tags, sistemas, causa_raiz).
 *
 * Uso:
 *   node buscar-casos.js --base <pasta-base-conhecimento> --termos "termo1,termo2,termo3"
 *   node buscar-casos.js --base <pasta-base-conhecimento> --id <id_chamado>
 *
 * Com --termos, busca casos parecidos por sintoma. So entram casos com
 * status "resolvido": os pendentes ainda nao tem causa raiz confirmada,
 * entao nao servem como solucao para outro chamado. Arquivos sem status sao
 * tratados como "resolvido" (registros anteriores a esse campo).
 *
 * Com --id, devolve o(s) registro(s) daquele chamado, com qualquer status,
 * seja como caso principal (id_chamado) ou como ocorrencia posterior
 * (chamados_relacionados). E o que a skill usa para retomar um atendimento
 * pendente (sessao anterior encerrada com nota tipo 20).
 *
 * Cada resultado traz total_chamados (o chamado original + as ocorrencias
 * em chamados_relacionados), que mostra o quanto o erro esta se repetindo.
 *
 * Saida (JSON): { baseExiste, totalArquivos, resultados: [...] }
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { base: null, termos: '', id: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') args.base = argv[++i];
    else if (a === '--termos') args.termos = argv[++i];
    else if (a === '--id') args.id = argv[++i];
  }
  return args;
}

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function limparValor(v) {
  return v.trim().replace(/^["']|["']$/g, '');
}

function parseFrontmatterSimples(bloco) {
  const linhas = bloco.split('\n');
  const dados = {};
  let chaveListaAtual = null;

  for (const linha of linhas) {
    const itemLista = linha.match(/^\s*-\s+(.*)$/);
    if (itemLista && chaveListaAtual) {
      dados[chaveListaAtual].push(limparValor(itemLista[1]));
      continue;
    }
    chaveListaAtual = null;

    const par = linha.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!par) continue;
    const chave = par[1];
    const restante = par[2].trim();

    if (restante === '') {
      dados[chave] = [];
      chaveListaAtual = chave;
    } else if (restante.startsWith('[') && restante.endsWith(']')) {
      dados[chave] = restante
        .slice(1, -1)
        .split(',')
        .map((s) => limparValor(s.trim()))
        .filter(Boolean);
    } else {
      dados[chave] = limparValor(restante);
    }
  }
  return dados;
}

function extrairFrontmatter(caminhoArquivo) {
  const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
  if (!conteudo.startsWith('---')) return null;
  const fimIdx = conteudo.indexOf('\n---', 3);
  if (fimIdx === -1) return null;
  return parseFrontmatterSimples(conteudo.slice(3, fimIdx).trim());
}

function montarBlobDeBusca(dados) {
  const partes = [
    dados.titulo,
    dados.causa_raiz,
    ...(Array.isArray(dados.sintomas) ? dados.sintomas : []),
    ...(Array.isArray(dados.tags) ? dados.tags : []),
    ...(Array.isArray(dados.sistemas) ? dados.sistemas : []),
  ];
  return normalizar(partes.filter(Boolean).join(' | '));
}

function main() {
  const { base, termos, id } = parseArgs(process.argv.slice(2));
  if (!base || (!termos && !id)) {
    console.error('Uso: node buscar-casos.js --base <pasta-base-conhecimento> (--termos "termo1,termo2" | --id <id_chamado>)');
    process.exit(1);
  }

  if (!fs.existsSync(base)) {
    console.log(JSON.stringify({ baseExiste: false, totalArquivos: 0, resultados: [] }, null, 2));
    return;
  }

  const termosLista = termos
    .split(',')
    .map((t) => normalizar(t.trim()))
    .filter(Boolean);

  const arquivos = fs.readdirSync(base).filter((f) => f.endsWith('.md'));
  const resultados = [];

  for (const arquivo of arquivos) {
    const caminho = path.join(base, arquivo);
    let dados;
    try {
      dados = extrairFrontmatter(caminho);
    } catch (e) {
      continue;
    }
    if (!dados) continue;

    const status = dados.status || 'resolvido';

    if (id) {
      const alvo = String(id).trim();
      const relacionados = Array.isArray(dados.chamados_relacionados) ? dados.chamados_relacionados : [];
      const ehPrincipal = String(dados.id_chamado || '').trim() === alvo;
      if (!ehPrincipal && !relacionados.some((r) => String(r).trim() === alvo)) continue;
    } else if (status !== 'resolvido') {
      continue;
    }

    const blob = montarBlobDeBusca(dados);
    let score = 0;
    for (const termo of termosLista) {
      if (termo && blob.includes(termo)) score++;
    }

    resultados.push({
      arquivo,
      score,
      id_chamado: dados.id_chamado || null,
      status,
      slug: dados.slug || null,
      titulo: dados.titulo || null,
      sistemas: dados.sistemas || [],
      tags: dados.tags || [],
      causa_raiz: dados.causa_raiz || null,
      data_resolucao: dados.data_resolucao || null,
      issue: dados.issue || null,
      tipo_solucao: dados.tipo_solucao || null,
      chamados_relacionados: Array.isArray(dados.chamados_relacionados) ? dados.chamados_relacionados : [],
      total_chamados: 1 + (Array.isArray(dados.chamados_relacionados) ? dados.chamados_relacionados.length : 0),
    });
  }

  if (id) {
    console.log(JSON.stringify({
      baseExiste: true,
      totalArquivos: arquivos.length,
      resultados,
    }, null, 2));
    return;
  }

  resultados.sort((a, b) => b.score - a.score);
  const relevantes = resultados.filter((r) => r.score > 0);

  console.log(JSON.stringify({
    baseExiste: true,
    totalArquivos: arquivos.length,
    resultados: (relevantes.length > 0 ? relevantes : resultados).slice(0, 10),
  }, null, 2));
}

main();
