# Estrutura de Dados (JSON)

Durante a extração e a entrevista, mantenha internamente as informações coletadas organizadas segundo a
estrutura abaixo. O usuário não deve ver esse JSON durante a coleta, apenas ao final, se pedir a exportação.

Regras importantes do JSON:

- As chaves são sempre em inglês, exatamente como definidas abaixo.
- Os valores (conteúdo textual) permanecem em português, porque refletem o FDD.
- Preencha apenas com os dados realmente coletados.
- Não inclua campos vazios no JSON final entregue ao usuário.
- Não inclua seções que não apareceram no FDD final.
- O campo `existing_system_integration` só é incluído quando o FDD final tiver a seção "Integração com o
  sistema existente" (ver Seção de integração com o sistema existente em SKILL.md).

```json
{
  "meta": {
    "product_or_system": "",
    "feature_name": "",
    "fdd_owner": "",
    "version": "",
    "date": "YYYY-MM-DD"
  },
  "context": {
    "technical_motivation": "",
    "fit_with_existing_system": "",
    "actors": [],
    "assumptions": [],
    "constraints": []
  },
  "technical_objectives": [
    {
      "objective": "",
      "measure_or_invariant": ""
    }
  ],
  "scope": {
    "included": [],
    "excluded": []
  },
  "detailed_flows": {
    "main_flow": [],
    "alternative_flows": [],
    "diagrams": []
  },
  "public_contracts": [
    {
      "name": "",
      "kind": "function|method|http_endpoint|queue|stream|sdk",
      "signature_or_route": "",
      "method": "",
      "request_example": {},
      "response_example": {},
      "headers_semantics": [],
      "status_semantics": [],
      "limits": {
        "rate": "",
        "payload_size": "",
        "timeout": ""
      },
      "versioning": ""
    }
  ],
  "errors_exceptions_fallback": {
    "error_matrix": [
      {
        "code": "",
        "condition": "",
        "treatment": "",
        "notes": ""
      }
    ],
    "resilience_strategies": ["timeouts", "retries", "backoff", "circuit_breaker"],
    "fallback_policy": "",
    "invariants": []
  },
  "observability": {
    "metrics": [],
    "logs": {
      "format": "",
      "fields": []
    },
    "tracing": {
      "spans": [],
      "sampling": ""
    },
    "dashboards_alerts": []
  },
  "dependencies_compatibility": {
    "dependencies": [
      {
        "component": "",
        "min_version": "",
        "notes": ""
      }
    ],
    "compatibility_guarantees": []
  },
  "existing_system_integration": [
    {
      "file_or_module": "",
      "description": ""
    }
  ],
  "acceptance_criteria": [],
  "risks": [
    {
      "risk": "",
      "probability": "low|medium|high",
      "impact": "",
      "mitigation": [],
      "contingency_plan": ""
    }
  ]
}
```
