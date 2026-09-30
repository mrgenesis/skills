# Apoio: investigar a causa raiz, um passo de cada vez

Não é um processo à parte: é como conduzir o atendimento entre o início (chamado novo ou [retomada](retomada.md)) e o encerramento da sessão, que é sempre uma [nota tipo 20](nota-20.md) ou uma [nota tipo 81](nota-81.md).

## Se o chamado é uma reabertura

O chamado estava `resolvido` e voltou porque o usuário não aceitou a solução. Refaça a análise considerando as novas informações que ele trouxe: use o registro anterior como contexto (o que foi testado, qual foi a causa e a solução), mas não parta do princípio de que aquela causa está certa. Se as novas informações contradizem a causa registrada, formule novas hipóteses normalmente.

## Se o chamado é de um caso já catalogado

Se o analista confirmou que o chamado é o mesmo problema de um registro existente, leia o arquivo completo e siga a "Instrução técnica detalhada" dele, um passo por vez e respeitando a [cautela de produção](cautela-producao.md). Não investigue o código de novo. Se só a solução precisar de ajuste, isso é atualizado no próprio registro no fechamento. Se o caso tem issue, pergunte ao analista se ela continua aberta: se foi fechada e o erro voltou, trate como possível regressão e investigue normalmente abaixo.

## Dependência: skill analisar-codebase

A investigação depende da `analisar-codebase` para qualquer rastreio de símbolo (função, classe, método) antes de basear um passo nisso: grep textual confunde comentário, string e função homônima em outro escopo com a definição real, e um passo baseado nisso pode mandar o analista olhar o lugar errado em produção.

1. Confira se `analisar-codebase` está disponível na lista de skills do contexto atual.
2. Se **não** estiver: avise o analista e rode via Bash `claude plugin marketplace update mrgenesis-skills` seguido de `claude plugin install analisar-codebase@mrgenesis-skills`. Isso não substitui `/reload-plugins`: se a skill ainda não aparecer, peça ao analista para rodar `/reload-plugins` na conversa (é um comando interativo, não é possível dispará-lo a partir daqui).
3. Sempre que precisar entender um arquivo desconhecido, ou localizar onde um símbolo é definido e usado, invoque a `analisar-codebase` (ferramenta Skill) em vez de grep manual.

## Um passo de cada vez

**Proponha um único passo por vez, e nunca avance para o próximo antes do analista informar o resultado do anterior.** Cada passo em produção pode ter efeito colateral, e o resultado de um passo é o que decide o próximo. Com uma lista de passos de uma vez, o analista pode rodar tudo em sequência sem que você veja o resultado intermediário, e se perde a chance de mudar de direção ou de frear antes de algo arriscado.

Para cada passo:
1. Formule uma hipótese com base no que já sabe (sintoma relatado + código + schema).
2. Descreva **um** procedimento concreto para testá-la: o que exatamente rodar, olhar ou clicar, e o que se espera em cada resultado possível. Siga sempre a [cautela de produção](cautela-producao.md).
3. Peça o resultado e espere.
4. Decida: hipótese confirmada, descartada (formule a próxima e repita) ou parcialmente confirmada (aprofunde na mesma direção).

Use o código e o schema para embasar cada passo:
- `analisar-codebase` para estrutura de arquivos e rastreio de símbolos.
- `scripts/listar-tabelas.js <caminho-para-db-schema.md>` para o nome exato de tabelas, colunas e chaves antes de sugerir uma consulta SQL. É uma extração best-effort por regex: se algo sair estranho no JSON, confira o bloco original em `db-schema.md`.

## Como a sessão termina

- **O atendimento precisa de uma troca formal e fica pendente** (informação ou autorização do cliente, ou comunicar ao cliente que se aguarda outra equipe): [nota tipo 20](nota-20.md).
- **Causa confirmada e solução aplicada, ou sem solução imediata**: [nota tipo 81](nota-81.md), que inclui a issue quando a solução não for definitiva.
