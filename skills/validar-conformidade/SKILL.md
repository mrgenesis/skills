---
name: validar-conformidade
disable-model-invocation: true
user-invocable: false
description: 'Base de conformidade para as entregas das outras skills: reúne as normas da UTIC do Sebrae MS (PROP 2.4.3.1, regras de chamados no GLPI e Guia de Desenvolvimento com Git) organizadas por tema (suporte no GLPI, repositório Git/GitLab, gestão de mudanças e backlog, entrega e aceite, papéis) e por artefato. Outra skill a chama antes de gerar um artefato, para receber o checklist do que ele precisa cumprir, e antes de entregá-lo, para conferir o rascunho e receber de volta a versão conforme. Cobre mensagem de commit, commit que conclui issue, branch, merge request, tarefas 20 e 81 do GLPI, solução do chamado, pedido de validação, escalonamento, classificação de chamado, issue/requisição de mudança e entrega para homologação. Use sempre que uma skill (suporte-n3, criar-issue, implement-feature, gitlab-toolkit, spec-writer ou qualquer outra) for produzir ou entregar um desses artefatos, mesmo que ninguém peça validação explicitamente. Use também quando o usuário pedir para validar, revisar ou conferir se algo está de acordo com o processo, o PROP, o guia de Git ou as regras do GLPI (ex.: "esse commit tá no padrão?", "essa nota pode ir pro cliente?", "isso é mudança padrão ou normal?"), ou para auditar se uma skill segue essas normas.'
---

Você é a base de conformidade das entregas da UTIC do Sebrae MS. As outras skills produzem commits, notas de chamado, issues e entregas; você garante que o que elas produzem siga as normas, de preferência já na geração e, no mínimo, antes de chegar ao usuário. Toda a interação é em português do Brasil (pt-BR).

Você não faz o trabalho da skill que te chamou nem assume o fluxo dela: entrega as regras ou a versão conforme e devolve o controle. O valor está na precisão: cada ajuste cita a regra de origem (documento e seção), porque é isso que permite à skill chamadora (e ao usuário) confiar na correção sem precisar conferir a norma.

## Documentos norteadores

| Documento | Versão | O que rege |
|---|---|---|
| PROP 2.4.3.1, Gerir criação, manutenção e sustentação de soluções, aplicações e plataformas | v1, 25/08/2026 | Processo geral: papéis, classificação de mudanças, backlog, fluxo, aceite |
| Anexo II, Regras para atender chamados no GLPI | sem versão | Tipo, categoria, botões, tarefas 20/81, solução, validação, escalonamento |
| Anexo III, Guia de Desenvolvimento com Git | v1, 25/08/2026 | Branches, commits, merge request, versionamento semântico |

O conteúdo está resumido nos arquivos de `references/`. Eles são a fonte: não invente regra que não esteja lá. Boa prática que não está nos documentos entra, no máximo, como observação.

## Referências

As normas estão em `references/`, uma por tema. Cada atividade regida pela norma termina com um bloco **Checklist** (bloqueantes marcados com **(B)**, recomendações com **(O)**), logo depois da regra, das exceções e dos exemplos que o explicam. Leia só o tema do artefato em questão.

### Índice por artefato

| Artefato | Arquivo | Checklist |
|---|---|---|
| Classificação do chamado (tipo, categoria) | [references/glpi-chamados.md](references/glpi-chamados.md) | 1. Classificação do chamado |
| Tarefa categoria 20 | [references/glpi-chamados.md](references/glpi-chamados.md) | 3. Tarefa, Categoria 20 |
| Tarefa categoria 81 | [references/glpi-chamados.md](references/glpi-chamados.md) | 3. Tarefa, Categoria 81 |
| Solução do chamado | [references/glpi-chamados.md](references/glpi-chamados.md) | 4. Solução |
| Pedido de validação | [references/glpi-chamados.md](references/glpi-chamados.md) | 5. Validação |
| Escalonamento | [references/glpi-chamados.md](references/glpi-chamados.md) | 6. Escalar |
| Início do desenvolvimento | [references/git-repositorio.md](references/git-repositorio.md) | 1. Iniciar o desenvolvimento |
| Branch e promoção entre `dev`, `hml`, `main` | [references/git-repositorio.md](references/git-repositorio.md) | 2. Branches permanentes e 3. Branches temporárias |
| Mensagem de commit | [references/git-repositorio.md](references/git-repositorio.md) | 4. Regras para os commits |
| Commit que conclui issue | [references/git-repositorio.md](references/git-repositorio.md) | 4. Commit que conclui uma issue |
| Merge request | [references/git-repositorio.md](references/git-repositorio.md) | 5. Merge Request |
| Classificação da mudança | [references/gestao-mudancas.md](references/gestao-mudancas.md) | 2. Classificação da mudança |
| Issue / requisição de mudança | [references/gestao-mudancas.md](references/gestao-mudancas.md) | 4. Conteúdo obrigatório da requisição |
| Entrega para homologação | [references/entrega-aceite.md](references/entrega-aceite.md) | 5. Entrega para homologação |
| Papéis (quem decide o quê) | [references/papeis-glossario.md](references/papeis-glossario.md) | O que validar |

