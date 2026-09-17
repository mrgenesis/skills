#!/usr/bin/env node
/**
 * Baixa um arquivo específico de um repositório GitLab (ex.: uma ADR em
 * docs/adrs/xyz.md) via `glab api`, sem precisar clonar o repositório.
 *
 * Uso:
 *   node baixar-arquivo.js --repo <owner/projeto> --path <caminho/no/repo> --output <caminho/local> [--ref <branch|tag|commit>]
 *
 * --repo, --path e --output são obrigatórios. --ref é opcional (padrão:
 * "HEAD", ou seja, a branch default do repositório).
 *
 * Usa o endpoint "Get raw file" da API do GitLab
 * (projects/:id/repository/files/:file_path/raw), autenticado da mesma
 * forma que os outros scripts desta skill (ver lib/executar-glab.js e
 * lib/config-vars.js). `--repo` e `--path` são url-encoded automaticamente,
 * incluindo as barras internas (exigência da API para o parâmetro
 * file_path), ver lib/gitlab-arquivos.js.
 *
 * Para baixar uma pasta inteira (todos os arquivos dentro dela,
 * recursivamente), use scripts/baixar-pasta.js em vez deste script: este
 * endpoint só existe para um arquivo específico, uma pasta nesse lugar
 * retorna 404.
 *
 * Saída (stdout, JSON):
 *   Sucesso: { "ok": true, "action": "download", "localPath": "...", "bytes": 1234 }
 *   Falha:   { "ok": false, "action": "download", "error": "..." }
 */

const { parseArgs } = require("node:util");
const fs = require("node:fs");
const path = require("node:path");
const { baixarArquivoRaw } = require("./lib/gitlab-arquivos");

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
  console.log(JSON.stringify({ ok: false, action: "download", error: erro }));
  process.exitCode = 1;
}

function main() {
  const opcoes = lerOpcoes();

  if (!opcoes.repo) return falha("--repo é obrigatório");
  if (!opcoes.path) return falha("--path é obrigatório");
  if (!opcoes.output) return falha("--output é obrigatório");

  const resultado = baixarArquivoRaw(opcoes.repo, opcoes.path, opcoes.ref);

  if (!resultado.ok) {
    return falha(resultado.error);
  }

  fs.mkdirSync(path.dirname(opcoes.output), { recursive: true });
  fs.writeFileSync(opcoes.output, resultado.stdout);

  console.log(
    JSON.stringify({
      ok: true,
      action: "download",
      localPath: opcoes.output,
      bytes: resultado.stdout.length,
    })
  );
}

main();
