# Template de Tracker de Rastreabilidade do PRD (modelo de saída)

O Tracker é uma tabela markdown que mapeia cada item registrado no PRD à sua origem real, no material de
entrada usado para gerá-lo. Ele existe para que qualquer leitor consiga responder "de onde veio essa
informação", e para expor rapidamente qualquer item sem origem identificável, que é sinal de invenção.

Esta tabela é transversal ao projeto, não exclusiva dos PRDs: se o projeto já tiver um `docs/TRACKER.md`
gerado por outra skill (ex: `criador-rfc`, `criador-adr`, `criador-fdd`), acrescente as linhas novas à
tabela existente em vez de criar um arquivo separado (ver [Salvar o PRD em arquivo](../SKILL.md#salvar-o-prd-em-arquivo)).

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de Tracker
(colunas, valores aceitos de `Fonte`, esquema de ID), esse formato prevalece sobre o que está descrito aqui
(ver [Entrada](../SKILL.md#entrada)).

## Formato obrigatório da tabela

```markdown
| ID | Documento | Tipo | Conteúdo (resumo) | Fonte | Localização |
| --- | --- | --- | --- | --- | --- |
| PRD-FR-001 | docs/PRD.md | Requisito Funcional | [resumo de até 20 palavras] | Transcrição de reunião | [hh:mm] Nome |
```

Cada linha da tabela é um item rastreado. Preencha uma linha por item identificável no PRD, na ordem em
que preferir (pela ordem das seções do PRD, ou pela ordem de aparição no material de origem).

## Colunas

### ID

Identificador único do item, sempre no formato `PRD-<TIPO>-NNN`, com o número zero-padded a 3 dígitos e
sequencial dentro de cada tipo (sem lacunas). Sempre que o próprio PRD já numerar o item (por exemplo, um
requisito funcional `FR-001`), reuse esse mesmo número no ID do Tracker, para o ID ficar diretamente
rastreável ao cabeçalho do PRD.

Prefixos de tipo possíveis:
- `PRD-PROB-NNN`: problema ou oportunidade (seção "Contexto e problema")
- `PRD-GOAL-NNN`: objetivo com métrica e meta (seção "Objetivos e métricas")
- `PRD-SCOPE-NNN`: item incluso no escopo
- `PRD-OUT-NNN`: item fora de escopo
- `PRD-FR-NNN`: requisito funcional
- `PRD-NFR-NNN`: requisito não funcional
- `PRD-DEC-NNN`: decisão e trade-off
- `PRD-DEP-NNN`: dependência
- `PRD-RISK-NNN`: risco e mitigação
- `PRD-AC-NNN`: critério de aceitação
- `PRD-TEST-NNN`: item da estratégia de testes e validação

### Documento

Sempre `docs/PRD.md` (ou o caminho onde o PRD foi salvo, se o usuário indicou outro).

### Tipo

Descreve a natureza do item. Valores possíveis:
- Problema
- Objetivo
- Escopo
- Fora de Escopo
- Requisito Funcional
- Requisito Não Funcional
- Decisão
- Trade-off
- Dependência
- Risco
- Critério de Aceitação
- Estratégia de Teste
- Restrição

Use sempre o valor mais específico da lista acima. Só use "Restrição" quando nenhum outro tipo da lista
descrever o item com precisão.

### Conteúdo (resumo)

Descrição de uma linha do item, em português, com **no máximo 20 palavras**. Resuma o item o suficiente
para alguém entender do que se trata sem abrir o PRD, mas sem reescrever o item inteiro aqui. Se o resumo
natural ultrapassar 20 palavras, corte para o núcleo do item (o quê + por quê essencial), não liste todos
os detalhes.

### Fonte

O tipo de material de entrada de onde o item veio, usando exatamente as mesmas categorias definidas em
"Entrada" e "Análise de código-fonte" no `SKILL.md`. Um dos valores abaixo:
- `Transcrição de reunião`
- `Ata`
- `BPMN ou fluxograma de processo`
- `Documento de requisitos`
- `Ticket`
- `E-mail`
- `PRD ou spec antigo`
- `Outro artefato`
- `Código-fonte`
- `Entrevista`

Nunca deixe em branco e nunca use um valor fora dessa lista. Um item que combina mais de uma fonte (por
exemplo, uma decisão discutida em reunião e também refletida em um padrão já existente no código) vira
duas linhas separadas no Tracker, uma para cada fonte, com o mesmo ID base e um sufixo (`-A`, `-B`) se
necessário para manter unicidade.

`Entrevista` é o valor usado quando o item não veio de nenhum documento nem do código, e sim de uma resposta
direta do usuário durante a entrevista complementar desta skill, tratada como fato. Use este valor em vez de
deixar o item de fora do Tracker: a cobertura desta tabela é total (ver
[Regras de preenchimento](#regras-de-preenchimento)), então toda informação registrada no PRD precisa ter uma
linha correspondente, mesmo quando a fonte é a própria entrevista.

### Localização

Como preencher, de acordo com o valor de `Fonte`:
- `Transcrição de reunião`: timestamp e nome de quem falou, exatamente no formato `[hh:mm] Nome` (ex:
  `[09:17] Diego`).
- `Ata`: identificação da ata (data ou título) e o tópico correspondente (ex: `Ata de 05/09/2026, tópico
  "Decisões técnicas"`).
- `BPMN ou fluxograma de processo`: nome do fluxo e o elemento ou etapa específica (ex: `Fluxo "Aprovação
  de pedido", etapa "Validar estoque"`).
- `Documento de requisitos`: nome ou caminho do documento e a seção ou identificador do requisito de
  origem (ex: `documento-requisitos.md, seção 3.2` ou `RF-12`).
- `Ticket`: identificador do ticket (ex: `JIRA-1234`).
- `E-mail`: data e assunto do e-mail (ex: `E-mail de 03/09/2026, assunto "Decisão sobre X"`).
- `PRD ou spec antigo`: nome do arquivo e a seção de origem (ex: `prd-anterior.md, seção "Escopo"`).
- `Outro artefato`: nome ou identificador do artefato mais o trecho, seção ou elemento que localize o item
  com precisão suficiente para alguém achar a origem sem ambiguidade.
- `Código-fonte`: caminho do arquivo real no repositório, seguido de dois-pontos e o número da linha a
  partir de onde o trecho relevante pode ser lido, no formato `arquivo:número` (ex:
  `src/modules/orders/order.service.ts:42`). Nunca referencie um arquivo que não exista no repositório, nem
  uma linha fora do intervalo real do arquivo.
- `Entrevista`: identificação do campo perguntado, no formato `Entrevista do PRD, campo [nome do campo]`
  (ex: `Entrevista do PRD, campo Objetivos e métricas`).

Em todos os casos, a localização precisa apontar para um trecho específico do material de origem (ou, no
caso de `Entrevista`, para o campo específico perguntado), nunca para o documento inteiro (por exemplo,
nunca apenas `TRANSCRICAO.md` sem o timestamp, nem apenas `order.service.ts` sem o número da linha).

## Regras de preenchimento

- Cobertura total: 100% dos itens identificáveis no PRD devem ter uma linha correspondente no Tracker, sem
  exceção. Isso é possível porque esta skill não aceita conteúdo hipotético fora do que está explicitamente
  marcado como hipótese: todo item vem de um documento, do código ou de uma resposta direta do usuário
  tratada como fato, e cada uma dessas três origens tem um valor de `Fonte` correspondente nesta tabela (a
  última é `Entrevista`).
- Itens cujo valor final veio apenas de um default marcado como hipótese (ver
  [Defaults inteligentes](../SKILL.md#defaults-inteligentes)) não entram no Tracker: eles não têm uma fonte real
  no material de entrada, no código ou na entrevista para apontar.
- Se, ao montar o Tracker, sobrar algum item do PRD sem nenhuma `Fonte` possível de atribuir (que não seja um
  default marcado como hipótese), isso é sinal de que o item não tem origem identificável e provavelmente foi
  inventado. Nesse caso, o item deve ser ajustado ou removido do PRD antes de finalizar, nunca forçado no
  Tracker com uma fonte ou localização inventada.
- Nunca inclua uma linha para um item que não existe de fato no PRD.
- Ao acrescentar linhas a um `docs/TRACKER.md` já existente, nunca duplique uma linha com o mesmo ID de uma
  já presente na tabela; se o ID já existir (por exemplo, o PRD foi regenerado), atualize a linha existente
  em vez de duplicá-la.
