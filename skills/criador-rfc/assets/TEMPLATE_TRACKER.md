# Template de Tracker de Rastreabilidade do RFC (modelo de saída)

O Tracker é uma tabela markdown que mapeia cada item registrado no RFC à sua origem real, no material de
entrada usado para gerá-lo. Ele existe para que qualquer leitor consiga responder "de onde veio essa
informação", e para expor rapidamente qualquer item sem origem identificável, que é sinal de invenção.

Esta tabela é transversal ao projeto, não exclusiva dos RFCs: se o projeto já tiver um `docs/TRACKER.md`
gerado por outra skill (ex: `criador-adr`, `criador-prd`), acrescente as linhas novas à tabela existente em
vez de criar um arquivo separado (ver [Salvar o RFC em arquivo](../SKILL.md#salvar-o-rfc-em-arquivo)).

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de Tracker
(colunas, valores aceitos de `Fonte`, esquema de ID), esse formato prevalece sobre o que está descrito aqui
(ver [Entrada](../SKILL.md#entrada)).

## Formato obrigatório da tabela

```markdown
| ID | Documento | Tipo | Conteúdo (resumo) | Fonte | Localização |
| --- | --- | --- | --- | --- | --- |
| RFC-ALT-01 | docs/RFC.md | Alternativa Descartada | [resumo de até 20 palavras] | Transcrição de reunião | [hh:mm] Nome |
```

Cada linha da tabela é um item rastreado. Preencha uma linha por item identificável no RFC, na ordem das
seções do documento.

## Colunas

### ID

Identificador único do item, sempre no formato `RFC-<TIPO>[-NNN]`. Prefixos de tipo possíveis:

- `RFC-CTX-NNN`: um elemento de contexto ou restrição (pode haver mais de um, numerado)
- `RFC-PROP-NNN`: um elemento da proposta técnica (componente, abordagem, decisão de arquitetura descrita)
- `RFC-ALT-NNN`: uma alternativa considerada e descartada (uma linha por alternativa)
- `RFC-OQ-NNN`: uma questão em aberto (uma linha por questão)
- `RFC-IMP-NNN`: um item de impacto ou risco
- `RFC-REL-NNN`: uma decisão relacionada ou referência a outro documento (ADR, PRD, RFC anterior)

Exemplo: a segunda questão em aberto é `RFC-OQ-02`; a primeira alternativa é `RFC-ALT-01`.

### Documento

O caminho do arquivo do RFC de origem, no formato `docs/RFC.md` (ou o caminho onde foi salvo, se o usuário
indicou outro), exatamente como foi salvo.

### Tipo

Descreve a natureza do item:

- Restrição (elemento de contexto)
- Elemento da Proposta
- Alternativa Descartada
- Questão em Aberto
- Impacto ou Risco
- Decisão Relacionada

### Conteúdo (resumo)

Descrição de uma linha do item, em português, com **no máximo 20 palavras**. Para alternativas descartadas,
inclua o núcleo do trade-off que motivou o descarte (ex: "Fila dedicada: descartada por aumentar custo
operacional sem ganho de latência relevante").

### Fonte

O tipo de material de entrada de onde o item veio. Um dos valores abaixo:

- `Transcrição de reunião`
- `Ata`
- `PRD`
- `ADR anterior`
- `RFC anterior`
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
direta do usuário durante a entrevista desta skill, tratada como fato. Use este valor em vez de deixar o
item de fora do Tracker: a cobertura desta tabela é total (ver
[Regras de preenchimento](#regras-de-preenchimento)), então toda informação registrada no RFC precisa ter
uma linha correspondente, mesmo quando a fonte é a própria entrevista.

Se o material de entrada restringir o vocabulário de `Fonte` a um conjunto fechado que não inclui nenhuma
categoria para "outro documento de design" (por exemplo, um formato de Tracker que só aceita valores como
`TRANSCRICAO` ou `CODIGO`, ver [Entrada](../SKILL.md#entrada)), trate uma linha `RFC-REL-NNN` (Decisão
Relacionada) como um link estrutural do próprio RFC para o ADR, PRD ou RFC anterior, sem forçar um valor de
`Fonte` fora do vocabulário permitido. Isso segue o mesmo tratamento que outras skills desta família dão a
metadados de "Relacionado a" entre documentos: o link em si não é reapurado no Tracker, porque o documento
referenciado já tem sua própria origem rastreada no Tracker daquele documento.

### Localização

Como preencher, de acordo com o valor de `Fonte`:

- `Transcrição de reunião`: timestamp e nome de quem falou, exatamente no formato `[hh:mm] Nome` (ex:
  `[09:17] Diego`).
- `Ata`: identificação da ata (data ou título) e o tópico correspondente.
- `PRD`, `ADR anterior`, `RFC anterior`: caminho do arquivo e a seção de origem (ex: `docs/PRD.md, seção
  "Arquitetura e abordagem"`).
- `Documento de requisitos`: nome ou caminho do documento e a seção ou identificador de origem.
- `Ticket`: identificador do ticket (ex: `JIRA-1234`).
- `E-mail`: data e assunto do e-mail.
- `Outro artefato`: nome ou identificador do artefato mais o trecho que localize o item sem ambiguidade.
- `Código-fonte`: caminho do arquivo real no repositório, seguido de dois-pontos e o número da linha a
  partir de onde o trecho relevante pode ser lido, no formato `arquivo:número` (ex:
  `src/modules/orders/order.service.ts:42`). Nunca referencie um arquivo que não exista no repositório, nem
  uma linha fora do intervalo real do arquivo.
- `Entrevista`: identificação do campo perguntado, no formato `Entrevista do RFC, campo [nome do campo]`
  (ex: `Entrevista do RFC, campo Questões em Aberto`).

Em todos os casos, a localização precisa apontar para um trecho específico do material de origem (ou, no
caso de `Entrevista`, para o campo específico perguntado), nunca para o documento inteiro.

## Regras de preenchimento

- Cobertura total: 100% dos itens identificáveis no RFC devem ter uma linha correspondente no Tracker, sem
  exceção. Isso é possível porque esta skill não aceita conteúdo hipotético (ver
  [Identificação da proposta](../SKILL.md#identificação-da-proposta) em SKILL.md): todo item vem de um
  documento, do código ou de uma resposta direta do usuário tratada como fato, e cada uma dessas três
  origens tem um valor de `Fonte` correspondente nesta tabela (a última é `Entrevista`).
- Se, ao montar o Tracker, sobrar algum item do RFC sem nenhuma `Fonte` possível de atribuir, isso é sinal
  de que o item não tem origem identificável e provavelmente foi inventado. Nesse caso, o item deve ser
  ajustado ou removido do RFC antes de finalizar, nunca forçado no Tracker com uma fonte ou localização
  inventada.
- Nunca inclua uma linha para um item que não existe de fato no RFC correspondente.
- Ao acrescentar linhas a um `docs/TRACKER.md` já existente, nunca duplique uma linha com o mesmo ID de uma
  já presente na tabela; se o ID já existir (por exemplo, o RFC foi regenerado), atualize a linha existente
  em vez de duplicá-la.
