#!/usr/bin/env node
/**
 * Uso: node detectar-glab.js [--repo owner/projeto]
 *
 * Detecta se o utilitário oficial `glab` (GitLab CLI) está disponível — no
 * PATH (instalação já existente no sistema, sempre priorizada) ou no
 * binário vendorizado desta skill (vendor/glab/bin, ver
 * lib/glab-binario.js) — e se já existe uma forma de autenticação
 * disponível: o token configurado em ~/.mrg.skills/credenciais.json
 * (preferido, porque não exige nenhuma interação nem reiniciar o Claude Code
 * depois de configurado) ou uma sessão já gravada em disco via
 * `glab auth login` (checada com `glab auth status`).
 *
 * --repo é opcional aqui, mas recomendado sempre que já se souber o
 * repositório de destino: MRG_GLAB_TOKEN pode ser um mapa por grupo/projeto
 * (ver lib/config-vars.js), e sem --repo o script só consegue checar se
 * existe ALGUM token configurado, não necessariamente um válido para aquele
 * repositório específico.
 *
 * Por que ~/.mrg.skills/credenciais.json é a via preferida: `glab auth login`
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
 *     "usandoBinarioVendorizado": bool, // true se "installed" vem do binário desta skill, não do PATH
 *     "authenticated": bool,          // true se o token estiver configurado OU `glab auth status` passar
 *     "pendencias": ["instalarGlab", "autenticarGlab"],  // ordem em que devem ser resolvidas; [] = nada pendente
 *     "instalacao"?: {                // presente só quando installed: false
 *       "command": "...",
 *       "executable": bool,           // true: comando pronto para rodar. false: "command" é uma instrução em texto, não um comando de shell
 *       "mensagemAoUsuario": "..."
 *     },
 *     "autenticacao"?: {              // presente só quando installed: true e authenticated: false
 *       "arquivoRecemCriado": bool,   // true se este script acabou de criar ~/.mrg.skills/credenciais.json agora (arquivo não existia)
 *       "mensagemAoUsuario": "..."    // instrui a preencher ~/.mrg.skills/credenciais.json (via preferida) ou usar `glab auth login`
 *     }
 *   }
 *
 * Se o arquivo ~/.mrg.skills/credenciais.json não existir quando a
 * autenticação estiver pendente, este script já cria ele com um template
 * (todas as chaves conhecidas, com instrução de preenchimento no lugar do
 * valor, ver lib/config-vars.js), para o usuário só precisar editar os
 * valores.
 */

const { execFileSync } = require("node:child_process");
const { parseArgs } = require("node:util");
const path = require("node:path");
const {
  obterToken,
  garantirArquivoTemplate,
  CONFIG_PATH,
  TOKEN_VAR_NAME,
  URL_VAR_NAME,
  URL_BASE_PADRAO,
} = require("./lib/config-vars");
const { GLAB_BIN_PATH, glabDoSistemaFunciona, resolverCaminhoGlab } = require("./lib/glab-binario");

function lerOpcoes() {
  const { values } = parseArgs({ options: { repo: { type: "string" } } });
  return values;
}

function tokenConfigurado(repo) {
  return Boolean(obterToken(repo));
}

/**
 * Retorna a versão instalada (via `glab version`, usando resolverCaminhoGlab:
 * PATH em primeiro lugar, binário vendorizado desta skill em seguida) ou
 * null se nenhum dos dois estiver disponível.
 */
