# Tema: papéis e glossário

Fonte: PROP 2.4.3.1 (v1, 25/08/2026), item 2 (glossário) e item 4 (normas de alçada). Use para conferir se uma skill ou artefato atribui cada responsabilidade ao papel certo.

## Papéis

| Papel | Quem é | Responsabilidades no processo |
|---|---|---|
| **Usuário** (2.19) | Toda pessoa que acessa um sistema. | Buscar o conhecimento necessário para usar o sistema adequadamente (4.7). |
| **Solicitante** (2.20) | Quem cria uma requisição de serviço. | Registrar o chamado com descrição mínima (passo 1); registrar formalmente a requisição de mudança (5.3.1). Em aplicação nova, torna-se o Titular (passo 3). |
| **Titular** (2.21) | Empregado do Sebrae MS da unidade de maior interesse no sistema/módulo. Nomeado por gerente dessa unidade ou por empregados da unidade de tecnologia. | Deliberar mudanças normais de negócio (5.3.2); decidir se a solicitação será atendida; ordenar o backlog (5.3.9, passo 5); validação funcional (passo 11); avaliar a entrega com base no objetivo da requisição (5.5). Todo sistema tem pelo menos um (4.2). |
| **Técnico** (2.22) | Empregado da unidade de tecnologia, responsável de tecnologia do sistema/módulo, nomeado pelo gerente de tecnologia. | Detalhar o chamado e encaminhar ao Titular (passos 2 e 3); deliberar mudanças de TI (5.3.3); decidir quando implementar mudança padrão (5.3.8); encerrar o chamado e adicionar ao backlog (passo 4); enriquecer a especificação (passo 6); interlocução com Titulares (5.6); avaliar a entrega e autorizar pagamento (passos 9 e 10); cobrar a validação do Titular; entregar em produção (passo 12). |
| **Trabalhadores** (2.23) | Quem efetivamente executa as atividades do backlog: colaboradores ou terceiros, incluindo Solicitante, Titulares e Técnicos. | Executar conforme a especificação (passo 7); validar contra as conformidades exigidas e o KCS; entregar no sandbox com dados mínimos e KCS (passo 8). |
| **Analista da unidade de tecnologia** (4.6) | | Classificar toda mudança como padrão, emergência ou normal. |
| **Diretor** (4.1) | | Aprovar alteração de plano de ação, prazos de atendimento e recomendações de auditoria. |
| **Fiscal e gestor do contrato** (4.5) | | Gerenciar o consumo financeiro do contrato. |
| **PO e QA** (Anexo III) | | Validar as funcionalidades integradas na branch/ambiente `hml`. |
| **Líder do projeto** (Anexo III) | | Conversar com o desenvolvedor quando o código não passa na revisão; participar da resolução de conflitos no MR. |
| **N1** (Anexo II) | Primeiro nível de atendimento. | Recebe incidentes sem resposta do usuário por mais de 2 dias úteis e contata o usuário pessoalmente ou via Teams. |

## Glossário

| Termo | Definição |
|---|---|
| Backlog | Lista de todas as atividades a realizar; dinâmica, pode mudar totalmente ao longo do tempo. |
| Ciclo de execução | Período de até 30 dias em que se pactua a entrega de parte do backlog. |
| Conformidade regulatória | Atendimento às normas internas e externas aplicáveis (LGPD, ISO/IEC 27001/27002). |
| Deploy | Disponibilização da solução para uso. |
| Entrega | Parte ou todo do projeto concluído, minimamente observável e com valor para o Sebrae MS. |
| Git | Software que orquestra o versionamento do código-fonte. |
| GitLab | Plataforma corporativa de gestão do ciclo de vida de desenvolvimento. |
| GLPI | Sistema de gestão de chamados (registrar, acompanhar e fechar solicitações). |
| Issue | Canal no GitLab para rastrear bugs, melhorias, dúvidas ou funcionalidades. |
| KCS | Base de conhecimento de entregas, incidentes e problemas resolvidos. |
| Servidor | Computador especializado para rodar os sistemas. |
| Versionamento do código-fonte | Registro e gerenciamento de todas as mudanças de um projeto ao longo do tempo. |
| Versionamento semântico | Major.Minor.Patch (ver [git-repositorio.md](git-repositorio.md)). |

## O que validar

- Uma skill que faz o Técnico ou a IA decidir prioridade de backlog contraria 5.3.9 (é do Titular).
- Uma skill que deixa o desenvolvedor classificar a mudança contraria 4.6 (é de analista da unidade de tecnologia).
- Uma skill que trata a aprovação funcional como feita só pelo Técnico ignora o passo 11 (Titular).

## Lacunas e ambiguidades

- "Analista da unidade de tecnologia" (4.6) e "Técnico" (2.22) podem ou não ser a mesma pessoa; o PROP não diz.
- "PO", "QA" e "líder do projeto" aparecem só no Anexo III e não estão no glossário do PROP.
