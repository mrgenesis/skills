# Template de ADR (modelo de saída)

Cada decisão confirmada vira um arquivo separado, seguindo exatamente este modelo. A saída deve ser
entregue exatamente neste formato Markdown, em português, preenchendo cada campo entre colchetes com o que
foi coletado (remova os colchetes e o texto de exemplo). Um ADR por arquivo, nunca duas decisões
independentes no mesmo arquivo.

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de ADR
diferente (nome de arquivo, seções extras, metadados específicos), esse formato prevalece, desde que
mantenha as seções mínimas Status, Contexto, Decisão, Alternativas Consideradas e Consequências (ver
[Entrada](../SKILL.md#entrada)).

```markdown
# ADR-[NNN]: [Título curto e específico da decisão]

**Status:** [Proposto | Aceito | Rejeitado | Descontinuado | Substituído por ADR-NNN]
**Data:** [AAAA-MM-DD, se conhecida; caso contrário, omita esta linha]
**Decisores:** [pessoas ou papéis envolvidos, se souber; caso contrário, omita esta linha]
**Relacionado a:** [ADR-NNN, PRD, RFC ou FDD relevantes, se houver; caso contrário, omita esta linha]
**Substitui / Substituído por:** [ADR-NNN, apenas quando aplicável; caso contrário, omita esta linha]

---

## Contexto

[Descreva o problema, a motivação e as restrições que forçaram essa decisão. Inclua forças em jogo:
requisitos concorrentes, limitações técnicas, riscos, ou o que já existe no sistema e é relevante para a
decisão. Duas a cinco frases, ou uma lista curta quando houver múltiplas restrições.]

## Decisão

[Declare a solução efetivamente escolhida, de forma direta, e explique o motivo principal. Uma decisão
por ADR. Se a decisão ainda não foi fechada (Status: Proposto), deixe isso claro no texto.]

## Alternativas Consideradas

### [Nome da alternativa 1]
[O que essa alternativa propunha e por que foi descartada. Se nenhuma alternativa foi de fato avaliada,
registre esse fato diretamente aqui (ex: "Nenhuma alternativa foi avaliada; a decisão seguiu diretamente o
padrão já em uso"), em vez de descrever uma alternativa que não foi realmente considerada.]

### [Nome da alternativa 2]
[O que essa alternativa propunha e por que foi descartada.]

## Consequências

**Positivas**
- [benefício concreto 1]
- [benefício concreto 2]

**Negativas**
- [custo, limitação ou risco concreto 1]
- [custo, limitação ou risco concreto 2]

## Referências

- [link ou caminho para PRD, RFC, FDD ou ADR relacionado, se houver]
- [caminho de arquivo ou módulo do código-fonte relevante, se a decisão referenciar código existente]
```

## Regras de preenchimento

- **Status**: use "Aceito" só quando o material (ou o usuário) confirma que a decisão está fechada. Use
  "Proposto" quando ainda está em revisão ou aberta. Nunca infira "Aceito" de uma decisão que o material
  apresenta como discutida mas não fechada.
- **Alternativas Consideradas**: no mínimo 1 item real, seja uma alternativa de fato avaliada (discutida no
  material ou confirmada pelo usuário) seja o registro explícito de que nenhuma alternativa foi avaliada.
  Nunca preencha com uma alternativa hipotética ou sugerida pela IA que não tenha sido confirmada como algo
  realmente considerado na decisão.
- **Consequências**: sempre com pelo menos 1 item positivo e 1 negativo. Uma decisão sem nenhuma
  consequência negativa é sinal de que o trade-off real não foi levantado; volte à entrevista antes de
  finalizar.
- **Metadados opcionais** (Data, Decisores, Relacionado a, Substitui / Substituído por): inclua a linha
  apenas quando o dado é conhecido. Omita a linha inteira em vez de preencher com "não informado" ou
  similar.
- **Referências**: inclua apenas links e caminhos que de fato existem (documentos já produzidos, arquivos
  reais do repositório). Nunca invente um caminho de arquivo ou um link para preencher a seção.
