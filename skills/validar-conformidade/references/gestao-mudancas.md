# Tema: gestão de mudanças e backlog

Fonte: PROP 2.4.3.1, "Gerir criação, manutenção e sustentação de soluções, aplicações e plataformas" (v1, 25/08/2026), itens 2, 4, 5.3 a 5.6 e 6 (fluxo). Regulador: PDTIC (Plano Diretor de Tecnologia da Informação).

Nos checklists, **(B)** marca item bloqueante (leva a NA) e **(O)** marca recomendação que não é regra escrita (vira observação, sem afetar o status). Os demais, se descumpridos, são "corrigir no próximo ciclo" (PA).

## 1. Tipos de solicitação

| Termo | Definição (PROP) |
|---|---|
| **Requisição de Serviço** (2.14) | Solicitação formal de um usuário para algo já disponível como parte do serviço padrão de TI, ou ainda não classificada. Registrada no GLPI. |
| **Requisição de Mudança** (2.15) | **Issue do GitLab** com as especificações da mudança. Classificada como padrão, emergencial ou normal. |
| **Requisição de Ajuda** (5.1) | Requisição de serviço que deve ter base de conhecimento suficiente para ser atendida no **primeiro nível**. |

## 2. Classificação da mudança

Toda mudança deve ser classificada **por um analista da unidade de tecnologia** (4.6).

| Classe | Definição | Autorização |
|---|---|---|
| **Padrão** (2.16) | Baixo risco, procedimento estabelecido, facilmente automatizável. Ex.: correções e atualizações que incrementam só o **Patch** do versionamento semântico. | **Pré-autorizada.** O Técnico define o melhor momento de implementar (5.3.8). |
| **Emergência** (2.17) | Alteração não planejada, a implementar imediatamente para mitigar impacto de situação crítica (erro recém-descoberto, instabilidade, prejuízo ao Sebrae MS ou clientes). **Solicitação da diretoria ou de gerente de um Titular pode tornar qualquer situação emergencial.** | Implementar **imediatamente** (5.3.4). Deliberação pelo Técnico ou seu gerente (5.3.3). |
| **Normal** (2.18) | Tudo que não é padrão nem emergência. Não pré-autorizada, sem a urgência da emergência. | Contexto de negócio: **Titulares** deliberam (5.3.2). Contexto de TI: **Técnico ou seu gerente** (5.3.3). |

**Checklist: classificação da mudança**

- [ ] **(B)** Coerente com o versionamento: padrão só para mudança que incrementa apenas o Patch; Minor ou Major é normal ou emergência.
- [ ] Emergência descreve a situação crítica ou o pedido da diretoria ou de gerente de Titular.
- [ ] Feita por analista da unidade de tecnologia; se quem gera o artefato não souber, fica como pendência, sem chutar.

## 3. Formação do backlog (5.3)

1. O Solicitante que quer melhorar um sistema registra formalmente uma requisição de mudança, especificando com clareza o que deseja, seguindo o PROP Gerir Central de Serviços (5.3.1).
2. Deliberação conforme a classe (tabela acima).
3. **Mudanças não deliberadas em 14 dias são reprovadas automaticamente** (5.3.5).
4. Mudanças reprovadas são **arquivadas definitivamente**; pode haver nova solicitação a qualquer momento (5.3.6).
5. Mudanças aprovadas **entram no backlog** (5.3.7).
6. Os **Titulares deliberam sobre a sequência** de implementação no backlog (5.3.9).

## 4. Conteúdo obrigatório da requisição de mudança (5.4 e 5.5)

**Checklist: issue / requisição de mudança**

- [ ] **(B)** Identificação do **sistema**.
- [ ] **(B)** Identificação do **Solicitante**.
- [ ] **(B)** **Contexto**: negócio ou sustentação.
- [ ] **(B)** **Classificação**: padrão, emergência ou normal (checklist da seção 2).
- [ ] **(B)** **Título**.
- [ ] **(B)** **Descrição** que explique **objetivamente o que deve ser entregue**.
- [ ] **(O)** Link do chamado GLPI de origem, quando houver (`https://servicos.ms.sebrae.com.br/front/ticket.form.php?id=<id>`).

A entrega é avaliada pelo Titular (e/ou com o Técnico) **com base no objetivo descrito** na requisição (5.5). Por isso uma descrição vaga impede a avaliação da entrega.

