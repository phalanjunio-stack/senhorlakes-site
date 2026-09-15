/* ──────────────────────────────────────────────────────────
   O SERVIDOR DO PAINEL

   O site é um monte de arquivo parado; este código só existe para os
   endereços que começam com /api. Ele faz três coisas:

     1. confere quem está entrando
     2. lê o conteúdo atual
     3. grava o conteúdo novo

   A gravação vai para o GitHub com uma chave que mora aqui no servidor.
   É por isso que quem usa o painel não precisa de conta no GitHub: a
   chave é do site, não da pessoa.
   ────────────────────────────────────────────────────────── */

import schema from "../content/painel-schema.json";

export interface Env {
  /** E-mail que pode entrar. */
  ADMIN_EMAIL: string;
  /** Senha guardada como pbkdf2$iteracoes$sal$hash — nunca em texto puro. */
  ADMIN_SENHA_HASH: string;
  /** Chave que assina o cookie de sessão. */
  SESSAO_SEGREDO: string;
  /** Chave do GitHub com permissão de escrever neste repositório. */
  GITHUB_TOKEN: string;
  /** "dono/repositorio" */
  GITHUB_REPO: string;
}

const COOKIE = "sessao";
const DURACAO_SESSAO = 60 * 60 * 24 * 7; // sete dias
const RAMO = "main";

/* Cada seção do painel sabe em que arquivo mora. A lista vem do mesmo
   schema que desenha os formulários, então não existe um segundo lugar
   para esquecer de atualizar. */
const ARQUIVOS: Record<string, string> = Object.fromEntries(
  (schema as Array<{ chave: string; arquivo: string; nome: string }>).map((s) => [s.chave, s.arquivo]),
);
const NOMES: Record<string, string> = Object.fromEntries(
  (schema as Array<{ chave: string; arquivo: string; nome: string }>).map((s) => [s.chave, s.nome]),
);

/* ── Texto e bytes ─────────────────────────────────────── */

function bytesParaBase64(bytes: Uint8Array): string {
  /* Em pedaços porque espalhar um array grande como argumentos estoura
     a pilha de chamadas — e conteúdo de história passa fácil disso. */
  let binario = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binario);
}

function base64ParaBytes(b64: string): Uint8Array {
  const binario = atob(b64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i += 1) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

const textoParaBase64 = (texto: string) => bytesParaBase64(new TextEncoder().encode(texto));
const base64ParaTexto = (b64: string) => new TextDecoder().decode(base64ParaBytes(b64));

function base64Url(bytes: Uint8Array): string {
  return bytesParaBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64Url(texto: string): Uint8Array {
  const b64 = texto.replace(/-/g, "+").replace(/_/g, "/");
  return base64ParaBytes(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
}

/** Compara sem deixar o tempo de resposta contar quantos bytes bateram. */
function igualNoTempo(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i += 1) diferenca |= a[i] ^ b[i];
  return diferenca === 0;
}

/* ── Senha ─────────────────────────────────────────────── */

/**
 * Confere a senha contra o hash guardado.
 *
 * PBKDF2 com muitas voltas de propósito: mesmo que alguém leve o hash
 * embora, testar senha por senha fica caro. E a comparação é feita em
 * tempo constante — senão o próprio relógio entrega quantos bytes
 * estavam certos.
 */
async function senhaConfere(senha: string, guardado: string): Promise<boolean> {
  const [algoritmo, voltas, salB64, hashB64] = guardado.split("$");
  if (algoritmo !== "pbkdf2") return false;

  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(senha),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: base64ParaBytes(salB64), iterations: Number(voltas) },
    chave,
    256,
  );
  return igualNoTempo(new Uint8Array(bits), base64ParaBytes(hashB64));
}

/* ── Sessão ────────────────────────────────────────────── */

async function chaveDeAssinatura(segredo: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/**
 * O cookie carrega e-mail e validade, assinados.
 *
 * Assinado e não criptografado: não tem segredo ali dentro, e o que
 * importa é que ninguém consiga forjar um. Sem a chave do servidor,
 * mudar qualquer letra invalida a assinatura.
 */
async function criarSessao(email: string, segredo: string): Promise<string> {
  const corpo = base64Url(
    new TextEncoder().encode(
      JSON.stringify({ email, expira: Math.floor(Date.now() / 1000) + DURACAO_SESSAO }),
    ),
  );
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    await chaveDeAssinatura(segredo),
    new TextEncoder().encode(corpo),
  );
  return `${corpo}.${base64Url(new Uint8Array(assinatura))}`;
}

async function sessaoVale(token: string | null, env: Env): Promise<boolean> {
  if (!token) return false;
  const [corpo, assinatura] = token.split(".");
  if (!corpo || !assinatura) return false;

  const confere = await crypto.subtle.verify(
    "HMAC",
    await chaveDeAssinatura(env.SESSAO_SEGREDO),
    deBase64Url(assinatura),
    new TextEncoder().encode(corpo),
  );
  if (!confere) return false;

  try {
    const dados = JSON.parse(new TextDecoder().decode(deBase64Url(corpo)));
    /* Mesmo assinado, o cookie vence. E se o e-mail que pode entrar
       mudar, as sessões antigas morrem junto. */
    return dados.expira > Math.floor(Date.now() / 1000) && dados.email === env.ADMIN_EMAIL;
  } catch {
    return false;
  }
}

