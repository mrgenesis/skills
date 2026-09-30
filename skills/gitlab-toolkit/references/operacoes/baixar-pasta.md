# Baixar uma pasta inteira de um repositório

Use `scripts/baixar-pasta.js` quando o usuário quiser todo o conteúdo de uma pasta (ex.: todas as ADRs em `docs/adrs`), não um arquivo específico: [baixar-arquivo.md](baixar-arquivo.md) retorna erro (404) se `--path` for uma pasta.

Uso:

```
node scripts/baixar-pasta.js --repo owner/projeto --path pasta/no/repo --output pasta/local [--ref branch-ou-tag-ou-commit]
```

`--repo`, `--path` e `--output` são obrigatórios, pelo mesmo motivo de `baixar-arquivo.js`. `--path` é a pasta dentro do repositório (ex.: `docs/adrs`), não um caminho local. `--ref` é opcional (padrão `HEAD`).

Baixa recursivamente todo arquivo dentro de `--path`, via API do GitLab: primeiro lista os arquivos (endpoint "List repository tree", com `--paginate`), depois baixa cada um (mesmo endpoint "Get raw file" de `baixar-arquivo.js`). Grava cada arquivo em `<output>/<caminho completo a partir da raiz do repositório>`, recriando a mesma estrutura de pastas do repositório dentro de `--output`, não só a parte relativa a `--path`. Ex.: `--path docs/adrs --output ./destino` produz `./destino/docs/adrs/0001-arquivo.md`, nunca `./destino/0001-arquivo.md`.

Formato da saída:

```jsonc
// sucesso (todos os arquivos baixados)
{ "ok": true, "action": "download-folder", "downloaded": 3, "total": 3, "files": [ { "path": "docs/adrs/0001.md", "ok": true, "localPath": "...", "bytes": 512 }, ... ] }
// falha parcial (alguns arquivos falharam, os outros já foram gravados)
{ "ok": false, "action": "download-folder", "downloaded": 2, "total": 3, "files": [ ..., { "path": "docs/adrs/0003.md", "ok": false, "error": "..." } ] }
// falha total (pasta vazia/não encontrada, ou erro ao listar)
{ "ok": false, "action": "download-folder", "error": "..." }
```

Em falha parcial, mostre ao usuário quais arquivos falharam (campo `error` de cada item em `files` com `ok: false`) e quais já foram baixados com sucesso, não repita o download dos que já deram certo.
