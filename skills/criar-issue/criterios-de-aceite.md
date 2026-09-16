Critérios de aceite são condições claras, concisas e testáveis que uma história de usuário precisa satisfazer para ser considerada completa. Eles representam o resultado final desejado, não a forma de implementação.

- **História de usuário** articula o "porquê" (propósito e valor sob a perspectiva do usuário).
- **Critérios de aceite** definem "o que é sucesso" (condições explícitas e verificáveis).

Juntos, a história estabelece o contexto e os critérios de aceite fornecem os limites e detalhes necessários para validar que a funcionalidade atende à necessidade descrita.

## Características de bons critérios de aceite

- **Claros e concisos:** linguagem simples, sem ambiguidade, interpretável da mesma forma por qualquer parte interessada.
- **Testáveis:** cada critério deve se traduzir em pelo menos um teste executável que confirme objetivamente se foi atendido.
- **Focados no resultado:** descrevem o que o usuário deve experimentar, não os passos técnicos para construir a solução.
- **Mensuráveis:** sempre que possível, quantificados (ex.: "resolução mínima de 300x300 pixels" em vez de "boa aparência").
- **Independentes:** cada critério se sustenta sozinho; se um depende do outro para fazer sentido, provavelmente precisa ser reescrito.

## Como escrever

1. Parta da história de usuário relacionada.
2. Descreva o resultado esperado pelo usuário, evitando detalhes de implementação.
3. Garanta que cada critério seja testável e, quando possível, mensurável.
4. Escreva critérios independentes entre si.
5. Seja explícito: use exemplos e cenários alternativos (sucesso, erro, exceção, duplicidade) para eliminar ambiguidade.
6. Revise e refine conforme o entendimento evolui durante o refinamento.

Critério mal definido: "Os clientes devem conseguir pagar online."
Critério bem definido: "Dado que o cliente selecionou itens para comprar e informou um pagamento válido, quando confirma a compra, então recebe uma mensagem de confirmação e um recibo por e-mail imediatamente."

## Formato Given/When/Then (Gherkin)

O formato Given/When/Then (Dado/Quando/Então) é a prática mais comum para escrever critérios de aceite porque facilita o entendimento entre negócio, desenvolvimento e QA, e pode servir de base para testes automatizados.

```gherkin
Funcionalidade: Login do Usuário

  Cenário: Login bem-sucedido
    Dado que o usuário está na página de login
    Quando o usuário insere credenciais válidas
    E clica no botão de login
    Então o usuário deve ser redirecionado para o dashboard
    E o nome do usuário deve ser exibido

  Cenário: Login malsucedido com credenciais inválidas
    Dado que o usuário está na página de login
    Quando o usuário insere credenciais inválidas
    E clica no botão de login
    Então uma mensagem de erro deve ser exibida
    E o usuário deve permanecer na página de login
```

## Exemplos práticos

**História de usuário:** Como cliente, quero pesquisar produtos por nome para encontrar rapidamente os itens que procuro.

**Critérios de aceite:**
- Dado que o usuário informa o termo de busca, quando ele corresponde exatamente ao nome de um produto, então o sistema retorna esse produto.
- Dado que o usuário informa pelo menos três caracteres, quando não há correspondência exata, então o sistema retorna correspondências parciais.
- Dado que a busca não encontra nenhum produto, quando os resultados são exibidos, então o sistema mostra a mensagem "Nenhum resultado encontrado" com sugestões úteis.

**História de usuário:** Como usuário registrado, quero redefinir minha senha para recuperar o acesso à minha conta caso eu a esqueça.

**Critérios de aceite:**
- Dado que o usuário está na página de login, quando clica em "Esqueci minha senha", então é direcionado à página de redefinição.
- Dado que o usuário informa o e-mail cadastrado, quando envia o formulário, então recebe um e-mail com link de redefinição.
- Dado que o usuário define uma nova senha válida, quando confirma, então consegue fazer login com a nova senha.

## Erros comuns

- **Ambiguidade:** critérios vagos (ex.: "deve funcionar bem") levam a retrabalho e divergência sobre o que é "pronto".
- **Detalhar implementação em vez de comportamento:** critérios não devem prescrever como construir a solução, apenas o resultado esperado.
- **Critérios dependentes entre si:** dificultam o teste isolado e o diagnóstico de falhas.
- **Excesso de detalhe:** tentar cobrir cada caso possível resulta em critérios pesados e pouco úteis; priorize os cenários relevantes.

## Critérios de aceite x Definition of Done (DoD)

Critérios de aceite definem o que uma história de usuário específica precisa cumprir para estar completa. A DoD estabelece um padrão de qualidade mais amplo, aplicado a todo incremento de trabalho (ex.: código revisado, testado, documentado), independentemente da história. Ver também [dod-vs-dor.md](___Projetos/skills/skills/criar-issue/dod-vs-dor.md) para a diferença entre DoD e DoR.
