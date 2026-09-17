#!/usr/bin/env node
/**
 * Publica uma issue no GitLab via `glab issue create`.
 *
 * Uso:
 *   node publicar-issue.js --repo <owner/projeto> --title "Título" --description-file caminho.md [opções]
 *   node publicar-issue.js --repo <owner/projeto> --title "Título" --description "Corpo em markdown" [opções]
 *
 * --repo é obrigatório: o repositório de destino faz parte do escopo da
 * conversa (é a skill/usuário quem decide, não o diretório onde o script
 * roda), então nunca deve ser inferido do remote do diretório atual.
 *
 * Opções:
 *   --repo <owner/projeto>      Repositório alvo (obrigatório)
 *   --label <a,b,c>             Labels separadas por vírgula
 *   --assignee <user1,user2>    Usuários responsáveis, separados por vírgula
 *   --milestone <nome>          Milestone a associar
 *   --confidential              Marca a issue como confidencial
 *
 * Saída (stdout, JSON):
 *   Sucesso: { "ok": true, "action": "create", "issueUrl": "...", "issueIid": 123 }
 *   Falha:   { "ok": false, "action": "create", "error": "..." }
 */

const { parseArgs } = require("node:util");
const fs = require("node:fs");
const { executarGlab } = require("./lib/executar-glab");

function lerOpcoes() {
  const { values } = parseArgs({
    options: {
      title: { type: "string" },
      description: { type: "string" },
      "description-file": { type: "string" },
      repo: { type: "string" },
      label: { type: "string" },
      assignee: { type: "string" },
      milestone: { type: "string" },
      confidential: { type: "boolean", default: false },
    },
  });
  return values;
}

function resolverDescricao(opcoes) {
  if (opcoes["description-file"]) {
    return fs.readFileSync(opcoes["description-file"], "utf8");
  }
  return opcoes.description || "";
}

function main() {
  const opcoes = lerOpcoes();

  if (!opcoes.repo) {
    console.log(
      JSON.stringify({ ok: false, action: "create", error: "--repo é obrigatório" })
    );
    process.exitCode = 1;
    return;
  }

  if (!opcoes.title) {
    console.log(
      JSON.stringify({ ok: false, action: "create", error: "--title é obrigatório" })
    );
    process.exitCode = 1;
    return;
  }

  let descricao;
  try {
    descricao = resolverDescricao(opcoes);
  } catch (erro) {
    console.log(
      JSON.stringify({
        ok: false,
        action: "create",
        error: `não foi possível ler --description-file: ${erro.message}`,
      })
    );
    process.exitCode = 1;
    return;
  }

  const args = ["issue", "create", "--title", opcoes.title, "--description", descricao];

  if (opcoes.repo) args.push("--repo", opcoes.repo);
  if (opcoes.label) args.push("--label", opcoes.label);
  if (opcoes.assignee) args.push("--assignee", opcoes.assignee);
  if (opcoes.milestone) args.push("--milestone", opcoes.milestone);
  if (opcoes.confidential) args.push("--confidential");

  const resultado = executarGlab(args, opcoes.repo);

  if (!resultado.ok) {
    console.log(JSON.stringify({ ok: false, action: "create", error: resultado.error }));
    process.exitCode = 1;
    return;
  }

  const matchUrl = resultado.stdout.match(/https?:\/\/\S+\/issues\/(\d+)\S*/);

  console.log(
    JSON.stringify({
      ok: true,
      action: "create",
      issueUrl: matchUrl ? matchUrl[0] : null,
      issueIid: matchUrl ? Number(matchUrl[1]) : null,
      stdout: resultado.stdout,
    })
  );
}

main();
