# Scripts de integração com o GitLab

Ficam em `scripts/`. Todos são chamados com `node scripts/<arquivo>.js [opções]` e imprimem um único objeto JSON em stdout. Leia esse JSON antes de decidir o próximo passo, nunca assuma o resultado pela ausência de erro no terminal.

## scripts/detectar-glab.js

Uso: `node scripts/detectar-glab.js [--repo owner/projeto]`.

`--repo` é opcional, mas passe sempre que já souber o repositório de destino (a essa altura do fluxo, geralmente já sabe, ver "Como agir" no `SKILL.md`): `MRG_GLAB_TOKEN` pode ser um token único ou um mapa por grupo/projeto, e sem `--repo` o script só consegue dizer se existe algum token configurado, não necessariamente um válido para aquele repositório.

Verifica se o `glab` está disponível (no PATH do sistema, sempre priorizado, ou no binário vendorizado desta skill em `vendor/glab/bin`, ver `lib/glab-binario.js`) e se já existe uma forma de autenticação disponível. Duas vias contam como autenticado:

1. **Arquivo `~/.mrg.skills/credenciais.json`** (via preferida): um JSON com a chave `MRG_GLAB_TOKEN` e `MRG_GLAB_URL_BASE` (já vem preenchida com a URL padrão do GitLab da Sebrae, `https://gitlab.ms.sebrae.com.br/`; só precisa trocar se a instância de destino for outra). É lido do zero a cada execução por `lib/config-vars.js`, então uma edição no arquivo já vale na chamada seguinte, sem precisar reiniciar o Claude Code. Também aceita as mesmas chaves como variável de ambiente (útil pra CI), verificada antes do arquivo.

   `MRG_GLAB_TOKEN` aceita dois formatos:
   - **string**: um único token, usado para qualquer repositório.
   - **objeto**: `{ "grupo/subgrupo": "token1", "outro-grupo/projeto": "token2" }`, para quem usa Project/Group access tokens (escopados a um grupo ou projeto específico). Ao resolver o token para um repositório, o script escolhe a chave mais específica que corresponde ao caminho (ex.: repositório `grupo/subgrupo/projeto-x` casa com a chave `grupo/subgrupo`, e uma chave de projeto exato tem prioridade sobre uma de grupo).
2. **Sessão já gravada em disco** via `glab auth login` (checada com `glab auth status`), para quem já autenticou manualmente antes.

A razão de preferir o arquivo em vez de `glab auth login` direto: o login sempre exige responder a prompts (protocolo Git, colar o token), e cada execução destes scripts roda num processo novo, isolado do terminal do usuário, sem como responder a esses prompts por ele. Rode `detectar-glab.js` antes de publicar/editar uma issue ou baixar um arquivo, e de novo depois de qualquer ação corretiva, para confirmar que a pendência foi resolvida.

Importante sobre `~/.mrg.skills/credenciais.json`: como guarda um segredo, oriente o usuário a rodar `chmod 600` nele. E nunca peça, aceite ou leia o conteúdo desse arquivo pela conversa, ele é escrito e lido só pelos scripts.

O repositório de destino (`--repo`, usado em `publicar-issue.js`, `editar-issue.js` e `baixar-arquivo.js`) não faz parte dessa checagem: ele não é uma configuração de ambiente, é uma decisão de escopo que a skill/usuário precisa fazer a cada chamada, então sempre pergunte por ele na conversa em vez de assumir um valor.

Formato da saída:

```jsonc
{
  "installed": bool,
  "version": "...",                  // só quando installed: true
  "usandoBinarioVendorizado": bool,   // só quando installed: true; true = "version" veio de vendor/glab/bin (não do PATH)
  "authenticated": bool,       // true se o token estiver configurado (arquivo ou env var) OU `glab auth status` passar
  "tokenConfigured": bool,     // true se o token estiver configurado
  "tokenVarName": "MRG_GLAB_TOKEN",
  "urlVarName": "MRG_GLAB_URL_BASE",
  "pendencias": ["instalarGlab", "autenticarGlab"],  // nessa ordem; [] quando nada está pendente
  "instalacao": {              // presente só quando installed: false
    "command": "...",          // sempre `node ".../scripts/instalar-glab.js"` (caminho absoluto)
    "executable": true,
    "mensagemAoUsuario": "..."
  },
  "autenticacao": {            // presente só quando installed: true e authenticated: false
    "arquivoRecemCriado": bool,  // true se o script acabou de criar ~/.mrg.skills/credenciais.json do zero agora
    "mensagemAoUsuario": "..."   // instrui a criar/editar ~/.mrg.skills/credenciais.json (via preferida) ou usar `glab auth login`
  }
}
```

Como agir a partir dessa saída:

