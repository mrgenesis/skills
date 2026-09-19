# mrgenesis/skills

Repositório de Agent Skills para uso com o Claude Code, publicado como um marketplace de plugins.

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
│   └── spec-writer/
└── template/
    └── SKILL.md             # ponto de partida para uma skill nova
```

Cada skill vive em sua própria pasta dentro de `skills/`, com um `SKILL.md` obrigatório (frontmatter `name` + `description`) e, se precisar, arquivos de apoio (`scripts/`, `references/`, `vendor/` etc).

## Como instalar a partir daqui

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
