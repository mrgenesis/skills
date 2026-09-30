# Baixar um arquivo específico de um repositório

Use `scripts/baixar-arquivo.js` quando o usuário quiser um único arquivo de dentro de um repositório GitLab (ex.: uma ADR, um trecho de documentação, um arquivo de configuração), sem precisar clonar o repositório inteiro.

Uso:

```
node scripts/baixar-arquivo.js --repo owner/projeto --path caminho/no/repo.md --output caminho/local.md [--ref branch-ou-tag-ou-commit]
```

`--repo`, `--path` e `--output` são obrigatórios: o repositório e o caminho do arquivo dentro dele fazem parte do escopo da conversa, nunca devem ser assumidos. `--path` é o caminho do arquivo dentro do repositório (ex.: `docs/adrs/0001-usar-postgres.md`), não um caminho local. `--ref` é opcional (padrão `HEAD`, a branch default do repositório); use para buscar o arquivo em uma branch, tag ou commit específico.

Baixa o arquivo via API do GitLab (endpoint "Get raw file"), sem precisar clonar o repositório. Grava o conteúdo exatamente como recebido (sem decodificar como texto), então funciona tanto para arquivos de texto quanto binários.

Formato da saída:

```jsonc
// sucesso
{ "ok": true, "action": "download", "localPath": "caminho/local.md", "bytes": 2048 }
// falha
{ "ok": false, "action": "download", "error": "..." }
```

Em caso de falha, mostre `error` ao usuário. Um erro comum é 404 (caminho ou `--ref` errado, ou token sem acesso ao projeto). Se `--path` for uma pasta em vez de um arquivo, a API retorna 404 aqui, use [baixar-pasta.md](baixar-pasta.md) para pastas.
