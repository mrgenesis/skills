# Scripts de integração com o GitLab

Ficam em `scripts/`. Todos são chamados com `node scripts/<arquivo>.js [opções]` e imprimem um único objeto JSON em stdout. Leia esse JSON antes de decidir o próximo passo, nunca assuma o resultado pela ausência de erro no terminal.

## scripts/detectar-glab.js

Uso: `node scripts/detectar-glab.js [--repo owner/projeto]`.

`--repo` é opcional, mas passe sempre que já souber o repositório de destino (a essa altura do fluxo, geralmente já sabe, ver "Como agir" no `SKILL.md`): `MRG_GLAB_TOKEN` pode ser um token único ou um mapa por grupo/projeto, e sem `--repo` o script só consegue dizer se existe algum token configurado, não necessariamente um válido para aquele repositório.

Verifica o sistema operacional, se o `glab` está instalado e se já existe uma forma de autenticação disponível. Duas vias contam como autenticado:

1. **Arquivo `~/.mrg.skills.vars.json`** (via preferida): um JSON com a chave `MRG_GLAB_TOKEN` e, se a instância não for o gitlab.com público, `MRG_GLAB_URL_BASE`. É lido do zero a cada execução por `lib/config-vars.js`, então uma edição no arquivo já vale na chamada seguinte, sem precisar reiniciar o Claude Code. Também aceita as mesmas chaves como variável de ambiente (útil pra CI), verificada antes do arquivo.

   `MRG_GLAB_TOKEN` aceita dois formatos:
   - **string**: um único token, usado para qualquer repositório.
   - **objeto**: `{ "grupo/subgrupo": "token1", "outro-grupo/projeto": "token2" }`, para quem usa Project/Group access tokens (escopados a um grupo ou projeto específico). Ao resolver o token para um `--repo`, o script escolhe a chave mais específica que corresponde ao caminho (ex.: `--repo grupo/subgrupo/projeto-x` casa com a chave `grupo/subgrupo`, e uma chave de projeto exato tem prioridade sobre uma de grupo).
2. **Sessão já gravada em disco** via `glab auth login` (checada com `glab auth status`), para quem já autenticou manualmente antes.

A razão de preferir o arquivo em vez de `glab auth login` direto: o login sempre exige responder a prompts (protocolo Git, colar o token), e cada execução destes scripts roda num processo novo, isolado do terminal do usuário, sem como responder a esses prompts por ele. Rode `detectar-glab.js` antes de publicar ou editar qualquer issue, e de novo depois de qualquer ação corretiva, para confirmar que a pendência foi resolvida.

Importante sobre `~/.mrg.skills.vars.json`: como guarda um segredo, oriente o usuário a rodar `chmod 600` nele. E nunca peça, aceite ou leia o conteúdo desse arquivo pela conversa, ele é escrito e lido só pelos scripts.

O repositório de destino (`--repo`, usado em `publicar-issue.js` e `editar-issue.js`) não faz parte dessa checagem: ele não é uma configuração de ambiente, é uma decisão de escopo que a skill/usuário precisa fazer a cada issue, então sempre pergunte por ele na conversa em vez de assumir um valor.

Formato da saída:

```jsonc
{
  "installed": bool,
  "version": "...",            // só quando installed: true
  "sysName": "...",
  "authenticated": bool,       // true se o token estiver configurado (arquivo ou env var) OU `glab auth status` passar
  "tokenConfigured": bool,     // true se o token estiver configurado
  "tokenVarName": "MRG_GLAB_TOKEN",
  "urlVarName": "MRG_GLAB_URL_BASE",
  "pendencias": ["instalarGlab", "autenticarGlab"],  // nessa ordem; [] quando nada está pendente
  "instalacao": {              // presente só quando installed: false
    "command": "...",
    "executable": bool,        // false = "command" é uma instrução em texto, não um comando de shell
    "mensagemAoUsuario": "..."
  },
  "autenticacao": {            // presente só quando installed: true e authenticated: false
    "mensagemAoUsuario": "..." // instrui a criar ~/.mrg.skills.vars.json (via preferida) ou usar `glab auth login`
  }
}
```

Como agir a partir dessa saída:

- `pendencias` vazio → siga direto para publicar ou editar.
- `"instalarGlab"` presente → mostre `instalacao.mensagemAoUsuario` ao usuário e peça confirmação (sim/não) antes de rodar `instalacao.command`, sem introduzir opções adicionais que o comando não pede. Só rode automaticamente se `executable: true`; se for `false`, oriente o usuário a seguir a instrução manualmente. Todos os comandos de `instalacao.command` são não interativos por design (sem sudo, sem prompts de licença), então uma vez confirmado, rode e siga sem esperar outra interação. Depois de instalar, rode `detectar-glab.js` novamente para confirmar.
- `"autenticarGlab"` presente → mostre `autenticacao.mensagemAoUsuario` tal como veio, sem adicionar perguntas extras (qual instância, se já tem token, qual método usar). Ela já cobre os dois caminhos (arquivo de configuração e `glab auth login`) e deixa a escolha para o usuário. A única ação da skill aqui é orientar a fazer a configuração fora da conversa (nunca peça, aceite ou leia o token aqui) e esperar a confirmação. Nenhum dos dois caminhos exige reiniciar o Claude Code. Depois, rode `detectar-glab.js` novamente para confirmar.

## scripts/publicar-issue.js

Uso:

```
node scripts/publicar-issue.js --repo owner/projeto --title "Título" --description-file caminho.md [--label a,b] [--assignee user1,user2] [--milestone nome] [--confidential]
```

`--repo` é obrigatório: pergunte ao usuário qual é o projeto de destino (ex.: `GOV/arquitetura`), nunca assuma o remote do diretório atual, já que o diretório onde o script roda não tem relação com o projeto GitLab de destino da issue. Salve o corpo da issue em um arquivo temporário e passe o caminho em `--description-file`, isso evita problemas de aspas e quebras de linha ao repassar o markdown pelo shell.

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "create", "issueUrl": "https://.../-/issues/123", "issueIid": 123, "stdout": "..." }
// falha
{ "ok": false, "action": "create", "error": "..." }
```

Em caso de falha, mostre `error` ao usuário, ele já vem com a mensagem original do `glab`.

## scripts/editar-issue.js

Uso:

```
node scripts/editar-issue.js --repo owner/projeto --id <iid> [--title ...] [--description-file ...] [--add-label a,b] [--remove-label a,b] [--assignee user1,user2] [--unassign] [--milestone nome] [--close] [--reopen]
```

`--repo` é obrigatório, pelo mesmo motivo do `publicar-issue.js`. `--id` é o IID da issue (o número que aparece na URL, não o ID interno do GitLab). Passe só os campos que devem mudar, o resto permanece como está.

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "update", "issueId": "123", "steps": [ { "etapa": "update" | "close" | "reopen", "ok": true, "stdout": "...", "stderr": "..." } ] }
// falha
{ "ok": false, "action": "update", "issueId": "123", "error": "...", "steps": [...] }
```

`steps` mostra cada etapa executada em ordem (atualização de campos, depois fechar/reabrir se pedido). Se uma etapa falhar, as seguintes não são executadas.
