const { executarGlab } = require("./executar-glab");

/**
 * Endpoints da API do GitLab para uma issue existente (identificada pelo
 * IID, o número que aparece na URL, não o ID interno do GitLab).
 */
function endpointIssue(repo, iid) {
  return `projects/${encodeURIComponent(repo)}/issues/${encodeURIComponent(iid)}`;
}

function endpointNotasIssue(repo, iid) {
  return `projects/${encodeURIComponent(repo)}/issues/${encodeURIComponent(
    iid
  )}/notes?per_page=100&order_by=created_at&sort=asc`;
}

/**
 * Busca os dados de uma issue existente via endpoint "Single issue" da API
 * do GitLab. Retorna { ok: true, issue: {...} } com só os campos úteis para
 * quem consulta (não o objeto bruto da API, que tem dezenas de campos
 * internos), ou { ok: false, error }.
 */
function obterIssue(repo, iid) {
  const resultado = executarGlab(["api", endpointIssue(repo, iid)], repo);
  if (!resultado.ok) return { ok: false, error: resultado.error };

  let dados;
  try {
    dados = JSON.parse(resultado.stdout);
  } catch (erro) {
    return {
      ok: false,
      error: `resposta inesperada da API ao consultar a issue: ${erro.message}`,
    };
  }

  return {
    ok: true,
    issue: {
      iid: dados.iid,
      title: dados.title,
      description: dados.description,
      state: dados.state,
      webUrl: dados.web_url,
      labels: dados.labels || [],
      assignees: (dados.assignees || []).map((a) => a.username),
      author: dados.author ? dados.author.username : null,
      milestone: dados.milestone ? dados.milestone.title : null,
      createdAt: dados.created_at,
      updatedAt: dados.updated_at,
      closedAt: dados.closed_at,
      closedBy: dados.closed_by ? dados.closed_by.username : null,
    },
  };
}

/**
 * Lista as notas (comentários e eventos de sistema, ex.: mudança de label,
 * de milestone) de uma issue, via endpoint "List project issue notes",
 * seguindo paginação automaticamente (`--paginate`, que o `glab api` já
 * agrega numa única lista antes de imprimir). `system: true` marca uma nota
 * gerada pelo próprio GitLab (não escrita por uma pessoa), quem chama decide
 * se quer filtrar essas ou não.
 */
function listarNotasIssue(repo, iid) {
  const resultado = executarGlab(["api", endpointNotasIssue(repo, iid), "--paginate"], repo);
  if (!resultado.ok) return { ok: false, error: resultado.error };

  let dados;
  try {
    dados = JSON.parse(resultado.stdout);
  } catch (erro) {
    return {
      ok: false,
      error: `resposta inesperada da API ao listar as notas da issue: ${erro.message}`,
    };
  }

  if (!Array.isArray(dados)) {
    return {
      ok: false,
      error: "resposta inesperada da API ao listar as notas da issue (esperava uma lista)",
    };
  }

  return {
    ok: true,
    notas: dados.map((nota) => ({
      id: nota.id,
      author: nota.author ? nota.author.username : null,
      body: nota.body,
      createdAt: nota.created_at,
      system: !!nota.system,
    })),
  };
}

module.exports = { endpointIssue, endpointNotasIssue, obterIssue, listarNotasIssue };
