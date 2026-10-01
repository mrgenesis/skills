# Tema: gerenciamento de repositório Git/GitLab

Fonte: Anexo III do PROP 2.4.3.1, "Guia de Desenvolvimento com Git" (v1, 25/08/2026). Objetivo do guia: padronizar o versionamento entre todos os trabalhadores, garantindo colaboração eficiente e permitindo fluxos automatizados de teste e deploy. O PROP (5.8) diz que não conformidade com o Anexo III leva a entrega a **NA** ou **PA**.

Nos checklists, **(B)** marca item bloqueante (leva a NA) e **(O)** marca recomendação que não é regra escrita (vira observação, sem afetar o status). Os demais, se descumpridos, são "corrigir no próximo ciclo" (PA).

## 1. Iniciar o desenvolvimento

Sempre isolar as alterações da linha estável em uma branch nova, criada a partir da branch principal (normalmente `main`):

```bash
git switch main
git pull
git switch -c <nome-nova-branch>
git commit --allow-empty -m "cmd: track"
git push -u origin <nome-nova-branch>
```

- O commit vazio `cmd: track` serve para "limpar o HEAD" e permitir o primeiro push.
- O primeiro push com `-u` (track) existe para que depois baste `git pull` e `git push`, sem indicar origem e destino.

**Checklist: início do desenvolvimento**

- [ ] Branch nova criada a partir da `main` atualizada (`git switch main`, `git pull`, `git switch -c <branch>`).
- [ ] Primeiro push com track: commit vazio `cmd: track` e `git push -u origin <branch>`.

## 2. Branches permanentes

Todo projeto tem **3 branches fixas**:

| Branch | Função | Regra | Pipeline |
|---|---|---|---|
| `dev` | "Caldeirão" de integração | Onde todos os desenvolvedores juntam código. Instável por natureza. **Primeira branch a receber o MR** e rodar o pipeline. | Testes pesados e imagem de snapshot (`dev-latest`). |
| `hml` | Ambiente de homologação | Onde **PO e QA** validam as funcionalidades integradas. | Imagem candidata (ex.: `v1.0.0-rc.1`) e deploy automático em homologação. |
| `main` | Produção | **Ninguém faz commit direto.** Sempre por **MR vindo da `hml`**. | Tag de versão (ex.: `v1.0.0`) e imagem Docker final. |

Fluxo de promoção: `branch da issue` → MR para `dev` → `hml` → MR de `hml` para `main`.

**Checklist: branches e promoção**

- [ ] **(B)** Nenhum commit ou push direto em `main`, `hml` ou `dev`.
- [ ] **(B)** Promoção só por MR: branch da issue → `dev` → `hml` → `main`; para `main`, só MR vindo da `hml`.

## 3. Branches temporárias

- Branches com origem em uma issue (as de desenvolvimento) são **temporárias** e **apagadas após o MR final**.
- Ambiente temporário: o comando `up_temporary_app <N>h` no **corpo** de um commit enviado ao GitLab sobe um servidor temporário mantido por N horas (ex.: `up_temporary_app 24h`), para testes de integração em servidor real. No exemplo do guia aparece como linha `CMD: up_temporary_app 24h`.

**Checklist: branches temporárias**

- [ ] Branch da issue apagada após o MR final.
- [ ] **(O)** Ambiente temporário, se necessário: `CMD: up_temporary_app <N>h` no corpo de um commit.

## 4. Regras para os commits

### Gerais

- **Commits atômicos**: cada commit faz uma só coisa (corrigir um erro, adicionar uma função) e, de preferência, não quebra testes existentes.
- Escritos em **português**.
- Seguem **Conventional Commits**.
- **Título**: `<tipo>: <descrição>`, descrição clara e **no imperativo**, dizendo o que o commit faz quando aplicado. **Evitar que a descrição ultrapasse 50 caracteres** (o guia fala da descrição no título, isto é, o texto depois de `<tipo>: `).
- **Corpo** (opcional em commits comuns): texto claro e objetivo, **evitando ultrapassar 72 caracteres por linha**. Para escrever corpo, usar `git commit` sem `-m`.

### Tipos permitidos

| Tipo | Uso |
|---|---|
| `feat` | nova funcionalidade |
| `fix` | correção de bug |
| `chore` | tarefas menores |
| `refactor` | melhoria de código |
| `style` | estilo e/ou formatação |
| `test` | criação de testes |
| `docs` | documentação |
| `perf` | performance |

Exemplos do guia: `fix: impede e-mail vazio no cadastro do usuário`, `feat: adiciona autenticação m2f`.

Observação sobre "imperativo": os exemplos do guia usam a forma "adiciona", "impede" (o que o commit faz). Formas no particípio ou gerúndio ("adicionado", "corrigindo") e títulos em inglês ("add", "fix login") não seguem o guia.

O tipo `cmd` aparece apenas no commit técnico `cmd: track` do início do desenvolvimento; não é um tipo para commits de código.

**Checklist: mensagem de commit (confira com `scripts/validar-commit.js`)**

- [ ] **(B)** Título `<tipo>: <descrição>` com tipo entre os permitidos.
- [ ] **(B)** Em português.
- [ ] Descrição no imperativo, dizendo o que o commit faz, com até 50 caracteres.
- [ ] Linha em branco entre título e corpo; linhas do corpo com até 72 caracteres.
- [ ] Atômico: duas mudanças independentes viram dois commits.
- [ ] **(B)** Breaking change: `!` no título e `BREAKING CHANGE:` no corpo explicando o impacto.
- [ ] **(O)** Commit que atende chamado GLPI: linha `Chamado <id>` no corpo, como no exemplo do guia.

