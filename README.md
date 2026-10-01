# mrgenesis/skills

Repositório de Agent Skills para uso com o Claude Code, publicado como um marketplace de plugins.

## Registrar o marketplace no Claude Code

O repositório é público no GitHub, então o marketplace é registrado por HTTPS: não precisa de chave SSH nem de login, e a porta 443 costuma passar por redes corporativas. O atalho `mrgenesis/skills` também funciona, mas o Claude Code clona por SSH (`git@github.com:...`), o que exige uma chave SSH cadastrada no GitHub.

Rode o bloco inteiro no terminal. Ele não altera nenhuma configuração: primeiro confere se o repositório está acessível (com as credenciais desativadas, para não abrir pedido de login) e só então registra o marketplace. Se não conseguir acessar, mostra um aviso e não tenta registrar.

**Linux, WSL ou macOS (bash/zsh):**

```bash
if GIT_TERMINAL_PROMPT=0 git -c credential.helper= ls-remote https://github.com/mrgenesis/skills.git HEAD >/dev/null 2>&1; then
  claude plugin marketplace add https://github.com/mrgenesis/skills.git
else
  echo "ATENÇÃO: não foi possível acessar https://github.com/mrgenesis/skills.git. Confira a conexão com a internet e o proxy da rede e rode este bloco de novo."
fi
```

**Windows (PowerShell):**

```powershell
$env:GIT_TERMINAL_PROMPT = '0'
git -c credential.helper= ls-remote https://github.com/mrgenesis/skills.git HEAD *> $null
$acessivel = $LASTEXITCODE -eq 0
Remove-Item Env:GIT_TERMINAL_PROMPT
if ($acessivel) {
  claude plugin marketplace add https://github.com/mrgenesis/skills.git
} else {
  Write-Warning "Não foi possível acessar https://github.com/mrgenesis/skills.git. Confira a conexão com a internet e o proxy da rede e rode este bloco de novo."
}
```

Depois de registrado, instale as skills como em "Como instalar a partir daqui".

## Estrutura

```
.
├── .claude-plugin/
│   └── marketplace.json     # índice do marketplace (nome, dono, plugins)
├── skills/
│   ├── analisar-codebase/
│   ├── criador-adr/
│   ├── criador-fdd/
│   ├── criador-notas/
│   ├── criador-prd/
│   ├── criador-rfc/
│   ├── criar-issue/
│   ├── gitlab-toolkit/
│   ├── implement-feature/
│   ├── prd-writer/
│   ├── spec-writer/
│   ├── suporte-n3/
│   └── validar-conformidade/
└── template/
    └── SKILL.md             # ponto de partida para uma skill nova
```

Cada skill vive em sua própria pasta dentro de `skills/`, com um `SKILL.md` obrigatório (frontmatter `name` + `description`) e, se precisar, arquivos de apoio (`scripts/`, `references/`, `vendor/` etc).

## Como instalar a partir daqui

```
/plugin marketplace add https://github.com/mrgenesis/skills.git
/plugin install analisar-codebase@mrgenesis-skills
/plugin install criador-adr@mrgenesis-skills
/plugin install criador-fdd@mrgenesis-skills
/plugin install criador-notas@mrgenesis-skills
/plugin install criador-prd@mrgenesis-skills
/plugin install criador-rfc@mrgenesis-skills
/plugin install criar-issue@mrgenesis-skills
/plugin install gitlab-toolkit@mrgenesis-skills
/plugin install implement-feature@mrgenesis-skills
/plugin install prd-writer@mrgenesis-skills
/plugin install spec-writer@mrgenesis-skills
/plugin install suporte-n3@mrgenesis-skills
/plugin install validar-conformidade@mrgenesis-skills
```

## Criando uma skill nova

1. Copie `template/SKILL.md` para `skills/nome-da-skill/SKILL.md`.
2. Enquanto a skill estiver em desenvolvimento, deixe-a inacessível adicionando ao frontmatter:

   ```yaml
   disable-model-invocation: true
   user-invocable: false
   ```

3. Adicione uma entrada correspondente em `.claude-plugin/marketplace.json`, dentro de `plugins`.
4. Quando a skill estiver pronta, remova as duas linhas do passo 2 (os valores padrão, `false` e `true`, já liberam a skill para uso normal).

## Atualizando uma skill já instalada

Marketplaces de terceiros (como este) vêm com auto-update **desligado por padrão** (só marketplaces oficiais da Anthropic atualizam sozinhos em background). Depois de dar push numa mudança aqui, quem já instalou a skill precisa atualizar manualmente:

```
/plugin marketplace update mrgenesis-skills
/plugin update analisar-codebase@mrgenesis-skills
/reload-plugins
```

- `/plugin marketplace update` busca a versão mais recente do `marketplace.json` (pega plugins novos/removidos).
- `/plugin update` busca o código mais recente daquele plugin específico.
- `/reload-plugins` aplica as mudanças na sessão sem precisar reiniciar (use `/reload-plugins --force` se ele avisar que invalidaria o cache de prompt).

Para não precisar rodar isso manualmente toda vez, dá pra ligar o auto-update em `/plugin` → aba **Marketplaces** → selecionar `mrgenesis-skills` → **Enable auto-update**.

## Validando antes do push

```
claude plugin validate .
```
