# Tema: suporte no GLPI

Fonte: Anexo II do PROP 2.4.3.1, "Regras para atender chamados no GLPI" (documento "GLPI - Instruções sobre chamados"). O PROP, no item 5.7.2, define esse procedimento como **obrigatório** para registro, acompanhamento e fechamento de chamados e para a documentação de entregas, incidentes e problemas resolvidos (KCS integrado ao GLPI).

Link de um chamado: `https://servicos.ms.sebrae.com.br/front/ticket.form.php?id=<id_chamado>`.

Nos checklists, **(B)** marca item bloqueante (leva a NA) e **(O)** marca recomendação que não é regra escrita (vira observação, sem afetar o status). Os demais, se descumpridos, são "corrigir no próximo ciclo" (PA).

## 1. Classificação do chamado (menu do lado direito)

| Campo | Regra |
|---|---|
| **Tipo** | **Incidente**: o usuário tenta usar um recurso do sistema e não consegue por uma falha de qualquer natureza. **Requisição**: tudo que não for incidente. |
| **Categoria** | O nome do sistema em questão. |

**Checklist: classificação do chamado**

- [ ] Tipo **Incidente** só quando o usuário não consegue usar um recurso por falha; pedido de funcionalidade, acesso ou informação é **Requisição**.
- [ ] Categoria com o nome do sistema em questão, nem genérica nem de outro sistema.
- [ ] Pedido de melhoria segue o fluxo do PROP: o Titular decide; aprovado, o chamado é encerrado e o item vai para o backlog ([gestao-mudancas.md](gestao-mudancas.md)).

## 2. Botões permitidos

Só estes botões podem ser usados; os demais devem ser desconsiderados:

**Responder**, **Tarefa**, **Solução**, **Documento**, **Validação**, **Escalar**.

O documento explica Tarefa, Solução, Validação e Escalar. Responder e Documento aparecem como permitidos, mas sem instrução de uso (ver lacunas).

## 3. Tarefa

Campos da tarefa:

| # | Campo | Regra |
|---|---|---|
| 1 | **Descrição** | Escrita com clareza, com anexos quando apropriado. Deve dar feedback sobre o que está sendo realizado (ex.: "foi aberto um chamado na UTIC NA para corrigir uma falha no RM (chamado 123)"). Quando for a solução, explica **tecnicamente** como o problema foi resolvido (ex.: "o campo foi atualizado via banco com `UPDATE tb SET campo = 1 WHERE id = 100`"; ou "foi aplicada uma melhoria que prevê...", usando o mesmo texto do commit e **com o link do commit**). |
| 2 | **Categoria da tarefa** (obrigatória) | **20** ou **81**, ver abaixo. |
| 3 | **Status** | Na maioria dos casos, "Feito". "A fazer" só para tarefas agendadas. |
| 4 | **Privado** | Vem ativado por padrão (nota privada, só técnicos veem). Desative quando o requerente precisa ver o conteúdo. |
| 5 | **Salvar** (em base de conhecimento) | **Não mexer por enquanto**; instruções virão depois. |
| 6 | **Duração** | Horas gastas na atividade. |
| 7 | **Usuário** | Quem realizou a tarefa. |
| 8 | **Grupo** | Grupo de usuário que realizou a tarefa. |

### Categoria 20: Atualização e Coleta de Informações

- **Finalidade**: solicitar mais informações (ao usuário ou a outras equipes) e dar feedback sobre o status atual do que está sendo realizado.
- Exemplos: "Preciso do nome do sistema que está tendo dificuldade e a descrição da mensagem de erro, caso haja."; "Solicitamos apoio do fornecedor proprietário da API (chamado 123) para nos explicar mais detalhes sobre o erro, visto que a implementação atende a todos os requisitos da documentação."
- **Prazos sem resposta do usuário**:
  - **Requisição**: encerrar o chamado se o usuário demorar **mais de 5 dias úteis** para responder.
  - **Incidente**: mover o chamado para o **N1** se o usuário demorar **mais de 2 dias úteis** para responder. O N1 deve contatá-lo pessoalmente ou via Teams.
- O público da 20 define a flag "privado" (campo 4): dirigida ao **requerente**, privado **desativado** para ele ver e ser notificado; dirigida a **outra equipe ou fornecedor** (como no exemplo 2), o conteúdo é interno e o privado deve ficar **ativado**. Uma skill que manda a 20 "sempre" com privado desativado expõe ao requerente a comunicação interna.

**Checklist: tarefa categoria 20**

- [ ] Criada pelo botão **Tarefa**, categoria **20 - Atualização e Coleta de Informações**.
- [ ] Finalidade é pedir informação (ao usuário ou a outra equipe) ou dar feedback de andamento.
- [ ] **(B)** Privado coerente com o público: **desativado** para o requerente; **ativado** para outra equipe ou fornecedor.
- [ ] Dirigida ao requerente: linguagem simples, sem tabela, função, arquivo, comando ou SQL; perguntas numeradas, objetivas, tudo de uma vez.
- [ ] Status "Feito"; Duração, Usuário e Grupo preenchidos; não mexer em "Salvar".
- [ ] Prazo considerado para falta de resposta: requisição encerrada após 5 dias úteis; incidente vai para o N1 após 2 dias úteis.

### Categoria 81: Instrução técnica detalhada sobre como o chamado foi resolvido

- **Finalidade**: gerar base de conhecimento para resolver esses casos mais rapidamente no futuro.
- Conteúdo **técnico** (o que foi alterado, SQL executado, link do commit).
- **Não precisa ser criada** quando a informação é só de interesse do usuário (não técnica).
- Por ser registro técnico interno, faz sentido mantê-la privada (o documento não diz isso explicitamente para a 81; ver lacunas).

