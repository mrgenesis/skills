# mrgenesis/skills

Repositório de Agent Skills para uso com o Claude Code, publicado como um marketplace de plugins.

## Estrutura

```
.
├── .claude-plugin/
│   └── marketplace.json     # índice do marketplace (nome, dono, plugins)
├── skills/
│   ├── implement-feature/
│   ├── prd-writer/
│   ├── spec-writer/
│   └── analisar-codebase/
└── template/
    └── SKILL.md             # ponto de partida para uma skill nova
```

Cada skill vive em sua própria pasta dentro de `skills/`, com um `SKILL.md` obrigatório (frontmatter `name` + `description`) e, se precisar, arquivos de apoio (`scripts/`, `references/`, `vendor/` etc).

## Como instalar a partir daqui

```
/plugin marketplace add mrgenesis/skills
/plugin install implement-feature@mrgenesis-skills
/plugin install prd-writer@mrgenesis-skills
/plugin install spec-writer@mrgenesis-skills
/plugin install analisar-codebase@mrgenesis-skills
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

## Validando antes do push

```
claude plugin validate .
```
