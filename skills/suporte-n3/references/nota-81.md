# Processo: nota tipo 81 (fechamento do chamado)

Usado quando a causa raiz está confirmada e a solução foi aplicada, ou quando ficou claro que não há solução imediata. Encerra o atendimento e produz **duas notas**: a nota tipo 81 (interna, com as informações de fechamento) e a nota de resolução (para o cliente). Nunca acontece na mesma sessão que uma [nota tipo 20](nota-20.md).

## 1. Classificar a solução

- **Definitiva**: o que causou o problema foi eliminado e não volta a acontecer sem uma nova causa (ex.: dado corrigido cuja origem era um erro de digitação, configuração ajustada, orientação de uso quando o sistema funcionava como deveria).
- **Não definitiva**: o defeito no sistema continua existindo. Dois casos:
  - **Solução de contorno aplicada**: o chamado é fechado, com o tipo de solução **"Solução de contorno"**, sem esperar a correção da issue.
  - **Sem solução imediata**: o analista decide. Ele pode fechar o chamado aqui (e decide o tipo de solução e o que comunicar ao cliente) ou deixar o atendimento pendente com uma [nota tipo 20](nota-20.md), por exemplo aguardando o time de desenvolvimento. Nesse segundo caso, este processo não é executado nesta sessão.

Na dúvida, pergunte ao analista. Se a solução não for definitiva, faça o passo 2 antes de redigir as notas, porque a nota tipo 81 precisa citar a issue.

## 2. Issue (somente quando a solução não for definitiva)

Sempre que a solução não for definitiva, o sistema precisa de ajuste, então precisa existir uma issue para o time de desenvolvimento. Chamado e issue são independentes e têm ciclos de vida distintos: os links entre eles servem só para rastreabilidade, e o chamado fecha agora, sem esperar a issue. Não escreva em nenhum dos lados algo como "o chamado será fechado quando a issue for resolvida".

**Se o caso já tem issue** (o chamado é ocorrência de um caso já catalogado com issue aberta): não abra outra. Use a URL existente, mostre ao analista o impacto acumulado (quantos chamados esse erro já gerou, pelo campo `total_chamados` e pela seção "Chamados impactados") e pergunte se ele quer que você acrescente o link do novo chamado à issue (via `gitlab-toolkit`, editando a descrição e preservando o texto existente, por exemplo numa lista "Chamados relacionados"). É uma alteração na issue, então só faça com a confirmação dele. Se a issue do caso já estiver fechada e o erro voltou, não é mais uma ocorrência: avise que pode ser regressão ou correção incompleta e volte para a [investigação](investigacao.md) antes de fechar.

**Se não há issue**, crie com a skill `criar-issue`:
1. Confira se `criar-issue` está disponível na lista de skills do contexto atual. Se **não** estiver, avise o analista e rode via Bash `claude plugin marketplace update mrgenesis-skills` seguido de `claude plugin install criar-issue@mrgenesis-skills`. Isso não substitui `/reload-plugins`: se a skill ainda não aparecer, peça ao analista para rodar `/reload-plugins` na conversa.
2. Passe para a `criar-issue` o relato original do usuário (o sintoma de negócio, sem jargão) e a causa raiz técnica encontrada (arquivo, função e o que exatamente está errado), e peça que a issue traga o link do chamado de origem como link clicável em Markdown, por exemplo "Chamado de origem: [#<id_chamado>](https://servicos.ms.sebrae.com.br/front/ticket.form.php?id=<id_chamado>)". Ela pode perguntar ao analista o que faltar (prioridade, repositório de destino, onde publicar), isso é fluxo normal dela.
3. Antes de publicar, confira no texto final que o link do chamado está lá.
4. Com a issue publicada, guarde a URL dela (a `criar-issue`/`gitlab-toolkit` devolve a URL ao publicar). Se o analista preferir publicar por conta própria, peça a URL a ele e lembre-o de incluir o link do chamado na issue.

## 3. Redigir as duas notas

