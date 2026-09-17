#!/usr/bin/env node
/**
 * Baixa o binário oficial do glab (GitLab CLI) da release mais recente e
 * grava em vendor/glab/bin/ dentro desta skill (GLAB_BIN_PATH, ver
 * lib/glab-binario.js), sem instalar nada no sistema: sem sudo, sem admin,
 * sem gerenciador de pacotes, sem registrar nada fora da pasta da própria
 * skill. Esse binário nunca é commitado (ver .gitignore na raiz do
 * repositório).
 *
 * Só rode este script quando `glabDoSistemaFunciona()` (lib/glab-binario.js)
 * já tiver indicado que não há glab disponível no PATH: se o usuário já tem
 * um glab instalado, ele é sempre usado no lugar deste, não faz sentido
 * baixar uma segunda cópia.
 *
 * Uso: node instalar-glab.js
 *
 * Não interativo por design (sem prompts, sem elevação de privilégio).
 * Suporta Linux, macOS e Windows, arquiteturas amd64 e arm64. Para qualquer
 * outra combinação de sistema/arquitetura, retorna erro orientando a baixar
 * manualmente e colocar o executável em GLAB_BIN_PATH.
 *
 * Saída (stdout, JSON):
 *   Sucesso: { "ok": true, "action": "install", "version": "1.118.0", "path": "..." }
 *   Falha:   { "ok": false, "action": "install", "error": "..." }
 */

const fs = require("node:fs");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { GLAB_VENDOR_DIR, GLAB_BIN_PATH, NOME_EXECUTAVEL } = require("./lib/glab-binario");

const MAPA_PLATAFORMA = { linux: "linux", darwin: "darwin", win32: "windows" };
const MAPA_ARQUITETURA = { x64: "amd64", arm64: "arm64" };

const USER_AGENT = "mrgenesis-skills-gitlab-toolkit";

function falha(erro) {
  console.log(JSON.stringify({ ok: false, action: "install", error: erro }));
  process.exitCode = 1;
}

function resolverPlataformaEArquitetura() {
  const plataforma = MAPA_PLATAFORMA[process.platform];
  const arquitetura = MAPA_ARQUITETURA[process.arch];
  if (!plataforma || !arquitetura) return null;
  return { plataforma, arquitetura };
}

/**
 * Segue redirecionamentos manualmente (o endpoint "permalink/latest" do
 * GitLab responde com um 302 para a release mais recente) e baixa o corpo
 * final para `destino`. Sem dependências externas, só `node:https`.
 */
function baixar(url, destino, redirecionamentosRestantes = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": USER_AGENT } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          if (redirecionamentosRestantes <= 0) {
            reject(new Error("excesso de redirecionamentos"));
            return;
          }
          baixar(res.headers.location, destino, redirecionamentosRestantes - 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`download falhou com status HTTP ${res.statusCode}`));
          return;
        }
        const arquivo = fs.createWriteStream(destino);
        res.pipe(arquivo);
        arquivo.on("finish", () => arquivo.close(resolve));
        arquivo.on("error", reject);
      })
      .on("error", reject);
  });
}

/**
 * Descobre a tag e o número da versão mais recente seguindo o
 * redirecionamento do endpoint "permalink/latest" (sem baixar o corpo).
 */
function resolverVersaoMaisRecente() {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://gitlab.com/api/v4/projects/gitlab-org%2Fcli/releases/permalink/latest",
        { headers: { "User-Agent": USER_AGENT } },
        (res) => {
          res.resume();
          const destino = res.headers.location;
          if (res.statusCode >= 300 && res.statusCode < 400 && destino) {
            const tag = destino.replace(/.*\/releases\//, "");
            resolve({ tag, versao: tag.replace(/^v/, "") });
            return;
          }
          reject(new Error(`esperava redirecionamento da GitLab API, recebi status ${res.statusCode}`));
        }
      )
      .on("error", reject);
  });
}

async function main() {
  const combinacao = resolverPlataformaEArquitetura();
  if (!combinacao) {
    return falha(
      `sistema (${process.platform}) ou arquitetura (${process.arch}) sem download automático disponível. Baixe manualmente em https://gitlab.com/gitlab-org/cli/-/releases e coloque o executável em ${GLAB_BIN_PATH}.`
    );
  }

  let tag, versao;
  try {
    ({ tag, versao } = await resolverVersaoMaisRecente());
  } catch (erro) {
    return falha(`não foi possível checar a versão mais recente do glab: ${erro.message}`);
  }

  const { plataforma, arquitetura } = combinacao;
  const extensao = plataforma === "windows" ? "zip" : "tar.gz";
  const nomeArquivo = `glab_${versao}_${plataforma}_${arquitetura}.${extensao}`;
  const url = `https://gitlab.com/gitlab-org/cli/-/releases/${tag}/downloads/${nomeArquivo}`;
  const arquivoTemporario = path.join(os.tmpdir(), `mrg-skills-${nomeArquivo}`);

  try {
    fs.mkdirSync(GLAB_VENDOR_DIR, { recursive: true });
    await baixar(url, arquivoTemporario);

    // O pacote oficial sempre traz o binário em "bin/<executável>" dentro do
    // arquivo, extrair com -C GLAB_VENDOR_DIR reproduz isso exatamente como
    // GLAB_BIN_PATH espera, sem precisar mover nada depois. `tar` lida com
    // .tar.gz e .zip (bsdtar, que é o que Windows 10+/macOS/a maioria das
    // distros Linux trazem, detecta o formato pelo conteúdo).
    execFileSync("tar", ["-xf", arquivoTemporario, "-C", GLAB_VENDOR_DIR, `bin/${NOME_EXECUTAVEL}`]);

    if (process.platform !== "win32") {
      fs.chmodSync(GLAB_BIN_PATH, 0o755);
    }
  } catch (erro) {
    return falha(`falha ao baixar ou extrair o glab: ${erro.message}`);
  } finally {
    fs.rm(arquivoTemporario, { force: true }, () => {});
  }

  console.log(JSON.stringify({ ok: true, action: "install", version: versao, path: GLAB_BIN_PATH }));
}

main();
