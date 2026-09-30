# Processo: retomar o atendimento

Usado quando `buscar-casos.js --id <id_chamado>` encontra o registro do chamado com `status: pendente`: uma sessão anterior terminou com uma [nota tipo 20](nota-20.md) e o atendimento ficou pendente.

A retomada simplesmente dá sequência ao atendimento anterior. Quem diz o que precisa ser feito é o registro: o que foi feito, o que ficou pendente e qual é o próximo passo. Pode ser que haja uma aprovação a considerar, uma informação que chegou, ou apenas a continuação com base no que já se sabe. Não presuma nada que não esteja no registro ou que o analista não tenha informado.

## Passos

1. Leia o arquivo inteiro do registro.
2. Resuma para o analista em poucas linhas onde o atendimento parou: o que já foi feito, o que ficou pendente e qual é o próximo passo registrado.
3. Se o próximo passo depende de algo que ficou pendente (uma resposta, uma aprovação, o retorno de outra equipe), pergunte ao analista o que chegou, e use exatamente o que ele informar. Se o analista já trouxe isso na primeira mensagem, não pergunte de novo.
4. Continue a partir do próximo passo registrado, seguindo a [investigação](investigacao.md) e a [cautela de produção](cautela-producao.md). Não refaça a busca por casos parecidos nem os passos já executados: os resultados deles estão no registro.
5. A sessão termina como qualquer outra: evolui para a [nota tipo 81](nota-81.md) ou regride para uma nova [nota tipo 20](nota-20.md). Nos dois casos, atualize o mesmo arquivo do registro em vez de criar outro.
