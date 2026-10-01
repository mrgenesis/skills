# mrgenesis/skills

Repositório de Agent Skills para uso com o Claude Code, publicado como um marketplace de plugins.

## Dois marketplaces

O mesmo conteúdo é publicado em dois repositórios, cada um como um marketplace com nome próprio:

| Marketplace | Repositório | Branch local | Para adicionar |
|---|---|---|---|
| `mrgenesis-skills` | GitHub `mrgenesis/skills` (remote `origin`) | `main` | `/plugin marketplace add mrgenesis/skills` |
| `sebrae-skills` | GitLab do Sebrae `gov/skills` (remote `sebrae`) | `sebrae` | `/plugin marketplace add git@gitlab.ms.sebrae.com.br:gov/skills.git` |

O Claude Code não aceita URL `ssh://` com porta, e o SSH do GitLab do Sebrae roda na porta 2224. Antes de adicionar o `sebrae-skills`, configure a porta no `~/.ssh/config` (é preciso ter a chave SSH cadastrada no GitLab do Sebrae):

```
Host gitlab.ms.sebrae.com.br
    Port 2224
    User git
```

A única diferença entre os dois é o `name` em `.claude-plugin/marketplace.json`. Todo desenvolvimento acontece na `main`; a branch `sebrae` é a `main` mais um commit que troca esse nome. Para publicar:

```bash
git push origin main                 # mrgenesis-skills
git switch sebrae && git merge main  # traz as mudanças, mantendo o nome sebrae-skills
git push sebrae sebrae:main          # sebrae-skills
git switch main
```

Skills que instalam outras skills não usam o nome do marketplace fixo: descobrem por `claude plugin list` de qual marketplace vieram (sufixo `@<marketplace>`).

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

Adicione um dos marketplaces (tabela acima) e instale as skills com o nome dele no lugar de `mrgenesis-skills` quando usar o `sebrae-skills`:

```
/plugin marketplace add mrgenesis/skills
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

Marketplaces de terceiros (como este) vêm com auto-update **desligado por padrão** (só marketplaces oficiais da Anthropic atualizam sozinhos em background). Depois de dar push numa mudança aqui, quem já instalou a skill precisa atualizar manualmente (troque `mrgenesis-skills` por `sebrae-skills` se for o caso):

```
/plugin marketplace update mrgenesis-skills
/plugin update analisar-codebase@mrgenesis-skills
/reload-plugins
```

- `/plugin marketplace update` busca a versão mais recente do `marketplace.json` (pega plugins novos/removidos).
- `/plugin update` busca o código mais recente daquele plugin específico.
- `/reload-plugins` aplica as mudanças na sessão sem precisar reiniciar (use `/reload-plugins --force` se ele avisar que invalidaria o cache de prompt).

Para não precisar rodar isso manualmente toda vez, dá pra ligar o auto-update em `/plugin` → aba **Marketplaces** → selecionar o marketplace → **Enable auto-update**.

## Validando antes do push

```
claude plugin validate .
```
