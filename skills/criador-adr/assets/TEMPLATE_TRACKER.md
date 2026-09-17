# Template de Tracker de Rastreabilidade dos ADRs (modelo de saída)

O Tracker é uma tabela markdown que mapeia cada item registrado em cada ADR à sua origem real, no material
de entrada usado para gerá-lo. Ele existe para que qualquer leitor consiga responder "de onde veio essa
decisão", e para expor rapidamente qualquer item sem origem identificável, que é sinal de invenção.

Esta tabela é transversal ao projeto, não exclusiva dos ADRs: se o projeto já tiver um `docs/TRACKER.md`
gerado por outra skill (ex: `criador-prd`), acrescente as linhas novas à tabela existente em vez de criar um
arquivo separado (ver [Salvar os ADRs em arquivo](../SKILL.md#salvar-os-adrs-em-arquivo)).

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de Tracker
(colunas, valores aceitos de `Fonte`, esquema de ID), esse formato prevalece sobre o que está descrito aqui
(ver [Entrada](../SKILL.md#entrada)).

## Formato obrigatório da tabela

```markdown
| ID | Documento | Tipo | Conteúdo (resumo) | Fonte | Localização |
| --- | --- | --- | --- | --- | --- |
| ADR-004-DEC | docs/adrs/ADR-004-outbox-no-mysql.md | Decisão | [resumo de até 20 palavras] | Transcrição de reunião | [hh:mm] Nome |
```

Cada linha da tabela é um item rastreado. Preencha uma linha por item identificável em cada ADR, agrupando
por número de ADR.

## Colunas

### ID

Identificador único do item, sempre no formato `ADR-NNN-<TIPO>[-NNN]`, onde `NNN` (primeiro) é o número do
próprio ADR, para o ID ficar diretamente rastreável ao arquivo de origem. Prefixos de tipo possíveis:

- `ADR-NNN-CTX-NNN`: um elemento de contexto ou restrição (um ADR pode ter mais de um, numerado)
- `ADR-NNN-DEC`: a decisão em si (um único item por ADR, sem sufixo numérico)
- `ADR-NNN-ALT-NNN`: uma alternativa considerada (uma linha por alternativa)
- `ADR-NNN-CONS-NNN`: uma consequência, positiva ou negativa (uma linha por consequência)
- `ADR-NNN-REF-NNN`: uma referência a outro documento ou trecho de código (uma linha por referência)

Exemplo: o segundo elemento de contexto do ADR-004 é `ADR-004-CTX-02`; a primeira alternativa do ADR-004 é
`ADR-004-ALT-01`.

### Documento

O caminho do arquivo do ADR de origem, no formato `docs/adrs/ADR-NNN-titulo-em-kebab-case.md`, exatamente
como foi salvo.

### Tipo

Descreve a natureza do item, usando o mesmo vocabulário do Tracker geral do projeto sempre que possível:

- Restrição (elemento de contexto)
- Decisão
- Alternativa Descartada
- Trade-off (consequência positiva ou negativa; use o resumo para indicar qual das duas)
- Referência

### Conteúdo (resumo)

Descrição de uma linha do item, em português, com **no máximo 20 palavras**. Para consequências, comece o
resumo indicando se é positiva ou negativa (ex: "Positiva: reduz acoplamento entre..." ou "Negativa:
introduz latência adicional de...").

### Fonte

O tipo de material de entrada de onde o item veio. Um dos valores abaixo:

- `Transcrição de reunião`
- `Ata`
- `RFC`
- `PRD`
- `FDD`
- `ADR anterior`
- `Documento de requisitos`
- `Ticket`
- `E-mail`
- `Outro artefato`
- `Código-fonte`
- `Entrevista`

Nunca deixe em branco e nunca use um valor fora dessa lista. Um item que combina mais de uma fonte vira
duas linhas separadas no Tracker, com o mesmo ID base e um sufixo (`-A`, `-B`) se necessário para manter
unicidade.

`Entrevista` é o valor usado quando o item não veio de nenhum documento nem do código, e sim de uma resposta
direta do usuário durante a entrevista desta skill, tratada como fato (nunca uma hipótese, ver
[Alternativas e consequências sem conteúdo hipotético](../SKILL.md#alternativas-e-consequências-sem-conteúdo-hipotético)
em SKILL.md). Use este valor em vez de deixar o item de fora do Tracker: a cobertura desta tabela é total
(ver [Regras de preenchimento](#regras-de-preenchimento)), então toda informação registrada em um ADR precisa
ter uma linha correspondente, mesmo quando a fonte é a própria entrevista.

### Localização

Como preencher, de acordo com o valor de `Fonte`:

- `Transcrição de reunião`: timestamp e nome de quem falou, exatamente no formato `[hh:mm] Nome` (ex:
  `[09:17] Diego`).
- `Ata`: identificação da ata (data ou título) e o tópico correspondente.
- `RFC`, `PRD`, `FDD`, `ADR anterior`: caminho do arquivo e a seção de origem (ex:
  `docs/RFC.md, seção "Alternativas consideradas"`).
- `Documento de requisitos`: nome ou caminho do documento e a seção ou identificador de origem.
- `Ticket`: identificador do ticket (ex: `JIRA-1234`).
- `E-mail`: data e assunto do e-mail.
- `Outro artefato`: nome ou identificador do artefato mais o trecho que localize o item sem ambiguidade.
- `Código-fonte`: caminho do arquivo real no repositório, seguido de dois-pontos e o número da linha a
  partir de onde o trecho relevante pode ser lido, no formato `arquivo:número` (ex:
  `src/modules/orders/order.service.ts:42`). Nunca referencie um arquivo que não exista no repositório, nem
  uma linha fora do intervalo real do arquivo.
- `Entrevista`: identificação do ADR e do campo perguntado, no formato `Entrevista do ADR-NNN, campo
  [nome do campo]` (ex: `Entrevista do ADR-004, campo Alternativas Consideradas`).

Em todos os casos, a localização precisa apontar para um trecho específico do material de origem (ou, no
caso de `Entrevista`, para o campo específico perguntado), nunca para o documento inteiro.

## Regras de preenchimento

- Cobertura total: 100% dos itens identificáveis em cada ADR devem ter uma linha correspondente no Tracker,
  sem exceção. Isso é possível porque esta skill não aceita conteúdo hipotético em ADR (ver
  [Identificação de decisões candidatas](../SKILL.md#identificação-de-decisões-candidatas) em SKILL.md): todo
  item vem de um documento, do código ou de uma resposta direta do usuário tratada como fato, e cada uma
  dessas três origens tem um valor de `Fonte` correspondente nesta tabela (a última é `Entrevista`).
- Se, ao montar o Tracker, sobrar algum item do ADR sem nenhuma `Fonte` possível de atribuir, isso é sinal de
  que o item não tem origem identificável e provavelmente foi inventado. Nesse caso, o item deve ser
  ajustado ou removido do ADR antes de finalizar, nunca forçado no Tracker com uma fonte ou localização
  inventada.
- Nunca inclua uma linha para um item que não existe de fato no ADR correspondente.
- Ao acrescentar linhas a um `docs/TRACKER.md` já existente, nunca duplique uma linha com o mesmo ID de uma
  já presente na tabela; se o ID já existir (por exemplo, o ADR foi regenerado), atualize a linha existente
  em vez de duplicá-la.
