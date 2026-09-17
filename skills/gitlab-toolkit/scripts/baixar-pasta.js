#!/usr/bin/env node
/**
 * Baixa todo o conteúdo de uma pasta de um repositório GitLab
 * (recursivamente), recriando localmente a mesma estrutura de pastas do
 * repositório, sem precisar clonar o repositório inteiro.
 *
 * Uso:
 *   node baixar-pasta.js --repo <owner/projeto> --path <pasta/no/repo> --output <pasta/local> [--ref <branch|tag|commit>]
 *
 * --repo, --path e --output são obrigatórios. --ref é opcional (padrão:
 * "HEAD", ou seja, a branch default do repositório).
 *
 * Cada arquivo encontrado dentro de --path é gravado em
 * "<output>/<caminho completo do arquivo a partir da raiz do repositório>",
 * não só a partir de --path: por exemplo, --path docs/adrs com --output
 * ./destino produz ./destino/docs/adrs/0001-arquivo.md, preservando a
 * estrutura de pastas do repositório em vez de nivelar os arquivos direto
 * dentro de --output.
 *
 * Usa os endpoints "List repository tree" (para listar os arquivos,
 * recursivamente e com paginação) e "Get raw file" (um por arquivo listado)
 * da API do GitLab, ver lib/gitlab-arquivos.js.
 *
 * Saída (stdout, JSON):
 *   Sucesso (todos os arquivos):   { "ok": true, "action": "download-folder", "downloaded": 3, "total": 3, "files": [...] }
 *   Falha parcial (alguns falharam): { "ok": false, "action": "download-folder", "downloaded": 2, "total": 3, "files": [...] }
 *   Falha total (--path vazio/não encontrado, ou erro ao listar): { "ok": false, "action": "download-folder", "error": "..." }
 *
 * Cada item de "files" é { "path": "caminho/no/repo.md", "ok": bool, "localPath"?: "...", "bytes"?: N, "error"?: "..." }.
 */

const { parseArgs } = require("node:util");
const fs = require("node:fs");
const path = require("node:path");
const { baixarArquivoRaw, listarArquivosDaPasta } = require("./lib/gitlab-arquivos");

function lerOpcoes() {
  const { values } = parseArgs({
    options: {
      repo: { type: "string" },
      path: { type: "string" },
      output: { type: "string" },
      ref: { type: "string", default: "HEAD" },
    },
  });
  return values;
}

function falha(erro) {
  console.log(JSON.stringify({ ok: false, action: "download-folder", error: erro }));
  process.exitCode = 1;
}

function baixarUmArquivo(repo, filePath, ref, outputBase) {
  const resultado = baixarArquivoRaw(repo, filePath, ref);
  if (!resultado.ok) {
    return { path: filePath, ok: false, error: resultado.error };
  }

  const localPath = path.join(outputBase, filePath);
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, resultado.stdout);

  return { path: filePath, ok: true, localPath, bytes: resultado.stdout.length };
}

function main() {
  const opcoes = lerOpcoes();

  if (!opcoes.repo) return falha("--repo é obrigatório");
  if (!opcoes.path) return falha("--path é obrigatório");
  if (!opcoes.output) return falha("--output é obrigatório");

  const listagem = listarArquivosDaPasta(opcoes.repo, opcoes.path, opcoes.ref);
  if (!listagem.ok) return falha(listagem.error);

  if (listagem.itens.length === 0) {
    return falha(
      `nenhum arquivo encontrado em "${opcoes.path}" (confira se o caminho e --ref estão corretos)`
    );
  }

  const arquivos = listagem.itens.map((item) =>
    baixarUmArquivo(opcoes.repo, item.path, opcoes.ref, opcoes.output)
  );

  const sucesso = arquivos.filter((arquivo) => arquivo.ok);
  const falhou = arquivos.some((arquivo) => !arquivo.ok);

  console.log(
    JSON.stringify({
      ok: !falhou,
      action: "download-folder",
      downloaded: sucesso.length,
      total: arquivos.length,
      files: arquivos,
    })
  );
  if (falhou) process.exitCode = 1;
}

main();
