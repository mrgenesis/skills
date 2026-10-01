# Tema: entrega e aceite

Fonte: PROP 2.4.3.1 (v1, 25/08/2026), itens 2.2, 2.10, 2.12, 2.25, 2.26, 5.7 a 5.10 e passos 7 a 12 do fluxo.

## 1. Conceitos

- **Entrega** (2.12): parte ou todo do projeto concluído, **minimamente observável** e que agregue valor ao Sebrae MS.
- **Ciclo de execução** (2.10): período de **até 30 dias** em que se pactua a entrega de uma parte do backlog.
- **KCS, Knowledge-Centered Service** (2.2): base de conhecimento que documenta entregas, incidentes e problemas resolvidos, conforme padrões editoriais e de qualidade.
- **Ambiente de Sandbox** (2.25): servidor(es) onde a aplicação fica disponível para testes pelo Técnico e Titular, para validar entregas parciais ou completas.
- **Ambiente de Produção** (2.26): servidor(es) de uso real.

## 2. Anexos obrigatórios (5.7)

| Anexo | Papel na aceitação |
|---|---|
| **II, Regras para atender chamados no GLPI** | Procedimento **obrigatório** de registro, acompanhamento e fechamento de chamados e documentação de entregas, incidentes e problemas. O KCS integrado ao GLPI garante rastreabilidade e atualização contínua. Ver [glpi-chamados.md](glpi-chamados.md). |
| **III, Guia de Desenvolvimento com Git** | Diretrizes para manter o versionamento organizado, rastreável e claro. Ver [git-repositorio.md](git-repositorio.md). |

## 3. Status de aceite (5.8)

| Status | Quando | Consequência |
|---|---|---|
| **NA, Não Aceita** | Há não conformidades com o Anexo II ou III (que impedem a implantação). | Entrega **não concluída**; revalidação obrigatória após correção; pode acarretar **não pagamento** até que tudo seja atendido e validado. Entregas reprovadas são arquivadas e podem ser reabertas por nova solicitação formal. |
| **PA, Parcialmente Aceita** | Há não conformidades com o Anexo II ou III, **mas é possível implantar em produção**. | A inconformidade deve ser corrigida **no próximo ciclo de execução**. |
| **TA, Totalmente Aceita** | Todas as conformidades validadas e aceitas. | Autoriza **encerramento do chamado, liberação/implantação e pagamento**, conforme aplicável. |

A diferença prática entre NA e PA é se dá para implantar com a não conformidade. Use esse critério para separar "Bloqueante" de "Corrigir no próximo ciclo" no relatório.

## 4. Requisitos da entrega para validação

- **Dados mínimos** para a validação devem ser enviados (5.9).
- **Referências cruzadas obrigatórias** entre o **ticket GLPI** e o **artigo KCS publicado** (5.10).
- Entrega para homologação (passo 8): enviada ao **sandbox**, com **dados mínimos para teste** e a **documentação KCS** prevista.
- Avaliação técnica (passo 9): o Técnico valida a documentação KCS e as informações mínimas de teste. Reprovação devolve a demanda **com prioridade** e pode acarretar não pagamento.
- Pagamento (passo 10) só com validação técnica.
- Validação funcional (passo 11) pelo Titular; ajustes finos permitidos desde que não alterem o escopo validado.
- Entrega em produção (passo 12): conflitos resolvidos no GitLab antes.

## 5. Entrega para homologação

Nos checklists, **(B)** marca item bloqueante (leva a NA) e **(O)** marca recomendação que não é regra escrita (vira observação, sem afetar o status). Os demais, se descumpridos, são "corrigir no próximo ciclo" (PA).

**Checklist: entrega para homologação**

- [ ] Requisição de mudança (issue) com objetivo descrito ([gestao-mudancas.md](gestao-mudancas.md)).
- [ ] Commits e MR conforme [git-repositorio.md](git-repositorio.md); commit de conclusão com `Closes #<id>`.
- [ ] Entrega no sandbox com dados mínimos para teste.
- [ ] Documentação KCS prevista publicada.
- [ ] **(B)** Referências cruzadas entre o chamado GLPI e o artigo KCS.
- [ ] Versão (semver) coerente com o tipo de mudança; tags `vX.Y.Z-rc.N` na `hml` e `vX.Y.Z` na `main`.

## Lacunas e ambiguidades

- O **"manual KCS no anexo II"** citado em 5.2 não está detalhado no documento do GLPI disponível, além da tarefa 81; o campo "Salvar em base de conhecimento" está marcado como "não mexer por enquanto". Não há padrão editorial definido para o artigo KCS.
- Não está definido o formato das referências cruzadas (5.10): links, IDs, campo específico.
- O que são os "dados mínimos" para validação (5.9) não é especificado.
