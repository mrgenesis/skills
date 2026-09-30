# Consultar uma issue existente

Use `scripts/consultar-issue.js` quando o usuário (ou a skill que te chamou) quiser saber o estado atual de uma issue já existente, sem editar nada: se está aberta ou fechada, título, descrição, labels, responsáveis, milestone, e opcionalmente os comentários.

Uso:

```
node scripts/consultar-issue.js --repo owner/projeto --id <iid> [--comments]
```

`--repo` é obrigatório, pelo mesmo motivo de `publicar-issue.js` (ver [publicar-issue.md](publicar-issue.md)). `--id` é o IID da issue (o número que aparece na URL, não o ID interno do GitLab). Passe `--comments` também quando precisar do histórico de comentários, não só dos dados da issue; sem essa flag, a consulta não busca os comentários (mais rápida quando não são necessários).

Formato da saída:

```jsonc
// sucesso (sem --comments)
{ "ok": true, "action": "view", "issue": { "iid": 123, "title": "...", "description": "...", "state": "opened" | "closed", "webUrl": "https://.../-/issues/123", "labels": ["bug"], "assignees": ["usuario1"], "author": "usuario2", "milestone": "Sprint 4" | null, "createdAt": "...", "updatedAt": "...", "closedAt": "..." | null, "closedBy": "usuario3" | null } }
// sucesso (com --comments)
{ "ok": true, "action": "view", "issue": {...}, "comments": [ { "id": 1, "author": "usuario1", "body": "...", "createdAt": "...", "system": false } ] }
// falha
{ "ok": false, "action": "view", "error": "..." }
```

`comments` inclui tanto comentários escritos por pessoas (`system: false`) quanto eventos gerados pelo próprio GitLab (`system: true`, ex.: "mudou o milestone para X"), em ordem cronológica. Filtre por `system` se só os comentários de pessoas importarem para o caso de uso. Em caso de falha ao buscar os comentários depois de já ter obtido a issue, a saída ainda traz `issue` preenchido junto do `error`, para não descartar o que já foi obtido.
