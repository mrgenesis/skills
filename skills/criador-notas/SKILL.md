---
name: criador-notas
description: |
  Transforma texto bruto (transcrições de vídeo/podcast, artigos, anotações de aula, atas de reunião etc.) em uma única anotação destilada seguindo a metodologia "Criando um Segundo Cérebro" de Tiago Forte (o método CODE e a Sumarização Progressiva). Salva a anotação como um arquivo Markdown na pasta atual (ou em outro caminho indicado pelo usuário). Use quando o usuário quiser transformar uma transcrição ou artigo em uma anotação estruturada, pedir para "criar uma anotação", "resumir isso no formato segundo cérebro", "aplicar sumarização progressiva", ou invocar "/criador-notas".
---

# Criador de Notas (Segundo Cérebro)

Transforme o texto de entrada bruto em UMA anotação destilada seguindo o método CODE de Tiago Forte (Capturar, Organizar, Destilar, Expressar: resumo completo em [CODE.md](references/CODE.md)) e a Sumarização Progressiva, conforme descrito em *Criando um Segundo Cérebro*. O livro descreve um processo aplicado ao longo de visitas repetidas a uma anotação ao longo do tempo; aqui ele é comprimido em uma única passada sobre o texto fornecido. Escreva a anotação em português do Brasil (pt-BR), no idioma do livro e do usuário, independentemente do idioma original da entrada.

## Entrada

A entrada só pode vir de arquivos já presentes no diretório de trabalho atual (o mesmo ambiente de execução do Claude). Não aceite texto colado na conversa nem URLs.

1. Liste os arquivos do diretório atual, numerados. Exclua da listagem arquivos ocultos (iniciados com `.`).
2. Se não houver nenhum arquivo elegível, informe o usuário e pare. Peça para adicionar o(s) arquivo(s) ao diretório antes de tentar novamente.
3. Pergunte ao usuário qual(is) arquivo(s) deve(m) ser considerado(s), com uma opção por arquivo. Quando houver mais de um arquivo, adicione uma última opção "Todos os arquivos". A seleção é **múltipla**: o usuário pode escolher um único arquivo, uma combinação arbitrária (ex.: arquivos 1 e 3, ou 2, 7 e 9), ou "Todos os arquivos". Formato de referência:

   ```
   Selecione quais arquivos devem ser considerados:
   1. arquivo1.txt
   2. arquivo2.md
   3. arquivo3.srt
   4. Todos os arquivos
   ```

   Com até 3 arquivos elegíveis (+ a opção "Todos os arquivos" = no máximo 4 opções no total), use a ferramenta de pergunta ao usuário para essa seleção, com seleção múltipla habilitada (ela suporta no máximo 4 opções por pergunta). Com 4 ou mais arquivos elegíveis, esse limite é ultrapassado: nesse caso, liste os arquivos como texto simples numerado (mesmo formato acima) e peça ao usuário para responder em texto livre com o(s) número(s) desejado(s) (ex.: "1 e 3", "2, 7, 9") ou "todos", em vez de usar a ferramenta de seleção estruturada. Com apenas um arquivo elegível, ainda assim confirme com o usuário antes de prosseguir.
4. Leia o(s) arquivo(s) selecionado(s) POR COMPLETO antes de prosseguir: decidir o que repercute exige contexto completo, não uma leitura superficial.
5. Se mais de um arquivo for selecionado (seleção múltipla específica ou "Todos os arquivos"): trate-os sempre como **uma única fonte mesclada**: combine o conteúdo de todos os arquivos selecionados (em ordem) e aplique o restante do processo (Etapas 1-4) uma única vez sobre esse conteúdo combinado, gerando UMA única anotação. Antes de mesclar, pergunte ao usuário qual é a fonte desse conteúdo combinado (ex.: "Como você descreveria a fonte desses arquivos combinados?"). A resposta preenche o campo `**Fonte:**` do template (ver [TEMPLATE.md](assets/TEMPLATE.md)), já que os arquivos individuais podem não ter metadados unificados. Use a descrição de conteúdo dada pelo usuário nesse campo, nunca os nomes de arquivo (ex.: não "arquivo1.txt e arquivo3.srt", mas "Aula sobre X, partes 1 e 2"). A anotação final é autocontida e não deve referenciar nenhum arquivo da pasta (ver Regras de preenchimento em [TEMPLATE.md](assets/TEMPLATE.md)).

## Processo

As quatro etapas abaixo seguem o método CODE (ver [CODE.md](references/CODE.md) para o resumo completo de cada uma).

### Etapa 1 (Capturar): perguntar e selecionar o que repercutiu

