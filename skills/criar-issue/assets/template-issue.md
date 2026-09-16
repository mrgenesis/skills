## [titulo]
<!--
Instrução: Descrever a funcionalidade de forma objetiva, com verbo no infinitivo e foco no resultado esperado.

Exemplo: Visualizar contagem de presença em tempo real no evento
-->

## Contexto
<!--
Instrução: Em até 80 palavras, descreva o problema de negócio, quem sofre com ele e por que isso importa para a operação.

Exemplo: [Área/Perfil do usuário] precisa de [capacidade desejada] durante [situação operacional], porque hoje [problema atual] e isso impacta [decisão, tempo, qualidade, custo ou dependência]. 
-->
[Contexto]

## História de Usuário 
<!--
Instrução: Estruturar no formato clássico para explicitar ator, necessidade e valor de negócio. Esse formato é amplamente usado para capturar necessidade sem antecipar indevidamente a solução.

Exemplo: Como **[perfil do usuário]**, quero **[objetivo funcional]**, para **[benefício esperado]**. 
-->
[historia_usuario]

## Objetivo de negócio 
<!--
Explicar qual resultado operacional ou gerencial a funcionalidade deve produzir. 

Exemplo: Disponibilizar [informação/ação/capacidade] para [público ou processo], com o objetivo de [ganho esperado].
-->
[objetivo_negocio]

## Requisitos funcionais 
<!--
Os requisitos funcionais devem descrever o comportamento esperado do sistema de forma observável e verificável. Escreva como itens atômicos iniciados com “O sistema deve...”, ou algo que tenha esse sentido. 

Exemplo: 
- O sistema deve permitir [ação principal]. 
- O sistema deve exibir [dados, campos ou visão necessária]. 
- O sistema deve registrar [evento ou operação relevante]. 
- O sistema deve atualizar [dado ou estado] quando [gatilho]. 
- O sistema deve permitir [consulta, filtro, edição, exportação ou ação complementar]. 
- O sistema deve informar [mensagem, status ou alerta] quando [condição]. 
-->
- [requisitos_funcionais]

## Regras de negócio 
<!--
Regras de negócio representam políticas ou decisões do domínio; elas são diferentes do comportamento técnico do sistema e devem ser registradas separadamente para evitar confusão.

Exemplo: 
- [Entidade/regra] deve considerar [critério obrigatório].
- [Processo] deve seguir a prioridade [ordem de decisão].
- [Evento] só pode ocorrer quando [condição]. 
- [Cálculo/contagem/consolidação] deve desconsiderar [duplicidade, exceção ou restrição]. 
- [Resultado] deve ser tratado como [preliminar, definitivo, pendente, aprovado, recusado]. 
-->
- [regras_negocio]

## Critérios de aceite 
<!--
Critérios de aceite devem traduzir o comportamento esperado em condições testáveis. O formato Given/When/Then é uma prática comum porque facilita entendimento entre negócio, desenvolvimento e QA. 

Exemplo:
- Dado que **[contexto inicial]**, quando **[ação do usuário ou evento do sistema]**, então **[resultado esperado]**. 
- Dado que **[cenário alternativo]**, quando **[ação]**, então **[comportamento esperado]**. 
- Dado que **[erro, exceção ou duplicidade]**, quando **[processamento ocorrer]**, então **[tratamento esperado]**. 
-->
- [criterios_aceite]