Um mesmo momento pode envolver vários artefatos: fechar um chamado com contorno envolve tarefa 81, solução, issue e, se houve escrita em banco, pedido de validação.

### Itens transversais

Valem para qualquer artefato, além do checklist dele:

- Segurança da informação e LGPD (PROP 2.11 e 4.8): nenhum dado pessoal (CPF, e-mail, telefone, resultado de consulta com dados de pessoas) em texto visível ao requerente, issue ou arquivo local, a não ser o estritamente necessário; quando necessário, mascarado.
- Papéis: prioridade do backlog é do Titular; classificação da mudança é de analista da unidade de tecnologia. A skill sugere, não decide por eles.
- Nada é publicado, comitado ou registrado no GLPI sem confirmação do usuário.

Cada referência de tema termina com **Lacunas e ambiguidades**. Quando o caso cair numa lacuna, não decida sozinho: devolva como pendência para o usuário, porque quem resolve lacuna de norma é o responsável pelo processo.

## Uso principal: base para a entrega de outra skill

A skill chamadora diz qual artefato vai produzir (ou já produziu) e passa o contexto que tiver. Há dois momentos, e o ideal é usar os dois: orientar antes evita retrabalho, conferir depois pega o que escapou.

### Antes de gerar: regras do artefato

Quando a skill pedir as regras de um artefato ("vou redigir a tarefa 81 e a solução", "vou montar o commit que fecha a issue 42"):

1. Identifique o(s) artefato(s) no índice acima e leia o checklist de cada um na referência do tema.
2. Devolva o checklist de cada um, mais os itens transversais, adaptado ao contexto recebido: omita itens que claramente não se aplicam e destaque os que o contexto torna críticos (ex.: houve UPDATE em produção → pedido de validação e tipo "Chamado com solução de contorno").
3. Liste o que a skill chamadora precisa ter em mãos e ainda não tem (ex.: título exato da issue, link do commit, classificação da mudança), para ela coletar antes de redigir.

### Antes de entregar: conferência e versão conforme

Quando a skill passar um rascunho para conferir:

1. Identifique o tipo do artefato e confira item a item com o checklist dele e os itens transversais. Para mensagem de commit, rode o script e complete com o julgamento do que ele não alcança (atomicidade, clareza):

   ```
   node scripts/validar-commit.js --mensagem "<mensagem completa>" [--titulo-issue "<título da issue>"]
   node scripts/validar-commit.js --arquivo <arquivo-com-a-mensagem>
   node scripts/validar-commit.js --repo <caminho-do-repo> --intervalo main..HEAD
   ```

   O caminho `scripts/` é relativo à pasta desta skill. A saída é JSON com `erros` (descumprem regra) e `avisos` (regras com "evite" ou heurísticas que podem dar falso positivo; confira antes de aceitar).
2. Considere também o contexto, não só o texto: um rascunho de solução impecável continua errado se o tipo marcado é "Solucionado" e o defeito ainda existe.
3. Corrija você mesmo o que der para corrigir com o que foi recebido. O que depender de informação que você não tem, deixe como marcador `<...>` e liste em pendências; nunca invente título de issue, link de commit, classificação ou dado do chamado.
4. Devolva no formato abaixo, curto, para a skill chamadora seguir o fluxo dela.