- `pendencias` vazio → siga direto para publicar, editar ou baixar.
- `"instalarGlab"` presente → mostre `instalacao.mensagemAoUsuario` ao usuário e peça confirmação (sim/não) antes de rodar `instalacao.command` (que é sempre `node ".../scripts/instalar-glab.js"`), sem introduzir opções adicionais. `scripts/instalar-glab.js` baixa o binário oficial da release mais recente direto da GitLab (sem sudo/admin, sem gerenciador de pacotes) e grava em `vendor/glab/bin` dentro desta skill (nunca no sistema, nunca commitado, ver `.gitignore`), então uma vez confirmado, rode e siga sem esperar outra interação. Se a plataforma/arquitetura não tiver download automático (fora Linux/macOS/Windows em amd64/arm64), o próprio `instalar-glab.js` retorna `{ "ok": false, "error": "..." }` orientando a baixar manualmente, mostre esse erro ao usuário. Depois de instalar, rode `detectar-glab.js` novamente para confirmar.
- `"autenticarGlab"` presente → mostre `autenticacao.mensagemAoUsuario` tal como veio, sem adicionar perguntas extras (qual instância, se já tem token, qual método usar). Ela já cobre os dois caminhos (arquivo de configuração e `glab auth login`) e deixa a escolha para o usuário. A única ação da skill aqui é orientar a fazer a configuração fora da conversa (nunca peça, aceite ou leia o token aqui) e esperar a confirmação. Nenhum dos dois caminhos exige reiniciar o Claude Code. Depois, rode `detectar-glab.js` novamente para confirmar.

## scripts/instalar-glab.js

Uso: `node scripts/instalar-glab.js` (sem argumentos).

Só rode depois de confirmação do usuário, a partir de `instalacao.command` de `detectar-glab.js` (ver acima). Baixa o binário oficial do glab da release mais recente da GitLab e grava em `vendor/glab/bin` dentro desta skill, sem sudo/admin e sem gerenciador de pacotes. Suporta Linux, macOS e Windows, em amd64 e arm64.

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "install", "version": "1.118.0", "path": "/caminho/.../vendor/glab/bin/glab" }
// falha
{ "ok": false, "action": "install", "error": "..." }
```

Em caso de falha, mostre `error` ao usuário. Se a plataforma/arquitetura não tiver download automático, o erro já inclui a URL das releases e o caminho onde colocar o executável manualmente (`GLAB_BIN_PATH`).

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

## scripts/baixar-arquivo.js

Uso:

```
node scripts/baixar-arquivo.js --repo owner/projeto --path caminho/no/repo.md --output caminho/local.md [--ref branch-ou-tag-ou-commit]
```

`--repo`, `--path` e `--output` são obrigatórios, pelo mesmo motivo dos outros scripts: o repositório e o caminho do arquivo dentro dele fazem parte do escopo da conversa, nunca devem ser assumidos. `--path` é o caminho do arquivo dentro do repositório (ex.: `docs/adrs/0001-usar-postgres.md`), não um caminho local. `--ref` é opcional (padrão `HEAD`, a branch default do repositório); use para buscar o arquivo em uma branch, tag ou commit específico.

Baixa o arquivo via API do GitLab (endpoint "Get raw file"), sem precisar clonar o repositório. Grava o conteúdo exatamente como recebido (sem decodificar como texto), então funciona tanto para arquivos de texto quanto binários.

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "download", "localPath": "caminho/local.md", "bytes": 2048 }
// falha
{ "ok": false, "action": "download", "error": "..." }
```

Em caso de falha, mostre `error` ao usuário. Um erro comum é 404 (caminho ou `--ref` errado, ou token sem acesso ao projeto). Se `--path` for uma pasta em vez de um arquivo, a API retorna 404 aqui, use `scripts/baixar-pasta.js` para pastas.

## scripts/baixar-pasta.js

Uso:

```
node scripts/baixar-pasta.js --repo owner/projeto --path pasta/no/repo --output pasta/local [--ref branch-ou-tag-ou-commit]
```

`--repo`, `--path` e `--output` são obrigatórios, pelo mesmo motivo dos outros scripts. `--path` é a pasta dentro do repositório (ex.: `docs/adrs`), não um caminho local. `--ref` é opcional (padrão `HEAD`).

Baixa recursivamente todo arquivo dentro de `--path`, via API do GitLab: primeiro lista os arquivos (endpoint "List repository tree", com `--paginate`), depois baixa cada um (mesmo endpoint "Get raw file" de `baixar-arquivo.js`). Grava cada arquivo em `<output>/<caminho completo a partir da raiz do repositório>`, recriando a mesma estrutura de pastas do repositório dentro de `--output`, não só a parte relativa a `--path`. Ex.: `--path docs/adrs --output ./destino` produz `./destino/docs/adrs/0001-arquivo.md`, nunca `./destino/0001-arquivo.md`.

Formato da saída:

```jsonc
// sucesso (todos os arquivos baixados)
{ "ok": true, "action": "download-folder", "downloaded": 3, "total": 3, "files": [ { "path": "docs/adrs/0001.md", "ok": true, "localPath": "...", "bytes": 512 }, ... ] }
// falha parcial (alguns arquivos falharam, os outros já foram gravados)
{ "ok": false, "action": "download-folder", "downloaded": 2, "total": 3, "files": [ ..., { "path": "docs/adrs/0003.md", "ok": false, "error": "..." } ] }
// falha total (pasta vazia/não encontrada, ou erro ao listar)
{ "ok": false, "action": "download-folder", "error": "..." }
```

Em falha parcial, mostre ao usuário quais arquivos falharam (campo `error` de cada item em `files` com `ok: false`) e quais já foram baixados com sucesso, não repita o download dos que já deram certo.