*(ver [CODE.md → Capturar](references/CODE.md#capturar))*

Esta skill é usada por quem já consumiu o conteúdo (leu o artigo, assistiu ao vídeo, ouviu o podcast), não por alguém encontrando o material pela primeira vez através da IA. **Ressonância é um sinal pessoal**: só quem viveu o conteúdo sabe o que de fato o comoveu, surpreendeu ou chamou atenção. Por isso, antes de selecionar qualquer trecho, pergunte ao usuário.

Antes de formular a pergunta, verifique se o próprio conteúdo de origem já traz comentários (comentários de vídeo/postagem, respostas de chat, reações registradas em ata, anotações à margem etc.), sinais explícitos de que algo ali já chamou a atenção de alguém:

- **Se houver comentários candidatos:** em vez da pergunta aberta, liste-os como opções para o usuário escolher quais refletem o que repercutiu para ele, no mesmo formato de seleção usado para arquivos (ver Entrada, item 3): numerados, seleção múltipla, sempre com uma última opção "Nenhum destes / vou descrever com minhas próprias palavras" (a ressonância continua sendo pessoal; nunca presuma que um comentário de terceiro representa o que repercutiu para o usuário sem essa confirmação explícita). Use o texto literal de cada comentário como rótulo da opção (resumido se for muito longo). Se houver muitos comentários no conteúdo (ex.: dezenas de comentários de um vídeo/postagem), não liste todos: selecione os até ~8 mais relevantes (priorize os com mais engajamento/curtidas quando essa informação existir na fonte, ou os mais substantivos quando não existir) antes de aplicar o formato de seleção abaixo. Com até 3 comentários elegíveis (+ a opção "Nenhum destes" = no máximo 4 opções no total), use a ferramenta de pergunta ao usuário com seleção múltipla. Com 4 ou mais comentários elegíveis, esse limite é ultrapassado: liste-os como texto simples numerado e peça resposta livre com o(s) número(s) desejado(s) ou "nenhum", no mesmo padrão descrito em Entrada, item 3.
- **Caso contrário** (o conteúdo não traz comentários, ou o usuário escolheu "Nenhum destes"): faça a pergunta aberta. Exemplo:

  > "O que mais chamou sua atenção, surpreendeu ou repercutiu em você nesse conteúdo?"

Quando a entrada vier de múltiplos arquivos mesclados em uma única fonte (ver Entrada, item 5), faça essa verificação e a pergunta correspondente (seleção de comentários ou pergunta aberta) uma única vez sobre o conteúdo combinado. A resposta pode mencionar partes específicas de arquivos diferentes; use-a normalmente como critério primário sobre o conjunto mesclado.

Use a resposta do usuário como **critério primário** de captura:
- Localize no texto de origem os trechos que correspondem ao que o usuário apontou e priorize-os na seleção (Camada 1). Esses trechos também devem receber prioridade ao subir pelas camadas de negrito/destaque na Etapa 2.
- Se a resposta do usuário for vaga, parcial, ou ele não souber apontar algo específico ("não sei", "tudo"), trate isso como sinal insuficiente e complemente com o filtro secundário abaixo. Nunca invente uma resposta em nome do usuário.

Aplique os critérios do livro como **filtro secundário/complementar** (não substituto) para preencher lacunas ou capturar trechos adicionalmente relevantes que o usuário não tenha mencionado:
- Filtro secundário (o trecho qualifica se passar em pelo menos um): **inspira**, **é útil**, **é pessoal**, **é surpreendente** (segundo a definição de Shannon de informação: se só confirma o que você já sabia, não é informativo).
- Teto de volume: os trechos selecionados (resposta do usuário + filtro secundário) devem somar no máximo **~10% do tamanho do texto original**, regra de captura do livro (ver [CODE.md → Capturar](references/CODE.md#capturar)). Ser seletivo é o objetivo: não reproduza a fonte inteira. Não confundir com o teto de 10-20% da Etapa 2: aquele se aplica à razão entre camadas de destilação, este ao volume total capturado da fonte.
- Nunca inclua literalmente: senhas, credenciais ou dados pessoais confidenciais/sensíveis (saúde, identificadores financeiros) presentes na fonte. Omita ou redija esses trechos mesmo que passem no filtro de ressonância.

Resultado desta etapa: um conjunto de trechos literais (Camada 1: "solo", segundo a metáfora de mineração do livro), com prioridade para o que o usuário indicou.

### Etapa 2 (Destilar): aplicar a Sumarização Progressiva

*(ver [CODE.md → Destilar](references/CODE.md#destilar))*

Aplique camadas sobre os trechos selecionados, cada camada limitada a aproximadamente 10-20% do volume da camada anterior:
- **Camada 2 (negrito, "petróleo")**: destaque em **negrito** as frases-chave de cada trecho que carregam seu argumento central.
- **Camada 3 (destaque, "ouro")**: dentro do que está em negrito, envolva o fragmento mais essencial de cada trecho (raramente mais que 1-2 por anotação) com marcadores `==destaque==`.
- **Camada 4 (resumo executivo, "joias")**: escreva um resumo curto em tópicos, com SUAS PRÓPRIAS palavras (não copiado da fonte), no topo da anotação. Essa camada precisa fazer a anotação passar no **teste dos 30 segundos**: o título + esse resumo devem transmitir a essência em menos de 30 segundos, sem necessidade de ler o restante.

O livro reserva as Camadas 2-4 apenas para quando a nota está sendo preparada para uso, e a Camada 4 especificamente só para notas excepcionalmente valiosas, revisitadas com frequência (ver [CODE.md → Destilar](references/CODE.md#destilar)). Nesta skill essas duas condições já estão satisfeitas por definição: gerar a anotação É o momento de uso (Etapa 4, Expressar) e é a única passagem que essa nota terá pelo processo. Por isso as Camadas 2-4 são sempre aplicadas por completo em toda anotação, ajustadas apenas para entradas curtas (ver regras em [TEMPLATE.md](assets/TEMPLATE.md)).

### Etapa 3 (Organizar): título e sugestão PARA

*(ver [CODE.md → Organizar](references/CODE.md#organizar))*

- Escreva um título específico e sucinto (H1) que diga do que a anotação realmente trata, nunca genérico (ex.: não "Notas da reunião", mas "Decisões de precificação da reunião sobre X").
- Sugira uma categoria PARA para a anotação (**Projeto**, **Área** ou **Recurso**: Arquivo não se aplica a uma anotação recém-criada) com justificativa em uma frase, seguindo a ordem de decisão do livro: serve a um projeto ativo? → a uma área de responsabilidade contínua? → é referência geral?. Essa é apenas uma linha informativa dentro da anotação (metadado de contexto). **Ela nunca influencia onde o arquivo é salvo**. Não crie nem mova pastas com base nela. O local de gravação é decidido exclusivamente pela seção Saída abaixo, que depende só de onde o chamador está e do que ele eventualmente pedir.

### Etapa 4 (Expressar): montar a anotação

*(ver [CODE.md → Expressar](references/CODE.md#expressar))*

Monte a anotação seguindo exatamente a estrutura e as regras de preenchimento definidas em [TEMPLATE.md](assets/TEMPLATE.md).

## Saída: salvar o arquivo

- Nome do arquivo: `anotacao_<assunto-em-ate-20-letras>.md`
  - `<assunto>` é um slug derivado do título H1, com no máximo 20 letras: minúsculas, sem acentos, espaços viram hífens, sem caracteres especiais.
- Local: a pasta corrente (o diretório de trabalho de onde o chamador invocou a skill), a menos que o chamador indique explicitamente outro caminho, caso em que a anotação deve ser salva nesse caminho indicado. Nunca use um vault fixo ou qualquer outro local por padrão. A sugestão PARA da Etapa 3 é puramente informativa e não deve, em hipótese alguma, ser usada para decidir ou alterar esse local.
- Se já existir um arquivo com esse nome exato, acrescente `_2`, `_3` etc. em vez de sobrescrever.
- **Não pergunte ao usuário o nome do arquivo nem a pasta de destino antes de salvar**: ambos são determinados automaticamente pelas regras acima. Só use um caminho diferente da pasta corrente se o usuário já o tiver indicado espontaneamente (sem que a skill precise perguntar).
- Após salvar, confirme o caminho ao usuário e mostre o título + Resumo executivo inline como prévia rápida.
- Mesmo quando a entrada vier de múltiplos arquivos mesclados (ver Entrada, item 5), o resultado é sempre UM único arquivo de anotação.

## Casos de borda

- **Entrada muito longa (livro inteiro / transcrição de várias horas):** ainda assim, leia por completo. Se mesmo ~10% de uma fonte muito longa ainda deixar a anotação difícil de navegar, capture menos que isso e aposte mais nas Camadas 3-4 para manter a anotação navegável.
- **Múltiplos temas não relacionados na fonte (de um único arquivo ou de arquivos mesclados):** mesmo assim, gere uma única anotação (ver Entrada, item 5: a mesclagem é sempre tratada como uma fonte só). Para preservar a legibilidade, organize a seção `Notas destiladas` do [TEMPLATE.md](assets/TEMPLATE.md) com subtítulos por tema em vez de dividir em anotações separadas.
- **Entrada já bem condensada (ex.: um esboço em tópicos):** a Camada 1 pode acabar próxima de 100% da entrada; nesse caso, não force o teto de ~10% da Etapa 1, mas ainda assim aplique as Camadas 2-4 (essas mantêm seu próprio teto de 10-20% entre si).
