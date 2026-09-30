# Editar, fechar ou reabrir uma issue existente

Use `scripts/editar-issue.js`, informando `--id` (o IID da issue, o número que aparece na URL, não o ID interno do GitLab) além do `--repo`. Passe só os campos que devem mudar, o resto permanece como está.

Uso:

```
node scripts/editar-issue.js --repo owner/projeto --id <iid> [--title ...] [--description-file ...] [--add-label a,b] [--remove-label a,b] [--assignee user1,user2] [--unassign] [--milestone nome] [--close] [--reopen]
```

`--repo` é obrigatório, pelo mesmo motivo de `publicar-issue.js` (ver [publicar-issue.md](publicar-issue.md)).

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "update", "issueId": "123", "steps": [ { "etapa": "update" | "close" | "reopen", "ok": true, "stdout": "...", "stderr": "..." } ] }
// falha
{ "ok": false, "action": "update", "issueId": "123", "error": "...", "steps": [...] }
```

`steps` mostra cada etapa executada em ordem (atualização de campos, depois fechar/reabrir se pedido). Se uma etapa falhar, as seguintes não são executadas.