function lerCookie(pedido: Request, nome: string): string | null {
  const cru = pedido.headers.get("cookie");
  if (!cru) return null;
  for (const parte of cru.split(";")) {
    const [chave, ...resto] = parte.trim().split("=");
    if (chave === nome) return resto.join("=");
  }
  return null;
}

function cookieDeSessao(token: string, segundos: number): string {
  /* HttpOnly: o JavaScript da página não lê o cookie, então um script
     injetado não leva a sessão embora. Secure: só viaja em HTTPS.
     SameSite=Strict: outro site não consegue usar a sessão em nome de
     quem está logado. */
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${segundos}`;
}

/* ── GitHub ────────────────────────────────────────────── */

function cabecalhosGitHub(env: Env): HeadersInit {
  return {
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    accept: "application/vnd.github+json",
    "user-agent": "painel-sr-lakes",
  };
}

async function lerArquivo(caminho: string, env: Env) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${caminho}?ref=${RAMO}`;
  const resposta = await fetch(url, { headers: cabecalhosGitHub(env) });
  if (!resposta.ok) return null;
  const corpo = (await resposta.json()) as { content: string; sha: string };
  return {
    dados: JSON.parse(base64ParaTexto(corpo.content.replace(/\n/g, ""))),
    versao: corpo.sha,
  };
}

async function gravarArquivo(caminho: string, dados: unknown, versao: string | null, env: Env) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${caminho}`;
  /* Dois espaços de recuo e quebra no fim: é como os arquivos de
     conteúdo já estão escritos. Sem isso, cada salvamento pelo painel
     viraria um diff gigante de formatação. */
  const texto = `${JSON.stringify(dados, null, 2)}\n`;
  const nome = NOMES[Object.keys(ARQUIVOS).find((c) => ARQUIVOS[c] === caminho) ?? ""] ?? caminho;

  return fetch(url, {
    method: "PUT",
    headers: { ...cabecalhosGitHub(env), "content-type": "application/json" },
    body: JSON.stringify({
      message: `${nome} (pelo painel)`,
      content: textoParaBase64(texto),
      sha: versao ?? undefined,
      branch: RAMO,
      committer: { name: "Painel Sr. Lakes", email: env.ADMIN_EMAIL },
    }),
  });
}

/* ── Respostas ─────────────────────────────────────────── */

const json = (corpo: unknown, inicio: ResponseInit = {}) =>
  new Response(JSON.stringify(corpo), {
    ...inicio,
    headers: { "content-type": "application/json; charset=utf-8", ...(inicio.headers ?? {}) },
  });

/* ── Porta de entrada ──────────────────────────────────── */

export default {
  async fetch(pedido: Request, env: Env): Promise<Response> {
    const url = new URL(pedido.url);
    const rota = url.pathname;

    if (!rota.startsWith("/api/")) return new Response("Não encontrado", { status: 404 });

    /* Entrar */
    if (rota === "/api/entrar" && pedido.method === "POST") {
      const { email, senha } = (await pedido.json().catch(() => ({}))) as {
        email?: string;
        senha?: string;
      };
      const ok =
        typeof email === "string" &&
        typeof senha === "string" &&
        email.trim().toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase() &&
        (await senhaConfere(senha, env.ADMIN_SENHA_HASH));

      if (!ok) return json({ erro: "não confere" }, { status: 401 });

      const token = await criarSessao(env.ADMIN_EMAIL, env.SESSAO_SEGREDO);
      return json({ ok: true }, { headers: { "set-cookie": cookieDeSessao(token, DURACAO_SESSAO) } });
    }

    /* Sair — apaga o cookie mandando um vencido */
    if (rota === "/api/sair" && pedido.method === "POST") {
      return json({ ok: true }, { headers: { "set-cookie": cookieDeSessao("", 0) } });
    }

    const entrou = await sessaoVale(lerCookie(pedido, COOKIE), env);

    if (rota === "/api/sessao") {
      return entrou ? json({ ok: true }) : json({ erro: "fora" }, { status: 401 });
    }

    /* Daqui para baixo, só quem entrou */
    if (!entrou) return json({ erro: "fora" }, { status: 401 });

    const conteudo = rota.match(/^\/api\/conteudo\/([\w-]+)$/);
    if (conteudo) {
      const caminho = ARQUIVOS[conteudo[1]];
      if (!caminho) return json({ erro: "seção não existe" }, { status: 404 });

      if (pedido.method === "GET") {
        const arquivo = await lerArquivo(caminho, env);
        return arquivo
          ? json(arquivo)
          : json({ erro: "não consegui ler" }, { status: 502 });
      }

      if (pedido.method === "PUT") {
        const { dados, versao } = (await pedido.json().catch(() => ({}))) as {
          dados?: unknown;
          versao?: string | null;
        };
        if (dados === undefined) return json({ erro: "sem conteúdo" }, { status: 400 });

        const resposta = await gravarArquivo(caminho, dados, versao ?? null, env);

        /* 409 é o GitHub dizendo que o arquivo mudou desde que o painel
           leu. Devolvo igual para a tela poder avisar em vez de
           atropelar o que a outra pessoa escreveu. */
        if (resposta.status === 409) return json({ erro: "mudou no meio" }, { status: 409 });
        if (!resposta.ok) return json({ erro: "não consegui gravar" }, { status: 502 });

        const corpo = (await resposta.json()) as { content?: { sha?: string } };
        return json({ ok: true, versao: corpo.content?.sha ?? null });
      }
    }

    return json({ erro: "rota não existe" }, { status: 404 });
  },
};