**Checklist: tarefa categoria 81**

- [ ] Criada pelo botão **Tarefa**, categoria **81**.
- [ ] **(B)** Conteúdo técnico suficiente para repetir a solução: causa, o que foi feito, SQL ou comando exato, passos de navegação.
- [ ] Link do commit quando houve alteração de código (o texto do commit serve de explicação).
- [ ] Link da issue quando a solução não for definitiva.
- [ ] Referência ao pedido de validação quando houve atividade com elevação.
- [ ] Privado **ativado**.
- [ ] Status "Feito"; Duração, Usuário e Grupo preenchidos; não mexer em "Salvar".

## 4. Solução (fechamento)

**O requerente recebe a mensagem da solução.** Por isso ela é escrita em linguagem simples, descrevendo em alto nível que a solicitação ou o problema foi atendido. A informação técnica fica na tarefa 81, nunca na solução.

Exemplo do documento:
- Tarefa 81: "O sistema não permitia que esse campo fosse vazio. Foi aplicada uma melhoria que prevê que na tabela `xyz` o campo `codigo` possa ser `NULL`. O link do commit é http://link_do_commit_na_master."
- Solução: "Retiramos a regra que restringe o campo vazio. Agora você pode salvar esse formulário sem preencher o campo."

### Tipos de solução (opções do GLPI, grupo "SEBRAE > UTIC - Unidade de Tecnologia")

| Tipo | Quando usar |
|---|---|
| **Chamado com solução de contorno** | Sempre que a atividade realizada **não for definitiva**. Ex.: update em banco de dados; montagem de requisição manual via Postman. |
| **Chamado sem solução** | Situações sem solução, especialmente quando não damos suporte àquele sistema. Ex.: usuário pede funcionalidade nova num sistema que é solução de mercado. |
| **Solucionado** | O problema foi corrigido **na raiz** e não existe possibilidade de reincidência. |

Erro comum a apontar: marcar "Solucionado" quando o que se fez foi um update em banco que corrige o dado mas não a causa (isso é solução de contorno).

### Pré-condições do GLPI para solucionar/fechar

O próprio GLPI bloqueia a solução quando:
- não há **técnico atribuído** ao chamado;
- existe tarefa com status **"a fazer"**.

**Checklist: solução do chamado**

- [ ] **(B)** Tipo coerente com o que foi feito: "Solucionado" só com correção na raiz; update em banco, requisição manual ou defeito ainda presente é "Chamado com solução de contorno"; sem solução possível é "Chamado sem solução".
- [ ] **(B)** Texto em linguagem simples e alto nível: nenhum SQL, tabela, coluna, função, arquivo, commit ou número de issue.
- [ ] Diz ao usuário o que mudou para ele ou o que ele deve fazer.
- [ ] **(O)** Contorno: não promete prazo de correção definitiva.
- [ ] Técnico atribuído e nenhuma tarefa "a fazer" no chamado.
- [ ] Tarefa 81 registrada antes, quando aplicável.

## 5. Validação

- Serve para **autorizar uma atividade que exige elevação**. Ex.: update em banco, dar permissão a usuários e similares.
- O gestor que aprova é, na maioria dos casos, **de fora da área de TI**. Por isso a descrição deve explicar com clareza, **em alto nível**, o que está sendo autorizado.
- Campos do pedido: Requerente, **Aprovador**, Comentários, anexos.

**Checklist: pedido de validação**

- [ ] **(B)** Pedido de **Validação** antes de qualquer atividade com elevação (escrita em banco de produção, concessão de permissão). Autorização do requerente por tarefa 20 não substitui.
- [ ] Aprovador definido.
- [ ] Texto claro e em alto nível sobre o que está sendo autorizado, compreensível por quem não é de TI.

## 6. Escalar

- Serve para **enviar o chamado para outro grupo com uma nota**.
- Campos obrigatórios: **Comentário** e **Grupo**. Opcional: "Atribua-me como observador".

**Checklist: escalonamento**

- [ ] Feito pelo botão **Escalar**, com **Grupo** de destino.
- [ ] **(B)** Comentário com o motivo e o que já foi feito ou verificado (o GLPI exige o campo, e sem isso o grupo de destino recomeça do zero).

## 7. Relação com o restante do processo

- O PROP (5.10) exige referências cruzadas entre o **ticket GLPI** e o **artigo KCS publicado**. Ver [entrega-aceite.md](entrega-aceite.md).
- Um commit que resolve um chamado pode citar o chamado no corpo (ex.: "Chamado 2570", como no exemplo do Anexo III). Ver [git-repositorio.md](git-repositorio.md).
- O PROP (5.1) diz que, quando uma requisição de serviço for uma **requisição de ajuda**, deve existir base de conhecimento suficiente para atendê-la no **primeiro nível** (processo Gerir Central de Serviços).

## Lacunas e ambiguidades

- **Responder** e **Documento** estão entre os botões permitidos, mas o documento não explica quando usá-los.
- O texto sobre **Validação** está truncado no documento ("Se for o gestor de TI ou um analista técnico que for fazer..."): não se sabe a regra quando o aprovador é técnico.
- **Salvar em base de conhecimento** (campo 5 da tarefa): "não mexe nisso ainda"; instruções futuras.
- A flag "privado" da **tarefa 81** não é definida explicitamente; o documento só diz que o padrão é privado e que a solução é o que o requerente recebe.
- Nomenclatura: o documento chama a categoria 20 de "Atualização e Coleta de Informações"; o nome exato exibido no GLPI pode variar levemente. Aponte divergência apenas se puder levar à escolha errada.
- O documento não diz se uma atualização em banco autorizada pelo **cliente** (por nota 20) dispensa o pedido de **Validação**; pela regra, a atividade com elevação continua exigindo Validação.
