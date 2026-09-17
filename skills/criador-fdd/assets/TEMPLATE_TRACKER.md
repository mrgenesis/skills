# Template de Tracker de Rastreabilidade do FDD (modelo de saída)

O Tracker é uma tabela markdown que mapeia cada item registrado no FDD à sua origem real, no material de
entrada usado para gerá-lo. Ele existe para que qualquer leitor consiga responder "de onde veio essa
informação", e para expor rapidamente qualquer item sem origem identificável, que é sinal de invenção.

Esta tabela é transversal ao projeto, não exclusiva do FDD: se o projeto já tiver um `docs/TRACKER.md`
gerado por outra skill (ex: `criador-adr`, `criador-prd`, `criador-rfc`), acrescente as linhas novas à
tabela existente em vez de criar um arquivo separado (ver [Salvar o FDD em arquivo](../SKILL.md#salvar-o-fdd-em-arquivo)).

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de Tracker
(colunas, valores aceitos de `Fonte`, esquema de ID), esse formato prevalece sobre o que está descrito aqui
(ver [Entrada](../SKILL.md#entrada)).

## Formato obrigatório da tabela

```markdown
| ID | Documento | Tipo | Conteúdo (resumo) | Fonte | Localização |
| --- | --- | --- | --- | --- | --- |
| FDD-CONTRATO-01 | docs/FDD.md | Contrato Público | [resumo de até 20 palavras] | Código-fonte | src/modules/orders/order.controller.ts:18 |
```

Cada linha da tabela é um item rastreado. Preencha uma linha por item identificável no FDD, na ordem das
seções do documento.

## Colunas

### ID

Identificador único do item, sempre no formato `FDD-<TIPO>-NNN`, com o número sequencial dentro de cada
tipo (sem lacunas). Prefixos de tipo possíveis:

- `FDD-CTX-NNN`: um elemento de contexto ou motivação técnica
- `FDD-OBJ-NNN`: um objetivo técnico
- `FDD-ESCOPO-NNN`: um item incluído no escopo
- `FDD-FORA-NNN`: um item fora de escopo
- `FDD-FLUXO-NNN`: um passo ou variação de fluxo relevante
- `FDD-CONTRATO-NNN`: um contrato público (endpoint, função, método, fila, stream, SDK)
- `FDD-ERRO-NNN`: um erro da matriz de erros
- `FDD-OBS-NNN`: um item de observabilidade (métrica, log, span de tracing, dashboard ou alerta)
- `FDD-DEP-NNN`: uma dependência ou garantia de compatibilidade
- `FDD-INTEG-NNN`: um item da seção Integração com o sistema existente
- `FDD-AC-NNN`: um critério de aceite técnico
- `FDD-RISCO-NNN`: um risco e sua mitigação

Exemplo: o terceiro contrato público é `FDD-CONTRATO-03`; o segundo risco é `FDD-RISCO-02`.

### Documento

Sempre `docs/FDD.md` (ou o caminho onde o FDD foi salvo, se o usuário indicou outro).

### Tipo

Descreve a natureza do item. Valores possíveis:

- Contexto Técnico
- Objetivo Técnico
- Escopo
- Fora de Escopo
- Fluxo
- Contrato Público
- Erro
- Observabilidade
- Dependência
- Integração com Sistema Existente
- Critério de Aceite
- Risco

### Conteúdo (resumo)

Descrição de uma linha do item, em português, com **no máximo 20 palavras**. Para contratos, inclua o nome
e o tipo (ex: "POST /v1/webhooks/subscriptions: cria uma nova inscrição de webhook"). Para erros, inclua o
código e a condição.

### Fonte

O tipo de material de entrada de onde o item veio. Um dos valores abaixo:

- `Transcrição de reunião`
- `Ata`
- `PRD`
- `RFC`
- `ADR anterior`
- `HLD`
- `Documento de requisitos ou especificação técnica`
- `Ticket`
- `E-mail`
- `Outro artefato`
- `Código-fonte`
- `Entrevista`

Nunca deixe em branco e nunca use um valor fora dessa lista. Um item que combina mais de uma fonte (por
exemplo, um contrato descrito na transcrição e também refletido em um padrão já existente no código) vira
duas linhas separadas no Tracker, com o mesmo ID base e um sufixo (`-A`, `-B`) se necessário para manter
unicidade.

`Entrevista` é o valor usado quando o item não veio de nenhum documento nem do código, e sim de uma resposta
direta do usuário durante a entrevista desta skill, tratada como fato. Um default marcado como hipótese (ver
[Defaults inteligentes](../SKILL.md#defaults-inteligentes)) não entra no Tracker: ele não tem origem real no
material de entrada nem foi confirmado pelo usuário como fato, então fica fora desta tabela por definição
(ver [Regras de preenchimento](#regras-de-preenchimento)).

### Localização

Como preencher, de acordo com o valor de `Fonte`:

- `Transcrição de reunião`: timestamp e nome de quem falou, exatamente no formato `[hh:mm] Nome` (ex:
  `[09:17] Diego`).
- `Ata`: identificação da ata (data ou título) e o tópico correspondente.
- `PRD`, `RFC`, `ADR anterior`, `HLD`: caminho do arquivo e a seção de origem (ex: `docs/RFC.md, seção
  "Proposta técnica"`).
- `Documento de requisitos ou especificação técnica`: nome ou caminho do documento e a seção ou
  identificador de origem.
- `Ticket`: identificador do ticket (ex: `JIRA-1234`).
- `E-mail`: data e assunto do e-mail.
- `Outro artefato`: nome ou identificador do artefato mais o trecho que localize o item sem ambiguidade.
- `Código-fonte`: caminho do arquivo real no repositório, seguido de dois-pontos e o número da linha a
  partir de onde o trecho relevante pode ser lido, no formato `arquivo:número` (ex:
  `src/modules/orders/order.service.ts:42`). Nunca referencie um arquivo que não exista no repositório, nem
  uma linha fora do intervalo real do arquivo.
- `Entrevista`: identificação do campo perguntado, no formato `Entrevista do FDD, campo [nome do campo]`
  (ex: `Entrevista do FDD, campo Matriz de erros`).

Em todos os casos, a localização precisa apontar para um trecho específico do material de origem (ou, no
caso de `Entrevista`, para o campo específico perguntado), nunca para o documento inteiro.

## Regras de preenchimento

- Cobertura mínima: pelo menos 80% dos itens identificáveis no FDD devem ter uma linha correspondente no
  Tracker.
- Itens cujo valor final veio apenas de um default marcado como hipótese (ver
  [Defaults inteligentes](../SKILL.md#defaults-inteligentes)) não entram no Tracker: eles não têm uma fonte da
  lista acima para apontar. Isso é esperado, e é parte do motivo pelo qual a cobertura mínima é 80%, não
  100%.
- Se não for possível preencher `Localização` para um item que deveria ter uma origem real e verificável em
  documento ou código, isso é sinal de que o item não tem origem identificável e provavelmente foi
  inventado. Nesse caso, o item deve ser ajustado ou removido do FDD, não forçado no Tracker com uma
  localização inventada.
- Nunca inclua uma linha para um item que não existe de fato no FDD.
- Ao acrescentar linhas a um `docs/TRACKER.md` já existente, nunca duplique uma linha com o mesmo ID de uma
  já presente na tabela; se o ID já existir (por exemplo, o FDD foi regenerado), atualize a linha existente
  em vez de duplicá-la.
