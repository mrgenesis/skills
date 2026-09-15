---
name: analisar-codebase
description: Analisa a estrutura sintática real do código (funções, classes, métodos, interfaces, imports, chamadas) usando Tree-sitter, para mapear com precisão onde um símbolo é definido e todos os lugares onde ele é usado antes de editar código de produção. Use SEMPRE antes de renomear, remover, mudar a assinatura de, ou refatorar qualquer função/classe/método em JavaScript, TypeScript, Python, C# ou PHP, mesmo que o pedido pareça simples — um `grep` textual encontra o nome errado (comentário, string, símbolo homônimo em outro escopo) e edições em produção baseadas nisso quebram coisas silenciosamente. Também use para entender rapidamente a estrutura de um arquivo desconhecido antes de mexer nele. Não é necessário instalar nada: os scripts rodam com o Node.js que já vem com o Claude Code.
---

# Analisar codebase com Tree-sitter

## Por que isso existe

Editar código de produção com base só em busca textual é arriscado: `grep -r "calculateTotal"` encontra o nome dentro de comentários, strings, e de funções homônimas em outro módulo, mas não distingue "isto é a definição" de "isto é uma chamada" de "isto só aparece por acaso". Essa skill usa um parser sintático de verdade (Tree-sitter) para responder com precisão duas perguntas antes de qualquer edição:

1. Onde esse símbolo é **definido**?
2. Onde, no repositório inteiro, ele é **usado**?

Só depois de responder as duas é seguro editar. Pular essa etapa é a causa mais comum de "consertei uma coisa e quebrei outra três arquivos depois" em mudanças feitas por IA.

## Fluxo recomendado antes de editar produção

1. **Entender o arquivo que você vai mexer**, se ainda não conhece bem sua estrutura:
   ```
   node scripts/outline.js caminho/do/arquivo.ts
   ```
2. **Mapear o símbolo que vai mudar** (função, classe, método, etc.) em todo o repositório:
   ```
   node scripts/find-symbol.js <diretorio-raiz> nomeDoSimbolo
   ```
   Isso devolve, em JSON, cada arquivo que contém uma definição, referência (chamada/instanciação/uso de tipo) ou import daquele nome, com número da linha e um trecho do código. Use o `summary` no topo da saída para ter uma ideia rápida do raio de impacto (quantos arquivos, quantas referências) antes mesmo de olhar os detalhes.
3. **Cruzar com uma busca textual simples** (`grep -rn nomeDoSimbolo`) como rede de segurança. O Tree-sitter cobre os padrões sintáticos mais comuns de cada linguagem (veja "Limitações conhecidas" abaixo), mas não é exaustivo — uso via reflection, strings dinâmicas, ou construções incomuns da linguagem podem escapar da query estrutural. Se o grep textual encontra mais ocorrências do que o `find-symbol.js` reportou, investigue as diferenças antes de editar.
4. **Só então editar.** Depois da mudança, rode `find-symbol.js` de novo para confirmar que não sobrou nenhuma referência ao nome antigo (em caso de rename) ou que todas as chamadas continuam compatíveis com a nova assinatura.

Trate os passos 2 e 3 como obrigatórios sempre que a mudança for **remover, renomear, ou alterar a assinatura** de algo que pode ter uso em outros arquivos. Para uma mudança isolada dentro de uma única função, sem tocar sua assinatura pública, o passo 1 já costuma bastar.

## Scripts disponíveis

### `scripts/outline.js <arquivo>`
Extrai o esqueleto estrutural de um único arquivo: toda definição de função/classe/método/interface, todo import/using, e toda chamada/referência encontrada nele. Bom para se orientar rápido em um arquivo grande ou desconhecido sem ler linha por linha.

### `scripts/find-symbol.js <diretorio-raiz> <nome> [opções]`
Varre recursivamente o diretório (pulando `node_modules`, `vendor`, `.git`, `dist`, `build`, `__pycache__`, `venv` e pastas equivalentes) e retorna, agrupado por arquivo, toda definição/referência/import cujo nome bate com o procurado.

Opções:
- `--contains` — casa por substring em vez de nome exato (útil para achar variações tipo `getUser`, `getUserById`, `getUserByEmail` de uma vez).
- `--kind=definition|reference|import` — filtra só um tipo de resultado.

Formato de cada item encontrado: `{ group, kind, name, line, endLine, column, snippet }`, onde `group` é `definition`/`reference`/`import` e `kind` é mais específico (`function`, `class`, `method`, `interface`, `call`, `type`, `module`, etc — varia por linguagem, já que cada gramática expõe conceitos diferentes).

## Linguagens suportadas

| Linguagem | Extensões |
|---|---|
| JavaScript | `.js`, `.mjs`, `.cjs`, `.jsx` |
| TypeScript | `.ts` |
| TSX | `.tsx` |
| Python | `.py` |
| C# | `.cs` |
| PHP | `.php` |

Arquivo com extensão fora dessa lista é ignorado silenciosamente pelo `find-symbol.js` (ele só varre o que sabe analisar) e recusado com erro explícito pelo `outline.js`.

## Limitações conhecidas (importante para calibrar quanto confiar no resultado)

- **Isso é análise sintática, não semântica.** O nome é comparado como string dentro do escopo de cada arquivo isolado; não há resolução de tipos nem de import (ex: não sabe distinguir dois `handle()` de classes diferentes só pelo nome). Para confirmar que duas ocorrências são "a mesma coisa", olhe o `snippet` e o import correspondente.
- **CommonJS `require(...)` e `import(...)` dinâmico** aparecem como `import`, mas o alvo (nome do módulo) não vem separado no campo `name` — está só no `snippet`.
- **Referências via reflection, strings dinâmicas (`getattr`, `$$name`, `Type.GetMethod("...")`) ou código gerado** não são capturadas — nenhuma ferramenta baseada em sintaxe estática consegue ver isso. Sempre valide manualmente se o código usa esses padrões antes de confiar cegamente na ausência de resultados.
- **Tipos usados só em assinatura de parâmetro** (especialmente em C#) podem não ser capturados como referência; o foco das queries é achar chamadas, instanciações e declarações de variável.
- **Símbolos com o mesmo nome em linguagens diferentes** (ex: `calculate_total` em Python e `calculateTotal` em JS) não são unificados — são nomes diferentes de propósito, e a busca é sempre por string exata (ou substring com `--contains`) dentro de cada arquivo.

Nenhuma dessas limitações invalida o fluxo: elas só significam que o `grep` do passo 3 continua sendo a rede de segurança, não um passo opcional.

## Como isso funciona por baixo dos panos (só se for depurar)

Os scripts usam `web-tree-sitter` (Tree-sitter compilado para WASM) mais as gramáticas de cada linguagem, todos vendorizados dentro de `vendor/` desta skill — por isso não é preciso `npm install` nem compilador C para usar, só o Node.js. As queries em `vendor/queries/*.scm` são baseadas nos arquivos `tags.scm` mantidos oficialmente por cada gramática Tree-sitter (o mesmo mecanismo usado por ferramentas como navegação de símbolos de editores e mapas de repositório de outros assistentes de código), com pequenas adições manuais para cobrir imports/usings, que os `tags.scm` originais não capturam por padrão.

Se precisar adicionar suporte a mais uma linguagem no futuro: baixe o `.wasm` da gramática (o pacote npm `tree-sitter-wasms` tem várias pré-compiladas), copie o `queries/tags.scm` da versão correspondente da gramática para `vendor/queries/<linguagem>.scm`, e registre a extensão em `LANGUAGES` no arquivo `scripts/lib/analyzer.js`.