Gere os dois textos e mostre ao analista para revisar antes de salvar qualquer coisa.

**Nota tipo 81** (interna, sempre **privada**, flag "privado" habilitada): as informações de fechamento para o suporte e o desenvolvimento. Inclua, de forma objetiva:
- Causa raiz confirmada.
- O que foi feito para resolver e o tipo de solução (definitiva, "Solução de contorno" ou o que o analista decidiu).
- Se a solução não for definitiva: a URL completa da issue, para o sistema de chamados mostrar como link.
- A referência ao registro da base de conhecimento (`<id_chamado>-<slug>.md`, ou o registro do caso já catalogado).

**Nota de resolução** (para quem abriu o chamado): nenhuma informação técnica, nenhum nome de tabela, função, arquivo ou comando.
- Correção feita pelo suporte: uma frase em alto nível dizendo que o ajuste foi feito e que já está resolvido.
- Solução que o próprio usuário faz na tela: oriente-o a navegar até lá e fazer o ajuste, em linguagem simples, sem citar bastidores.
- Solução de contorno: diga que o problema foi contornado (e, se o contorno depende do usuário, como fazer) e, se o analista quiser, que uma melhoria definitiva foi encaminhada à equipe responsável, sem prometer prazo e sem citar a issue.
- Sem solução imediata: escreva conforme a decisão do analista.

## 4. Salvar na base de conhecimento

Depois que o analista aprovar as duas notas, escreva também a **instrução técnica detalhada**, o conhecimento reaproveitável para N1/N2/N3. Escreva como uma receita executável, para que na próxima vez não seja preciso investigar o código de novo: navegação em tela, comandos ou consultas prontos (de preferência somente leitura), um passo de confirmação rápido e seguro para validar que é este problema, o que aplicar para corrigir e os cuidados de produção. Se houver issue, descreva a solução de contorno e cite a issue só como referência.

Escolha o modo de gravação:

- **Caso novo**: gere o slug (minúsculo, sem acento, poucas palavras separadas por hífen) a partir do título e preencha `assets/template-caso.md` em `<projeto>/base-conhecimento/<id_chamado>-<slug>.md`, com `status: resolvido`, `data_resolucao`, `link_chamado`, `tipo_solucao` e, se houver, `issue`. O campo `tag` leva exatamente dois valores: `respostas-chamado` e o nome do sistema (a entrada DNS da URL). Registre o próprio chamado como primeira linha de "Chamados impactados".
- **Chamado vindo de retomada**: atualize o mesmo arquivo `pendente` com os mesmos campos acima, condensando o "Andamento da investigação" num resumo do caminho percorrido, incluindo o que foi obtido nas notas tipo 20.
- **Reabertura** (o chamado já estava `resolvido` e voltou porque o usuário não aceitou a solução): atualize o registro do próprio chamado com a nova causa raiz, a nova solução e as novas notas, e registre no "Andamento da investigação" que houve reabertura, o que o usuário contestou e por que a solução anterior não bastou. Se o chamado estava apenas listado como ocorrência de outro caso e a nova análise mostrou que é outro problema, retire-o de `chamados_relacionados` e da tabela "Chamados impactados" daquele registro e crie o registro próprio como caso novo.
- **Ocorrência de caso já catalogado**: não crie arquivo novo. No registro existente, acrescente o `id_chamado` em `chamados_relacionados` e uma linha em "Chamados impactados" (link do chamado, data, tipo de solução e, se houver issue aberta, a issue). Se a solução precisou de ajuste, atualize a instrução técnica. Esse registro é o termômetro do erro: depois de atualizar, diga ao analista o total de chamados do caso e a data da primeira e da última ocorrência.

Em todos os modos, siga exatamente a estrutura de `assets/template-caso.md`, removendo os comentários de instrução (`<!-- ... -->`).

## 5. Entregar

Mostre no chat as duas notas separadas, prontas para o analista copiar para o sistema de chamados: a nota tipo 81 (privada) e a nota de resolução.
