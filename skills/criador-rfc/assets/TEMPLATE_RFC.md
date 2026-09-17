# Template de RFC (modelo de saída)

O RFC final deve ser entregue exatamente neste formato Markdown, em português, preenchendo cada campo
entre colchetes com o que foi coletado (remova os colchetes e o texto de exemplo). Um documento conciso, de
2 a 4 páginas, nunca descendo ao nível de detalhe de um FDD.

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de RFC
diferente (seções extras, metadados específicos, nomenclatura), esse formato prevalece, desde que mantenha
as seções mínimas definidas em [Estrutura mínima do RFC](../SKILL.md#estrutura-mínima-do-rfc).

```markdown
# RFC: [Título curto e específico da proposta]

**Autor:** [nome ou papel de quem propõe]
**Status:** [Proposto | Em revisão | Aceito | Rejeitado | Substituído]
**Data:** [AAAA-MM-DD]
**Versão:** [ex: 1.0]
**Revisores:** [pessoas ou papéis que deveriam revisar, se souber; caso contrário, omita esta linha]

---

## Resumo executivo (TL;DR)

[3 a 5 frases resumindo a proposta: o problema, a solução proposta em alto nível, e o principal ponto ainda
em aberto, se houver um central para a decisão.]

## Contexto e problema

[Descreva o que motiva a proposta e as restrições relevantes: o que está acontecendo hoje, por que isso
precisa de uma solução em nível de arquitetura, e o que já existe no sistema que é relevante para a
proposta. Referencie ADRs relacionados em vez de reexplicar decisões já fechadas (ver
[Decisões relacionadas](#decisões-relacionadas)).]

## Proposta técnica

[Visão geral da solução proposta: a abordagem escolhida, os componentes principais envolvidos e como eles
se relacionam. Mantenha em nível de arquitetura: sem contrato de API, sem matriz de erros, sem fluxo
passo a passo de implementação. Se a proposta ainda tem uma decisão central pendente de revisão, deixe isso
explícito no texto.]

## Alternativas consideradas

### [Nome da alternativa 1]
[O que essa alternativa propunha e o trade-off explícito que motivou o descarte.]

### [Nome da alternativa 2]
[O que essa alternativa propunha e o trade-off explícito que motivou o descarte.]

## Questões em aberto

- [Pergunta ou ponto levantado no material, ainda não decidido, adiado ou deixado para observação futura.]
- [Pergunta ou ponto levantado no material, ainda não decidido, adiado ou deixado para observação futura.]

## Impacto e riscos

[Sistemas, times, fluxos ou processos afetados pela proposta, e os principais riscos de segui-la. Uma
lista curta é aceitável quando houver múltiplos itens.]

## Decisões relacionadas

- [[ADR-NNN: título](caminho/do/arquivo.md), para cada decisão já registrada relacionada a esta proposta]
- [link Markdown para PRD, RFC anterior ou outro documento relevante, se houver]
```

## Regras de preenchimento

- **Status**: use "Aceito" só quando o material (ou o usuário) confirma que a proposta foi de fato aceita
  pela equipe. Use "Proposto" ou "Em revisão" enquanto ainda está sujeita a discussão. Nunca infira
  "Aceito" de uma proposta que o material apresenta como discutida mas não fechada.
- **Resumo executivo**: escreva por último, depois das demais seções estarem prontas, sintetizando o que
  foi de fato registrado nelas. Nunca introduza nele um fato que não apareça em nenhuma outra seção.
- **Proposta técnica**: visão geral apenas. Se o material fornecido só existe em nível de detalhe de
  implementação, resuma para a visão geral e sinalize ao usuário que o detalhe pertence a um FDD (ver
  [Distinção entre RFC, ADR, PRD e FDD](../SKILL.md#distinção-entre-rfc-adr-prd-e-fdd)).
- **Alternativas Consideradas**: no mínimo 2 itens reais (alternativas de fato avaliadas e descartadas,
  discutidas no material ou confirmadas pelo usuário), cada uma com o trade-off explícito do descarte. Se
  não houver 2 reais mesmo após perguntar, siga o tratamento de déficit descrito em
  [Critério de elegibilidade](../SKILL.md#critério-de-elegibilidade-para-alternativas-e-questões-em-aberto) e
  sinalize isso claramente no texto desta seção, em vez de completar com uma alternativa hipotética.
- **Questões em aberto**: no mínimo 2 itens reais (pontos de fato levantados e ainda não decididos). Nunca
  promova uma alternativa já descartada a questão em aberto, nem o contrário. Mesmo tratamento de déficit
  quando não houver 2 reais.
- **Metadados opcionais** (Revisores): inclua a linha apenas quando o dado é conhecido. Omita a linha
  inteira em vez de preencher com "não informado" ou similar.
- **Decisões relacionadas**: inclua apenas links e caminhos que de fato existem (ADRs, PRDs ou RFCs já
  produzidos), sempre como link Markdown real (`[texto](caminho)`), nunca como texto solto sem link. Se
  houver mais de um ADR diretamente relacionado à Proposta técnica, referencie todos, não apenas um exemplo
  isolado. Nunca invente um caminho de arquivo ou um link para preencher a seção. Se não houver nenhuma
  decisão relacionada real, omita a seção do conteúdo mas mantenha o título, com uma nota curta indicando
  que nenhuma foi identificada.
