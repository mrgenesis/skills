# Publicar uma issue

Use `scripts/publicar-issue.js` quando o usuário (ou a skill que te chamou, ex.: `criar-issue`) quiser criar uma issue nova no GitLab. Nunca publique sem confirmação explícita de quem te chamou sobre o repositório de destino.

Uso:

```
node scripts/publicar-issue.js --repo owner/projeto --title "Título" --description-file caminho.md [--label a,b] [--assignee user1,user2] [--milestone nome] [--confidential]
```

`--repo` é obrigatório: pergunte ao usuário qual é o projeto de destino (ex.: `GOV/arquitetura`), nunca assuma o remote do diretório atual, já que o diretório onde o script roda não tem relação com o projeto GitLab de destino da issue. O título vai em `--title`; salve o corpo da issue em um arquivo temporário e passe o caminho em `--description-file`, isso evita problemas de aspas e quebras de linha ao repassar o markdown pelo shell.

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "create", "issueUrl": "https://.../-/issues/123", "issueIid": 123, "stdout": "..." }
// falha
{ "ok": false, "action": "create", "error": "..." }
```

Em caso de falha, mostre `error` ao usuário, ele já vem com a mensagem original do `glab`.