function jaInstalado() {
  try {
    const saida = execFileSync(resolverCaminhoGlab(), ["version"], {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return saida || "instalado";
  } catch {
    return null;
  }
}

function estaAutenticado(repo) {
  if (tokenConfigurado(repo)) return true;
  try {
    execFileSync(resolverCaminhoGlab(), ["auth", "status"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function mensagemInstalacao() {
  return `O glab (utilitário oficial do GitLab) não foi encontrado nem no seu sistema nem no cache desta skill. Deseja que eu baixe o binário oficial (sem instalar nada no sistema: sem sudo/admin, sem gerenciador de pacotes) e salve em ${GLAB_BIN_PATH}? Isso vai te proporcionar publicar/editar issues e baixar arquivos ou pastas de repositórios no GitLab.`;
}

function mensagemAutenticacao(arquivoRecemCriado) {
  const passoArquivo = arquivoRecemCriado
    ? [
        `Já criei o arquivo ${CONFIG_PATH} com um template. Edite os valores:`,
        `1. Abra ${CONFIG_PATH} e substitua o texto do campo "${TOKEN_VAR_NAME}" pelo valor real (o texto entre "<...>" é só instrução, não é um valor válido).`,
        `2. Gere o token de acesso pessoal em ${URL_BASE_PADRAO}-/user_settings/personal_access_tokens (ou na URL da sua instância, se for diferente), com escopo "api".`,
        `3. O campo "${URL_VAR_NAME}" já vem preenchido com "${URL_BASE_PADRAO}" (URL padrão do GitLab da Sebrae). Só troque esse valor se precisar apontar para outra instância.`,
      ]
    : [
        `O arquivo ${CONFIG_PATH} já existe, confira se o campo "${TOKEN_VAR_NAME}" está preenchido com um valor real (não com o texto entre "<...>").`,
      ];

  return [
    `Para publicar, editar ou baixar arquivos de repositórios no GitLab, o glab precisa estar autenticado. A forma recomendada aqui é usar o arquivo ${CONFIG_PATH}, porque \`glab auth login\` sempre pede alguma interação (protocolo Git, colar o token) e cada execução deste processo é isolada do seu terminal, sem como responder a esses prompts.`,
    ``,
    ...passoArquivo,
    `Restrinja a permissão do arquivo, já que ele guarda um segredo: chmod 600 ${CONFIG_PATH}`,
    ``,
    `Esse arquivo é lido do zero a cada execução, então não precisa reiniciar o Claude Code depois de editá-lo. Nunca cole o token aqui na conversa.`,
    ``,
    `Se você usa tokens diferentes por grupo ou projeto (comum com Project/Group access tokens, que são escopados), troque o valor de "${TOKEN_VAR_NAME}" por um objeto em vez de uma string única, ex.: { "grupo/subgrupo": "token1", "outro-grupo/projeto": "token2" }. Ao publicar, editar ou baixar um arquivo em "grupo/subgrupo/projeto-x", o script usa o token da chave mais específica que corresponder ao caminho.`,
    ``,
    `Alternativa: se preferir não usar esse arquivo, rode \`glab auth login\` (com \`--hostname <url>\` se for instância própria) direto no seu terminal. Ele grava a autenticação em ~/.config/glab-cli/config.yml e funciona a partir da próxima execução, mas exige responder aos prompts interativos na hora.`,
  ].join("\n");
}

function main() {
  const { repo } = lerOpcoes();
  const versao = jaInstalado();
  const instalado = Boolean(versao);
  const autenticado = instalado ? estaAutenticado(repo) : false;

  const pendencias = [];
  if (!instalado) pendencias.push("instalarGlab");
  if (instalado && !autenticado) pendencias.push("autenticarGlab");

  const saida = {
    installed: instalado,
    ...(instalado ? { version: versao, usandoBinarioVendorizado: !glabDoSistemaFunciona() } : {}),
    authenticated: autenticado,
    tokenConfigured: tokenConfigurado(repo),
    tokenVarName: TOKEN_VAR_NAME,
    urlVarName: URL_VAR_NAME,
    pendencias,
  };

  if (!instalado) {
    saida.instalacao = {
      // Caminho absoluto: quem for rodar este comando (via ferramenta Bash)
      // pode estar em qualquer diretório de trabalho.
      command: `node "${path.join(__dirname, "instalar-glab.js")}"`,
      executable: true,
      mensagemAoUsuario: mensagemInstalacao(),
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
