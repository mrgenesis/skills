const { executarGlab, executarGlabRaw } = require("./executar-glab");

/**
 * Endpoint da API do GitLab para o conteúdo bruto de um arquivo
 * (projects/:id/repository/files/:file_path/raw). repo e filePath são
 * url-encoded automaticamente, incluindo as barras internas (exigência da
 * API para o parâmetro file_path).
 */
function endpointArquivoRaw(repo, filePath, ref) {
  return `projects/${encodeURIComponent(repo)}/repository/files/${encodeURIComponent(
    filePath
  )}/raw?ref=${encodeURIComponent(ref)}`;
}

/**
 * Baixa o conteúdo bruto de um arquivo do repositório (sem gravar em disco,
 * quem chama decide onde e se grava). Retorna { ok: true, stdout: Buffer }
 * ou { ok: false, error }. Usado tanto por baixar-arquivo.js (um arquivo)
 * quanto por baixar-pasta.js (um arquivo por vez, para cada item listado).
 */
function baixarArquivoRaw(repo, filePath, ref) {
  return executarGlabRaw(["api", endpointArquivoRaw(repo, filePath, ref)], repo);
}

/**
 * Lista, recursivamente, todos os arquivos (type "blob", ou seja, exclui as
 * subpastas listadas como "tree") dentro de uma pasta de um repositório, via
 * endpoint "List repository tree" da API do GitLab, seguindo paginação
 * automaticamente (`--paginate`, que o `glab api` já agrega numa única lista
 * antes de imprimir).
 *
 * Cada item retornado inclui `path` com o caminho completo a partir da raiz
 * do repositório (não só o nome do arquivo), o que baixar-pasta.js usa para
 * recriar a mesma estrutura de pastas do repositório no destino local.
 *
 * Retorna { ok: true, itens: [{ path, name, type, ... }] } ou { ok: false, error }.
 */
function listarArquivosDaPasta(repo, pastaPath, ref) {
  const endpoint = `projects/${encodeURIComponent(repo)}/repository/tree?path=${encodeURIComponent(
    pastaPath
  )}&ref=${encodeURIComponent(ref)}&recursive=true&per_page=100`;

  const resultado = executarGlab(["api", endpoint, "--paginate"], repo);
  if (!resultado.ok) return { ok: false, error: resultado.error };

  let itens;
  try {
    itens = JSON.parse(resultado.stdout);
  } catch (erro) {
    return {
      ok: false,
      error: `resposta inesperada da API ao listar a pasta: ${erro.message}`,
    };
  }

  if (!Array.isArray(itens)) {
    return {
      ok: false,
      error: "resposta inesperada da API ao listar a pasta (esperava uma lista)",
    };
  }

  return { ok: true, itens: itens.filter((item) => item.type === "blob") };
}

module.exports = { endpointArquivoRaw, baixarArquivoRaw, listarArquivosDaPasta };