Durante o desenvolvimento, o Técnico faz a interlocução com os Titulares para entender o máximo possível do que deve ser entregue e esclarecer as dúvidas dos Trabalhadores (5.6).

## 5. Fluxo do processo (item 6)

| Nº | Ação | Responsável | Detalhe |
|---|---|---|---|
| 1 | Registro de chamado | Solicitante | Descrição mínima para os técnicos entenderem. O N1 auxilia se necessário. |
| 2 | Detalhamento do chamado | Técnico | Explica ao solicitante o fluxo do projeto e de aprovação; adiciona detalhes para os Titulares decidirem. |
| 3 | Encaminhamento para aprovação | Técnico | Para o Titular da aplicação. Em aplicação nova, o **solicitante se torna o Titular**. |
| Decisão | A solicitação será atendida? | Titular | Decide se a mudança será feita; em aplicação nova, valida se há real necessidade. Não → fim. |
| 4 | Encerramento do chamado e adição ao backlog | Técnico | **Encerra o chamado** e adiciona o item ao backlog do produto. |
| 5 | Ordenação do backlog | Titular | Ordena as atividades para encaminhamento aos técnicos. |
| 6 | Enriquecimento da especificação | Técnico | Enriquece a solicitação e o backlog para os trabalhadores. |
| 7 | Execução conforme especificação | Trabalhadores | Seguindo especificação e conformidades do Sebrae MS; recomendado pedir feedback ao Técnico e ao Titular. |
| Decisão | A entrega atende às conformidades? | Trabalhadores | Validação contra as conformidades exigidas e a documentação KCS. Não → volta ao 7. |
| 8 | Entrega para homologação | Trabalhadores | Envio para **sandbox** com **dados mínimos para teste** e documentação **KCS**. |
| 9 | Avaliação da entrega | Técnico | Valida a documentação KCS e as informações mínimas de teste. |
| Decisão | A validação foi satisfeita? | Técnico | Não → volta ao 7 **com prioridade**, podendo acarretar **não pagamento**. |
| 10 | Autorizar pagamento | Técnico | Quando há validação técnica do atendimento. |
| 11 | Validação funcional | Titular | Pode pedir ajustes finos que não alterem o escopo validado. O Técnico cobra o Titular em tempo hábil e leva ao gerente em caso de demora. |
| Decisão | A solicitação foi atendida? | Titular | Não (geralmente falha de regra de negócio na especificação) → volta ao backlog (5). |
| 12 | Entrega em produção | Técnico | Resolver conflitos gerados pelas mudanças, na plataforma GitLab. |

Ponto de atenção para validação: no passo 4, o **chamado GLPI é encerrado** quando a mudança entra no backlog. Chamado e issue têm ciclos de vida independentes; o chamado não fica aberto aguardando a implementação.

## 6. Normas de alçada (itens 4 e 5)

- Alteração de plano de ação, prazos de atendimento e recomendações de auditoria: aprovação de **Diretor**, pelo fluxo "Repactuar Plano de Ação" (4.1).
- Cada sistema tem **pelo menos um Titular**, de preferência da unidade de maior interesse (4.2); nomeado por gerente dessa área ou por empregados da unidade de tecnologia (4.4).
- Sempre há um **empregado da unidade de tecnologia** responsável pelas questões tecnológicas e interlocutor com a equipe; zela por **confiabilidade, consistência e estabilidade** (4.3).
- Fiscal e gestor do contrato gerenciam o consumo financeiro (4.5).
- O usuário é responsável por buscar o conhecimento para usar o sistema adequadamente, com apoio dos Titulares e do Técnico (4.7).
- Tudo alinhado às políticas de Segurança da Informação e Comunicação do Sebrae MS (4.8) e à conformidade regulatória (LGPD, ISO/IEC 27001/27002) (2.11).

## Lacunas e ambiguidades

- O PROP Gerir Central de Serviços, citado em 5.1 e 5.3.1, não faz parte dos documentos disponíveis.
- O prazo de **14 dias** (5.3.5) não diz se são dias corridos ou úteis.
- Não há definição de quem classifica quando não há analista de TI disponível, nem de como registrar a classificação na issue (label, campo, texto).
- A requisição de mudança é uma issue do GitLab, mas o fluxo começa com um chamado GLPI; o PROP não define o formato do vínculo entre os dois (ver 5.10 em [entrega-aceite.md](entrega-aceite.md)).
