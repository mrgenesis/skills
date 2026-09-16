#!/usr/bin/env node
/**
 * Detecta o sistema operacional, verifica se o utilitário oficial `glab`
 * (GitLab CLI) já está instalado e se já existe uma forma de autenticação
 * disponível: o token configurado em ~/.mrg.skills.vars.json (preferido,
 * porque não exige nenhuma interação nem reiniciar o Claude Code depois de
 * configurado) ou uma sessão já gravada em disco via `glab auth login`
 * (checada com `glab auth status`).
 *
 * Por que ~/.mrg.skills.vars.json é a via preferida: `glab auth login`
 * sempre exige pelo menos duas interações (protocolo Git e colar o token), e
 * cada execução de script aqui roda em um processo novo, isolado do
 * terminal do usuário, então não dá pra responder esses prompts por ele. O
 * arquivo, por outro lado, é lido do zero a cada execução, então uma edição
 * nele já vale na chamada seguinte, sem reiniciar nada (ver lib/config-vars.js).
 *
 * A saída é sempre um único objeto JSON com o mesmo formato, tenha ou não
 * pendência:
 *
 *   {
 *     "installed": bool,
 *     "version"?: "...",              // só quando installed: true
 *     "sysName": "...",
 *     "authenticated": bool,          // true se o token estiver configurado OU `glab auth status` passar
 *     "pendencias": ["instalarGlab", "autenticarGlab"],  // ordem em que devem ser resolvidas; [] = nada pendente
 *     "instalacao"?: {                // presente só quando installed: false
 *       "command": "...",
 *       "executable": bool,           // true: comando pronto para rodar. false: "command" é uma instrução em texto, não um comando de shell
 *       "mensagemAoUsuario": "..."
 *     },
 *     "autenticacao"?: {              // presente só quando installed: true e authenticated: false
 *       "arquivoRecemCriado": bool,   // true se este script acabou de criar ~/.mrg.skills.vars.json agora (arquivo não existia)
 *       "mensagemAoUsuario": "..."    // instrui a preencher ~/.mrg.skills.vars.json (via preferida) ou usar `glab auth login`
 *     }
 *   }
 *
 * Se o arquivo ~/.mrg.skills.vars.json não existir quando a autenticação
 * estiver pendente, este script já cria ele com um template (todas as
 * chaves conhecidas, com instrução de preenchimento no lugar do valor, ver
 * lib/config-vars.js), para o usuário só precisar editar os valores.
 */

const { execSync } = require("node:child_process");
const os = require("node:os");
const fs = require("node:fs");
const { obterVariavel, garantirArquivoTemplate, CONFIG_PATH } = require("./lib/config-vars");

const TOKEN_VAR_NAME = "MRG_GLAB_TOKEN";
const URL_VAR_NAME = "MRG_GLAB_URL_BASE";

function tokenConfigurado() {
  return Boolean(obterVariavel(TOKEN_VAR_NAME));
}

