---
tags:
  - anotacao
---

# Template da Anotação

Tiago Forte não prescreve um formato de arquivo fixo no livro: ele prescreve **princípios** que uma boa nota deve satisfazer (ver [CODE.md](../references/CODE.md) para o método completo). Este template traduz esses princípios em uma estrutura fixa de arquivo Markdown, para que toda anotação gerada pela skill seja consistente.

## De onde vem cada seção

| Seção do template | Princípio do livro | Onde é aplicado |
|---|---|---|
| Título (H1) | Toda nota precisa de um "título sucinto que explique do que se trata": é o principal fator de **descobribilidade** ("fator mais importante" para uma nota sobreviver; trate seu "eu futuro" como um cliente impaciente) | Etapa 3 (Organizar) |
| `Fonte:` / `Tipo:` | Sempre capturar endereço, título, autor e data de publicação junto com a nota, para permitir recuperar a origem depois | Etapa 1 (Capturar) |
| `Sugestão PARA:` | Toda nota deve ser posicionada por **acionabilidade** (Projetos > Áreas > Recursos > Arquivo), nunca por tipo/origem do conteúdo | Etapa 3 (Organizar) |
| `Resumo executivo` | **Camada 4** da Sumarização Progressiva: resumo em tópicos, nas PRÓPRIAS palavras (não copiado), no topo, é o que faz a nota passar no **teste dos 30 segundos** | Etapa 2 (Destilar) |
| `Notas destiladas` | **Camadas 1-3** da Sumarização Progressiva (trecho bruto → negrito → destaque), aplicadas com prioridade ao que o próprio leitor apontou como o que repercutiu nele | Etapa 1 (Capturar) / Etapa 2 (Destilar) |

O livro também insiste que uma nota é uma "unidade indivisível de informação interpretada através da sua lente" (analogia com peças de LEGO): precisa valer por si só, mesmo fora de contexto. O template abaixo existe para isso: título, fonte e resumo executivo sozinhos já devem comunicar a essência da nota.

## Estrutura

```markdown
# <Título específico e sucinto>

**Fonte:** <título original, autor, data/URL (inclua apenas os campos identificáveis)>
**Tipo:** <transcrição de vídeo | artigo | podcast | aula | reunião | outro>
**Sugestão PARA:** <Projeto|Área|Recurso>: <justificativa em uma frase>

---

## Resumo executivo
- <bullet 1, com suas próprias palavras>
- <bullet 2>
<!-- 3-6 bullets é típico; menos para entradas curtas -->

## Notas destiladas
<trechos selecionados, em ordem de origem ou agrupados por tema, com **negrito** e ==destaque== aplicados>
```

## Recursos de formatação para legibilidade

Dentro de `Resumo executivo` e `Notas destiladas`, use os recursos de formatação do Markdown para tornar o conteúdo fácil de escanear (isso reforça diretamente o **teste dos 30 segundos**, ver [CODE.md → Destilar](../references/CODE.md#destilar)):

- **Tabelas**: use para comparações, listas de critérios, prós/contras, ou qualquer conteúdo com mais de uma dimensão (ex.: opção vs. característica, etapa vs. resultado). Não force uma tabela sobre conteúdo puramente narrativo.
- **Fórmulas, comandos, valores e termos técnicos entre crases** (`` `assim` ``): use para expressões matemáticas, nomes de variáveis/parâmetros, comandos, trechos de código e valores numéricos específicos ou jargão técnico citado no texto original. Isso os isola visualmente da prosa e evita ambiguidade.
- **Listas numeradas**: para sequências, passos ou rankings onde a ordem importa.
- **Listas com marcadores**: para itens paralelos sem ordem obrigatória (padrão do Resumo executivo).
- **Citação em bloco (`>`)**: para uma citação direta e mais longa da fonte que mereça destaque isolado, em vez de embutida no meio de um parágrafo.
- **Negrito (`**texto**`) e destaque (`==texto==`)**: reservados para as Camadas 2 e 3 da Sumarização Progressiva (ver Etapa 2 em [SKILL.md](../SKILL.md)), não usar como recurso genérico de ênfase fora desse propósito.
- **Diagramas Mermaid** (bloco ` ```mermaid `): use quando a fonte descreve algo mais fácil de entender visualmente do que em prosa, um processo com etapas/decisões (`flowchart`/`graph TD`), uma hierarquia ou estrutura de partes (`graph TD`/`graph LR`), uma linha do tempo (`timeline`) ou o relacionamento entre conceitos centrais da nota (`graph LR` com os conceitos como nós e as relações como arestas rotuladas). Só adicione um diagrama quando ele reduz o esforço de leitura em relação ao texto. Não ilustre toda nota por padrão, e nunca invente etapas/relações que não estejam na fonte.

Aplique esses recursos com moderação e só quando genuinamente melhoram a legibilidade, nunca como enfeite. Prefira sempre a forma mais simples que comunique a informação com clareza.

## Regras de preenchimento

- **A anotação é uma unidade autocontida e individual**: mantenha o campo `**Fonte:**` (metadados de conteúdo: título, autor, data/URL) sempre que houver informação identificável, mas nunca se refira ao documento de origem em si (nome do arquivo, caminho ou extensão) nem a qualquer outro arquivo da pasta, em nenhum lugar da anotação. A nota deve valer por si só, sem depender de nada externo a ela (ver princípio de "bloco de construção de conhecimento" no topo deste arquivo). Se não houver metadado de conteúdo identificável, omita a linha `**Fonte:**` inteiramente. Nunca escreva "desconhecido"/"N/A", e nunca use o nome do arquivo lido como substituto.
  - **Permitido**: descrever o conteúdo em prosa, ex. "o conteúdo é da aula do MBA sobre X" ou "do artigo de Fulano (do site da Siclana)".
  - **Proibido**: criar um link/caminho para o arquivo local, ex. `[algo](caminho/do/arquivo.txt)` ou `[[nome-do-arquivo]]`, ou citar o nome/extensão do arquivo lido.
- Para entradas curtas (menos de ~200 palavras): reduza as camadas (negrito leve, sem destaque, e um Resumo executivo de 1-3 bullets). O teste dos 30 segundos já é trivialmente satisfeito por uma anotação curta.
- Nunca invente conteúdo ausente da fonte. O Resumo executivo precisa sintetizar de fato os trechos selecionados (com prioridade para o que o usuário apontou na Etapa 1), não criar fatos novos.
- As citações literais (`Notas destiladas`) podem permanecer no idioma original da fonte quando traduzir distorceria o sentido; o Resumo executivo e todo comentário original ficam sempre em pt-BR.
- A linha `**Sugestão PARA:**` é só um metadado informativo, nunca determina onde o arquivo é salvo (ver seção Saída em [SKILL.md](../SKILL.md)).
- Título e nome de arquivo: o H1 deve ser específico o suficiente para, sozinho, comunicar o assunto da nota. O mesmo texto (reduzido a um slug) vira o nome do arquivo.