### Commit que conclui uma issue

Todo commit que conclui uma issue deve ter:

1. **Título igual ao título da issue.**
2. Se houver **breaking change** (algo antigo deixa de funcionar), **exclamação obrigatória** no título (ex.: `feat!: ...`).
3. **Corpo** descrevendo o commit.
4. No corpo, o comando que fecha a issue: **`Closes #<ID da issue>`**.

Exemplo do guia:

```
feat: Adiciona login com AMEI

Foi criada a parametrização com o AMEI para permitir o login unificado,
tendo sido criada a autorização da aplicação junto ao Sebrae NA.
Closes #17
Chamado 2570
CMD: up_temporary_app 24h
BREAKING CHANGE: O login antigo não funciona. Os usuários devem criar
conta com o AMEI. O sistema vinculará a conta AMEI com a antiga conta
usando o e-mail como chave.
```

Elementos que aparecem no exemplo e ajudam na rastreabilidade exigida pelo PROP (5.10): referência ao chamado GLPI (`Chamado <id>`) e, quando houver, `BREAKING CHANGE:` explicando o impacto.

**Checklist: commit que conclui issue (além do checklist anterior)**

- [ ] **(B)** Título igual ao título da issue (prevalece sobre forma verbal e limite de 50 caracteres).
- [ ] **(B)** Corpo descrevendo o commit, não só o rodapé.
- [ ] **(B)** `Closes #<ID da issue>` no corpo.
- [ ] Breaking change implica Major: a mudança não pode estar classificada como padrão ([gestao-mudancas.md](gestao-mudancas.md)).

## 5. Merge Request (MR)

- O MR é a unidade central de colaboração (revisão de código e discussão antes da integração).
- **Antes de criar o MR**: atualizar a branch com a `main` (pull da `main`, merge da `main` na branch) e **resolver todos os conflitos localmente**.
- Depois do commit que conclui a issue, enviar o push junto com a solicitação de MR:

  ```bash
  git push -o merge_request.create -o merge_request.target=<branch-alvo> -o merge_request.squash
  ```

- **Revisão**: quando o código não passa na validação, desenvolvedor e líder do projeto conversam e definem o próximo passo.
- **Conflitos na interface do MR**: resolvidos na presença dos autores do MR e do líder do projeto.
- **Mudanças pedidas pelos revisores**: **não abrir novo MR**; fazer as alterações e enviar commits para a **mesma branch**, que atualiza o MR automaticamente.
- O PROP (passo 12 do fluxo) reforça: antes da entrega em produção, resolver conflitos gerados pelas mudanças, na plataforma GitLab.

**Checklist: merge request**

- [ ] Branch atualizada com a `main` e conflitos resolvidos localmente antes do MR.
- [ ] **(B)** Primeiro MR com destino `dev`.
- [ ] Push com abertura do MR (`-o merge_request.create -o merge_request.target=<branch-alvo> -o merge_request.squash`).
- [ ] Ajustes da revisão na mesma branch, sem novo MR.

## 6. Versionamento semântico

Versão no padrão **Major.Minor.Patch** (Maior.Menor.Correção):

- **Patch (Correção)**: elimina um erro sem interferir no funcionamento correto da entrega.
- **Minor (Menor)**: adiciona funcionalidade sem corromper o que já funcionava.
- **Major (Maior)**: grande alteração que pode afetar o que já funcionava (ex.: remover funcionalidade).

Ligações com outros temas:
- Breaking change (`!` / `BREAKING CHANGE:`) implica incremento **Major**.
- O PROP (2.16) considera **mudança padrão** as correções e atualizações que incrementam só o **Patch**. Ver [gestao-mudancas.md](gestao-mudancas.md).
- Tags: `vX.Y.Z-rc.N` na `hml`, `vX.Y.Z` na `main`.

## Lacunas e ambiguidades

- O exemplo de commit de conclusão traz `BREAKING CHANGE:` no corpo **sem** `!` no título, embora a regra 2 exija a exclamação. Siga a regra (exija `!`) e mencione a inconsistência do exemplo se for relevante.
- O guia não define padrão de **nome de branch**.
- O guia não diz se **escopo** é permitido (`feat(auth): ...`). Conventional Commits admite; não aponte como erro.
- Maiúscula inicial na descrição: os exemplos variam (`fix: impede...` x `feat: Adiciona...`). Não aponte.
- O guia diz para atualizar a branch com a **`main`** antes do MR, mas o primeiro MR vai para a **`dev`**. Não está claro se o merge deve ser da `main` ou da `dev`; siga o texto (`main`) e registre como lacuna se o caso depender disso.
- O texto original diz "não evite ultrapassar 50 caracteres", claramente um erro de digitação para "evite ultrapassar". Por ser "evite", 50 e 72 caracteres são recomendações fortes, não bloqueios.
- O título do commit de conclusão deve ser igual ao da issue, que pode estar no infinitivo ("Permitir...") ou passar de 50 caracteres. Nesse caso a regra específica (título igual ao da issue) prevalece sobre a forma verbal e o limite; registre como observação, não como erro.
- O exemplo do guia menciona "link do commit na master", enquanto o guia usa `main` como branch de produção.