function jaInstalado() {
  try {
    const saida = execSync("glab version", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    return saida || "instalado";
  } catch {
    return null;
  }
}

function estaAutenticado() {
  if (tokenConfigurado()) return true;
  try {
    execSync("glab auth status", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function mensagemInstalacao(sysName) {
  return `Seu sistema é ${sysName}. Deseja instalar o utilitário oficial glab para conseguir interagir com o GitLab? Isso vai te proporcionar não só fazer push, pull e merge requests, mas também publicação de issues dentre outras funcionalidades do repositório.`;
}

function mensagemAutenticacao(arquivoRecemCriado) {
  const passoArquivo = arquivoRecemCriado
    ? [
        `Já criei o arquivo ${CONFIG_PATH} com um template. Edite os valores:`,
        `1. Abra ${CONFIG_PATH} e substitua o texto de cada campo pelo valor real (o texto entre "<...>" é só instrução, não é um valor válido).`,
        `2. Gere o token de acesso pessoal na URL indicada no próprio campo "${TOKEN_VAR_NAME}" do arquivo, com escopo "api".`,
        `3. Se não usar instância própria (gitlab.com), pode apagar a chave "${URL_VAR_NAME}" ou deixar como está.`,
      ]
    : [
        `O arquivo ${CONFIG_PATH} já existe, confira se os campos estão preenchidos com valores reais (não com o texto entre "<...>").`,
      ];

  return [
    `Para publicar e editar issues, o glab precisa estar autenticado. A forma recomendada aqui é usar o arquivo ${CONFIG_PATH}, porque \`glab auth login\` sempre pede alguma interação (protocolo Git, colar o token) e cada execução deste processo é isolada do seu terminal, sem como responder a esses prompts.`,
    ``,
    ...passoArquivo,
    `Restrinja a permissão do arquivo, já que ele guarda um segredo: chmod 600 ${CONFIG_PATH}`,
    ``,
    `Esse arquivo é lido do zero a cada execução, então não precisa reiniciar o Claude Code depois de editá-lo. Nunca cole o token aqui na conversa.`,
    ``,
    `Alternativa: se preferir não usar esse arquivo, rode \`glab auth login\` (com \`--hostname <url>\` se for instância própria) direto no seu terminal. Ele grava a autenticação em ~/.config/glab-cli/config.yml e funciona a partir da próxima execução, mas exige responder aos prompts interativos na hora.`,
  ].join("\n");
}

const ARQUITETURAS_SUPORTADAS = { x64: "amd64", arm64: "arm64" };

/**
 * Instala o binário oficial do glab direto da release do GitLab, sem sudo e
 * sem interação: baixa o tar.gz da última versão e extrai em ~/.local/bin
 * (diretório de usuário, sem precisar de privilégio de root). Evita depender
 * do gerenciador de pacotes da distro, que normalmente pede senha do sudo de
 * forma interativa, algo que não é possível fornecer neste fluxo.
 */
function comandoInstalacaoLinux() {
  const arch = ARQUITETURAS_SUPORTADAS[os.arch()];

  let idOsRelease = "";
  try {
    idOsRelease = fs.readFileSync("/etc/os-release", "utf8");
  } catch {
    // segue sem os-release
  }
  const ehWsl =
    idOsRelease.toLowerCase().includes("wsl") ||
    os.release().toLowerCase().includes("microsoft");
  const sysName = ehWsl ? "Linux (WSL)" : "Linux";

  if (!arch) {
    return {
      sysName: `${sysName}, arquitetura ${os.arch()}`,
      command:
        "Baixe o binário da release mais recente em https://gitlab.com/gitlab-org/cli/-/releases e adicione-o ao PATH (ex.: ~/.local/bin)",
      executable: false,
    };
  }

  const comando = [
    "set -e",
    "TAG=$(curl -fsS -o /dev/null -w '%{redirect_url}' https://gitlab.com/api/v4/projects/gitlab-org%2Fcli/releases/permalink/latest | sed -E 's#.*/releases/##')",
    'VERSION="${TAG#v}"',
    "TMP=$(mktemp -d)",
    `curl -fsSL "https://gitlab.com/gitlab-org/cli/-/releases/\${TAG}/downloads/glab_\${VERSION}_linux_${arch}.tar.gz" -o "$TMP/glab.tar.gz"`,
    'mkdir -p "$HOME/.local/bin"',
    'tar -xzf "$TMP/glab.tar.gz" -C "$TMP" bin/glab',
    'mv "$TMP/bin/glab" "$HOME/.local/bin/glab"',
    'chmod +x "$HOME/.local/bin/glab"',
    'rm -rf "$TMP"',
  ].join(" && ");

  return { sysName, command: comando, executable: true };
}

function detectarSistema() {
  switch (process.platform) {
    case "darwin":
      return {
        sysName: "macOS",
        command: "brew install glab",
        executable: true,
      };
    case "win32":
      return {
        sysName: "Windows",
        // --scope user: instala para o usuário atual, sem exigir elevação de administrador.
        // --accept-*-agreements: evita prompts interativos de aceite de termos.
        command:
          "winget install --id GitLab.Glab -e --scope user --accept-package-agreements --accept-source-agreements",
        executable: true,
      };
    case "linux":
      return comandoInstalacaoLinux();
    default:
      return {
        sysName: process.platform,
        command:
          "Baixe o binário da release mais recente em https://gitlab.com/gitlab-org/cli/-/releases e adicione-o ao PATH",
        executable: false,
      };
  }
}

function main() {
  const versao = jaInstalado();
  const instalado = Boolean(versao);
  const { sysName, command, executable } = detectarSistema();
  const autenticado = instalado ? estaAutenticado() : false;

  const pendencias = [];
  if (!instalado) pendencias.push("instalarGlab");
  if (instalado && !autenticado) pendencias.push("autenticarGlab");

  const saida = {
    installed: instalado,
    ...(instalado ? { version: versao } : {}),
    sysName,
    authenticated: autenticado,
    tokenConfigured: tokenConfigurado(),
    tokenVarName: TOKEN_VAR_NAME,
    urlVarName: URL_VAR_NAME,
    pendencias,
  };

  if (!instalado) {
    saida.instalacao = {
      command,
      executable,
      mensagemAoUsuario: mensagemInstalacao(sysName),
    };
  }

  if (instalado && !autenticado) {
    const arquivoRecemCriado = garantirArquivoTemplate();
    saida.autenticacao = {
      arquivoRecemCriado,
      mensagemAoUsuario: mensagemAutenticacao(arquivoRecemCriado),
    };
  }

  console.log(JSON.stringify(saida));
}

main();
