# Template de FDD (modelo de saída)

O FDD final deve ser entregue exatamente neste formato Markdown, em português, preenchendo cada campo entre
colchetes com o que foi coletado (remova os colchetes e o texto de exemplo).

Este é o formato default desta skill. Se o material de entrada já define um formato obrigatório de FDD
diferente (seções extras, metadados específicos, convenção de nomenclatura de erros), esse formato
prevalece, desde que mantenha as seções mínimas definidas em
[Estrutura mínima do FDD](../SKILL.md#estrutura-mínima-do-fdd).

````markdown
# FDD: [nome da feature]

Versão: [versão]
Data: [data]
Responsável: [responsável técnico]

---

## 1. Contexto e motivação técnica

[Explique o problema técnico real que a feature resolve, como ela se encaixa no que já existe (arquitetura,
sistemas, HLD) e quais são os atores e limites do escopo. Foque no aspecto técnico, não na motivação de
negócio (isso é papel do PRD, ver Distinção entre FDD, PRD, RFC e ADR no SKILL.md).]

---

## 2. Objetivos técnicos

- [objetivo técnico 1, com medida ou invariante associado]
- [objetivo técnico 2, com medida ou invariante associado]

---

## 3. Escopo e exclusões

**Incluído**
- [item 1]
- [item 2]

**Excluído**
- [item A]
- [item B]

---

## 4. Fluxos detalhados e diagramas

**Fluxo principal**
- [passo 1]
- [passo 2]

**Fluxos alternativos e exceções**
- [variação 1]
- [variação 2]

**Diagramas** (opcional)
- [sequência, estados ou fluxo, quando ajudar a esclarecer o comportamento]

---

## 5. Contratos públicos (assinaturas, endpoints, headers, exemplos)

**[Contrato 1]**
- Tipo: [function|method|endpoint|queue|stream|sdk]
- Assinatura ou rota: [ex: POST /v1/recurso]
- Método: [GET|POST|...]
- Semântica de status e headers:
  - [status ou header 1, com significado]
  - [status ou header 2, com significado]

**Exemplo de requisição**
```json
{}
```

**Exemplo de resposta**
```json
{}
```

---

## 6. Erros, exceções e fallback

**Matriz de erros**

| Código | Condição | Tratamento | Notas |
| --- | --- | --- | --- |
| [código do erro] | [condição que dispara] | [como é tratado] | [observações] |

- Estratégias de resiliência: [timeouts, retries, backoff, circuit breaker]
- Política de fallback: [comportamento quando uma dependência crítica falha]
- Invariantes: [lista de invariantes críticos que nunca podem ser violados]

---

## 7. Observabilidade

**Métricas**
- [métrica 1]
- [métrica 2]

**Logs**
- Formato e campos essenciais, incluindo proteção de dados sensíveis quando aplicável.

**Tracing**
- Spans principais e amostragem.

**Dashboards e alertas**
- [painel ou alerta mínimo]

---

## 8. Dependências e compatibilidade

| Componente | Versão mínima | Observações |
| --- | --- | --- |
| [componente 1] | [vX.Y] | [notas] |

**Garantias de compatibilidade**
- [ex: versionamento semântico da API, paridade entre modos de operação]

---

## Integração com o sistema existente

[Incluir esta seção somente quando houver código-fonte relevante disponível, ver Seção de integração com o
sistema existente no SKILL.md. Cite apenas arquivos, módulos ou classes reais do repositório analisado.]

**[arquivo ou módulo 1]**
[Como a feature estende, consome ou substitui esse arquivo, módulo ou classe.]

**[arquivo ou módulo 2]**
[Como a feature estende, consome ou substitui esse arquivo, módulo ou classe.]

---

## 9. Critérios de aceite técnicos

- [critério objetivo 1]
- [critério objetivo 2]
- [critério objetivo 3]

---

## 10. Riscos e mitigação

### [Risco 1]

- **Probabilidade:** [baixa|média|alta]
- **Impacto:** [impacto esperado]
- **Mitigação:**
  - [ação 1]
  - [ação 2]
- **Plano de contingência:** [plano B, quando aplicável]

### [Risco 2]

- **Probabilidade:** [baixa|média|alta]
- **Impacto:** [impacto esperado]
- **Mitigação:**
  - [ação 1]
- **Plano de contingência:** [plano B, quando aplicável]
````

## Regras de preenchimento

- **Contexto e motivação técnica**: mantenha o foco técnico. Se o rascunho trouxer motivação de negócio ou
  público-alvo, mova para o PRD (ou remova, se já existir um PRD) e mantenha aqui só o encaixe técnico.
- **Contratos públicos**: pelo menos um exemplo de requisição e de resposta por contrato, com semântica de
  status e headers explícita. Nunca deixe um contrato sem exemplo.
- **Matriz de erros**: use a convenção de nomenclatura de código de erro definida pelo material de entrada
  (ex: prefixo específico exigido por um desafio ou guia da empresa), quando houver uma. Na ausência de uma
  convenção definida, use um prefixo curto e consistente relacionado ao nome da feature.
- **Integração com o sistema existente**: inclua apenas quando houver código-fonte relevante disponível
  (ver Seção de integração com o sistema existente no SKILL.md). Cite apenas arquivos, módulos ou classes
  que de fato existem no repositório analisado; se não houver código disponível, omita a seção inteira em
  vez de deixá-la em branco.
- **Riscos e mitigação**: sempre com probabilidade, impacto e ao menos uma ação de mitigação real.
  Mitigação pode ter múltiplos subitens.
- **Diagramas**: opcionais. Só inclua quando um diagrama de fato esclarecer o fluxo além do que a lista de
  passos já mostra.
