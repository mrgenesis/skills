#!/usr/bin/env node
/**
 * Edita uma issue existente no GitLab via `glab issue update`
 * (e, opcionalmente, `glab issue close` / `glab issue reopen`).
 *
 * Uso:
 *   node editar-issue.js --repo <owner/projeto> --id 123 [opções]
 *
 * --repo é obrigatório: o repositório de destino faz parte do escopo da
 * conversa (é a skill/usuário quem decide, não o diretório onde o script
 * roda), então nunca deve ser inferido do remote do diretório atual.
 *
 * Opções:
 *   --repo <owner/projeto>      Repositório alvo (obrigatório)
 *   --title <texto>             Novo título
 *   --description <texto>       Nova descrição (substitui a atual)
 *   --description-file <path>   Nova descrição lida de um arquivo markdown
 *   --add-label <a,b>           Labels a adicionar, separadas por vírgula
 *   --remove-label <a,b>        Labels a remover, separadas por vírgula
 *   --assignee <user1,user2>    Novos responsáveis, separados por vírgula
 *   --unassign                  Remove todos os responsáveis
 *   --milestone <nome>          Novo milestone
 *   --close                     Fecha a issue
 *   --reopen                    Reabre a issue
 *
 * Saída (stdout, JSON):
 *   Sucesso: { "ok": true, "action": "update", "issueId": "123", "steps": [...] }
 *   Falha:   { "ok": false, "action": "update", "error": "..." }
 */

const { parseArgs } = require("node:util");
const fs = require("node:fs");
const { executarGlab } = require("./lib/executar-glab");

function lerOpcoes() {
  const { values } = parseArgs({
    options: {
      id: { type: "string" },
      repo: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      "description-file": { type: "string" },
      "add-label": { type: "string" },
      "remove-label": { type: "string" },
      assignee: { type: "string" },
      unassign: { type: "boolean", default: false },
      milestone: { type: "string" },
      close: { type: "boolean", default: false },
      reopen: { type: "boolean", default: false },
    },
  });
  return values;
}

function resolverDescricao(opcoes) {
  if (opcoes["description-file"]) {
    return fs.readFileSync(opcoes["description-file"], "utf8");
  }
  return opcoes.description;
}

function montarArgsUpdate(opcoes, descricao) {
  const args = ["issue", "update", opcoes.id];

  if (opcoes.repo) args.push("--repo", opcoes.repo);
  if (opcoes.title) args.push("--title", opcoes.title);
  if (descricao !== undefined) args.push("--description", descricao);
  if (opcoes["add-label"]) args.push("--label", opcoes["add-label"]);
  if (opcoes["remove-label"]) args.push("--unlabel", opcoes["remove-label"]);
  if (opcoes.assignee) args.push("--assignee", opcoes.assignee);
  if (opcoes.unassign) args.push("--unassign");
  if (opcoes.milestone) args.push("--milestone", opcoes.milestone);

  return args;
}

function main() {
  const opcoes = lerOpcoes();

  if (!opcoes.repo) {
    console.log(
      JSON.stringify({ ok: false, action: "update", error: "--repo é obrigatório" })
    );
    process.exitCode = 1;
    return;
  }

  if (!opcoes.id) {
    console.log(
      JSON.stringify({ ok: false, action: "update", error: "--id é obrigatório" })
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
        action: "update",
        error: `não foi possível ler --description-file: ${erro.message}`,
      })
    );
    process.exitCode = 1;
    return;
  }

  const passos = [];
  const temCampoParaAtualizar =
    opcoes.title ||
    descricao !== undefined ||
    opcoes["add-label"] ||
    opcoes["remove-label"] ||
    opcoes.assignee ||
    opcoes.unassign ||
    opcoes.milestone;

  if (temCampoParaAtualizar) {
    const resultado = executarGlab(montarArgsUpdate(opcoes, descricao), opcoes.repo);
    passos.push({ etapa: "update", ...resultado });
    if (!resultado.ok) {
      console.log(
        JSON.stringify({ ok: false, action: "update", issueId: opcoes.id, error: resultado.error, steps: passos })
      );
      process.exitCode = 1;
      return;
    }
  }

  if (opcoes.close) {
    const args = ["issue", "close", opcoes.id];
    if (opcoes.repo) args.push("--repo", opcoes.repo);
    const resultado = executarGlab(args, opcoes.repo);
    passos.push({ etapa: "close", ...resultado });
    if (!resultado.ok) {
      console.log(
        JSON.stringify({ ok: false, action: "update", issueId: opcoes.id, error: resultado.error, steps: passos })
      );
      process.exitCode = 1;
      return;
    }
  }

  if (opcoes.reopen) {
    const args = ["issue", "reopen", opcoes.id];
    if (opcoes.repo) args.push("--repo", opcoes.repo);
    const resultado = executarGlab(args, opcoes.repo);
    passos.push({ etapa: "reopen", ...resultado });
    if (!resultado.ok) {
      console.log(
        JSON.stringify({ ok: false, action: "update", issueId: opcoes.id, error: resultado.error, steps: passos })
      );
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    JSON.stringify({ ok: true, action: "update", issueId: opcoes.id, steps: passos })
  );
}

main();