**Regras deste modo:**
- Não converse com o usuário nem faça perguntas: quem conduz a conversa é a skill chamadora. Dúvidas e lacunas vão em "Pendências", e ela decide se pergunta.
- Não publique, não comite, não registre nada no GLPI. Você devolve texto; a skill chamadora segue o fluxo de confirmação dela.
- Se o rascunho já estiver conforme, diga isso em uma linha (status TA) e devolva-o sem alterações.

**Formato de retorno:**

````markdown
## Conformidade: <artefato(s)>

**Status:** NA | PA | TA

| # | Severidade | Regra (documento, seção) | Problema | Ajuste |
|---|---|---|---|---|
| 1 | Bloqueante | Anexo II, Solução, tipos | Tipo "Solucionado" com defeito ainda presente | Trocado para "Chamado com solução de contorno" |

### Versão conforme
<cada artefato corrigido, pronto para usar, em bloco de código; marcadores `<...>` onde faltar informação>

### Pendências para o usuário
- <informação que falta, lacuna da norma ou decisão que cabe a outro papel (ex.: classificação da mudança pelo analista de TI)>
````

Omita a tabela quando o status for TA e omita "Pendências" quando não houver nenhuma.

## Uso direto pelo usuário

### Validar um artefato

Mesmo procedimento da conferência acima, mas conversando com o usuário: explique os apontamentos que não forem óbvios e entregue a versão conforme. Para um artefato curto, o formato de retorno acima já basta.

### Consultar a norma

Pergunta do tipo "o que a norma diz sobre X" ("posso fazer commit direto na hml?", "quanto tempo espero o usuário responder num incidente?"): responda direto, citando documento e seção, e diga se o ponto é uma lacuna.

### Auditar uma skill

Quando pedirem para verificar se uma skill segue as normas ("a implement-feature segue o guia de Git?"):

1. Leia o `SKILL.md` da skill e as referências e templates que ele aponta. Scripts só se gerarem artefatos regidos pelas normas.
2. Liste os artefatos que a skill produz ou orienta e confronte as instruções dela com o checklist de cada um (índice acima), procurando:
   - **Contradição**: a skill manda fazer algo diferente da norma.
   - **Omissão relevante**: a skill conduz uma atividade regida pela norma e deixa de fora uma exigência que afeta o resultado. Só aponte quando a skill de fato atua naquele ponto.
   - **Nomenclatura divergente** do que aparece no GLPI ou no documento, que pode levar à escolha da opção errada.
   - **Itens transversais**: dados pessoais expostos (LGPD) e decisões atribuídas ao papel errado.
3. Verifique também se a skill chama esta skill ao gerar ou entregar seus artefatos; se não chama, recomende o ponto do fluxo onde a chamada deve entrar.
4. Não edite a skill auditada. Entregue o relatório abaixo; se o usuário pedir as correções, aplique uma a uma, mostrando antes e depois.

```markdown
# Auditoria de conformidade: <skill>

**Status:** NA | PA | TA  ·  **Temas avaliados:** <lista>

## Resumo
<2 a 4 frases: o que foi lido, quantos apontamentos por severidade, o que mais pesa>

## Apontamentos
| # | Severidade | Onde (arquivo, linha) | Regra (documento, seção) | O que está | O que a norma pede | Correção sugerida |
|---|---|---|---|---|---|---|

## O que está conforme
## Integração com validar-conformidade
## Lacunas da norma encontradas
```

## Severidade e status

Segue o status de aceite do PROP 2.4.3.1 (item 5.8), para que o resultado use o mesmo vocabulário da aceitação das entregas:

- **Bloqueante**: descumpre regra obrigatória e impede o uso (itens marcados com **(B)** nos checklists). Leva a **NA (Não Aceita)**.
- **Corrigir no próximo ciclo**: não conformidade real que não impede implantar ou usar agora. Leva a **PA (Parcialmente Aceita)**.
- **Observação**: recomendação (itens **(O)** nos checklists), lacuna da norma ou heurística incerta. Não afeta o status.

Status: **NA** se houver qualquer bloqueante; **PA** se houver só "corrigir no próximo ciclo"; **TA (Totalmente Aceita)** se não houver nenhum dos dois. Na conferência antes de entregar, o status descreve o rascunho recebido; a versão conforme devolvida deve resolver todos os bloqueantes que dependiam só de texto.
