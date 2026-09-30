#!/usr/bin/env node
/**
 * Consulta os dados de uma issue existente no GitLab (título, descrição,
 * estado, labels, responsáveis, milestone etc.) e, opcionalmente, seus
 * comentários, via API do GitLab.
 *
 * Uso:
 *   node consultar-issue.js --repo <owner/projeto> --id <iid> [--comments]
 *
 * --repo e --id são obrigatórios. --id é o IID da issue (o número que
 * aparece na URL, não o ID interno do GitLab). --comments também busca as
 * notas da issue (comentários e eventos de sistema, ex.: mudança de label).
 *
 * Saída (stdout, JSON):
 *   Sucesso: { "ok": true, "action": "view", "issue": {...} }
 *            (com --comments, também "comments": [...])
 *   Falha:   { "ok": false, "action": "view", "error": "..." }
 */

const { parseArgs } = require("node:util");
const { obterIssue, listarNotasIssue } = require("./lib/gitlab-issues");

function lerOpcoes() {
  const { values } = parseArgs({
    options: {
      repo: { type: "string" },
      id: { type: "string" },
      comments: { type: "boolean", default: false },
    },
  });
  return values;
}

function main() {
  const opcoes = lerOpcoes();

  if (!opcoes.repo) {
    console.log(JSON.stringify({ ok: false, action: "view", error: "--repo é obrigatório" }));
    process.exitCode = 1;
    return;
  }

  if (!opcoes.id) {
    console.log(JSON.stringify({ ok: false, action: "view", error: "--id é obrigatório" }));
    process.exitCode = 1;
    return;
  }

  const resultadoIssue = obterIssue(opcoes.repo, opcoes.id);
  if (!resultadoIssue.ok) {
    console.log(JSON.stringify({ ok: false, action: "view", error: resultadoIssue.error }));
    process.exitCode = 1;
    return;
  }

  const saida = { ok: true, action: "view", issue: resultadoIssue.issue };

  if (opcoes.comments) {
    const resultadoNotas = listarNotasIssue(opcoes.repo, opcoes.id);
    if (!resultadoNotas.ok) {
      console.log(
        JSON.stringify({ ok: false, action: "view", issue: resultadoIssue.issue, error: resultadoNotas.error })
      );
      process.exitCode = 1;
      return;
    }
    saida.comments = resultadoNotas.notas;
  }

  console.log(JSON.stringify(saida));
}

main();
