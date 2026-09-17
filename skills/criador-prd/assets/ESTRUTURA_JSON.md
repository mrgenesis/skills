# Estrutura de Dados (JSON)

Durante a entrevista, mantenha internamente as informações coletadas organizadas segundo a estrutura
abaixo. O usuário não deve ver esse JSON durante a coleta, apenas ao final, se pedir a exportação.

Regras importantes do JSON:

- As chaves são sempre em inglês, exatamente como definidas abaixo.
- Os valores (conteúdo textual) permanecem em português, porque refletem o PRD.
- Preencha apenas com os dados realmente coletados.
- Não inclua campos vazios no JSON final entregue ao usuário.
- Não inclua seções que não apareceram no PRD final.
- Não inclua anexos e referências.
- Não inclua stakeholders.
- Não inclua próximos passos.
- Não inclua datas e prazos.
- A subseção "Compatibilidade e portabilidade" do template de PRD corresponde às categorias `compatibility`
  e `portability` de `non_functional_requirements`. Gere uma entrada para cada categoria quando o PRD
  tratar compatibilidade e portabilidade como pontos distintos, ou uma única entrada `compatibility`
  cobrindo as duas quando o PRD não fizer essa distinção.

```json
{
  "meta": {
    "product": "",
    "feature": "",
    "prd_owner": "",
    "version": "",
    "date": "YYYY-MM-DD"
  },
  "context": {
    "summary": "",
    "target_audience": [],
    "key_use_cases": [],
    "deployment_context": {
      "type": "existing_system|new_system",
      "description": ""
    },
    "problems": [
      {
        "description": "",
        "impact": "",
        "priority": "high|medium|low"
      }
    ]
  },
  "goals": [
    {
      "goal": "",
      "metric": "",
      "target": ""
    }
  ],
  "scope": {
    "in_scope": [],
    "out_of_scope": []
  },
  "functional_requirements": [
    {
      "id": "FR-001",
      "name": "",
      "description": "",
      "main_flow": [],
      "alternative_flows": [],
      "known_errors": [],
      "priority": "high|medium|low"
    }
  ],
  "non_functional_requirements": [
    {
      "category": "performance|availability|security|observability|reliability|compatibility|portability|compliance|accessibility",
      "specifications": []
    }
  ],
  "architecture": {
    "approach": "",
    "components": [],
    "integrations": []
  },
  "decisions_tradeoffs": [
    {
      "decision": "",
      "justification": "",
      "trade_off": ""
    }
  ],
  "dependencies": [
    {
      "type": "external|organizational|technical",
      "title": "",
      "description": ""
    }
  ],
  "risks": [
    {
      "risk": "",
      "probability": "low|medium|high",
      "impact": "",
      "mitigation": [],
      "contingency_plan": ""
    }
  ],
  "acceptance_criteria": [],
  "testing_validation": {
    "test_types": [],
    "strategy": ""
  }
}
```
