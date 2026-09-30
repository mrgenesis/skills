---
id_chamado: "[id-do-chamado]"
link_chamado: "https://servicos.ms.sebrae.com.br/front/ticket.form.php?id=[id-do-chamado]"
slug: "[slug-curto-do-problema]"
titulo: "[Título curto e descritivo do problema]"
status: "[pendente | resolvido]"
tipo_solucao: "[tipo de solução usado ao fechar o chamado, ex.: Solução de contorno; vazio enquanto pendente]"
data_resolucao: "[YYYY-MM-DD, vazio enquanto status for pendente]"
sistemas: ["[nome-do-repositorio-ou-container-envolvido]"]
tag: ["respostas-chamado", "[nome-do-sistema, igual à entrada DNS da URL do sistema]"]
sintomas:
  - "[sintoma ou mensagem de erro exata, do jeito que o usuário ou o suporte N1/N2 descreveria]"
tags: ["[palavra-chave-para-busca]"]
causa_raiz: "[causa raiz resumida em uma frase, vazio enquanto não confirmada]"
issue: "[URL da issue no GitLab, se foi aberta uma, só para rastreabilidade; vazio caso contrário]"
chamados_relacionados: []
---

# [Título curto e descritivo do problema]

## Sintomas observados
<!--
Como reconhecer que um novo chamado é este mesmo problema: mensagens de erro exatas, em que tela aparecem, o que o usuário relata. Isso é o que o suporte N1 vai comparar primeiro.
-->

## Andamento da investigação
<!--
Obrigatório enquanto status for pendente: é o que permite retomar o atendimento em outra conversa sem refazer nada. Registre:
- Hipóteses já testadas, o passo executado para cada uma e o resultado exato informado pelo analista (confirmada, descartada, parcial).
- Hipótese atual.
- O texto da nota tipo 20, exatamente como foi enviado, com a data.
- O que ficou pendente e de quem (resposta ou autorização do cliente, retorno do time de desenvolvimento ou de outra área).
- O próximo passo ao retomar (para cada retorno possível, quando fizer diferença).
Quando o caso for resolvido, mantenha aqui um resumo curto do caminho percorrido (inclusive o que foi obtido em cada nota tipo 20) e apague o que não agrega para quem ler depois.
-->

## Causa raiz
<!--
Explicação técnica objetiva do que realmente causa o problema, não do sintoma. Pode citar arquivo/função/tabela envolvidos, para quem for N3 e quiser confirmar no código, mas isso é contexto, não é o passo a passo. Se foi aberta uma issue, cite o link dela aqui também.
-->

## Instrução técnica detalhada
<!--
Isto é o conhecimento reaproveitável para o suporte N1, N2 e N3 no próximo chamado igual a este. Escreva como uma receita executável, de forma que não seja necessário investigar código de novo:
- Passos de navegação em tela (menu, tela, campo) quando a causa ou a solução envolver a interface do sistema.
- Comandos ou consultas prontos para copiar (de preferência somente leitura) quando envolver acesso direto a banco ou servidor.
- Um passo de confirmação rápido e seguro, que qualquer nível de suporte consiga rodar, para validar que é este problema antes de agir.
- Como aplicar a correção, incluindo qualquer cuidado de produção (horário, impacto esperado, necessidade de acompanhar depois).
- Se o problema é um bug de código com issue aberta, descreva a solução de contorno que resolve o chamado hoje (se houver) e cite o link da issue só como referência. O chamado não espera a issue: um chamado novo igual a este deve ser resolvido pela solução de contorno, e quem quiser saber se o bug já foi corrigido consulta a issue.
-->

## Chamados impactados
<!--
Uma linha por chamado que teve este problema, começando pelo chamado original e acrescentando uma linha a cada nova ocorrência (nunca crie outro arquivo para o mesmo caso). É por aqui que o N3 mede o quanto o erro está impactando o sistema e os usuários. Se o chamado foi resolvido por solução de contorno enquanto a issue não é corrigida, cite a issue na coluna Observação.
-->
| Chamado | Data | Tipo de solução | Observação |
|---|---|---|---|
| [#[id-do-chamado]](https://servicos.ms.sebrae.com.br/front/ticket.form.php?id=[id-do-chamado]) | [YYYY-MM-DD] | [tipo_solucao] | [ex.: contornado, issue [URL da issue]] |

## Nota de resolução (exemplo)
<!--
Texto sem jargão técnico, no mesmo padrão da nota de resolução enviada ao usuário do chamado original. Serve de referência de tom para quem for escrever a nota de um chamado novo baseado neste caso.
-->
