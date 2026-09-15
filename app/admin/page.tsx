"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";

/* ──────────────────────────────────────────────────────────
   PAINEL

   A tela é estática, faz parte do build do site como qualquer
   outra página. Quem recebe o login e grava o conteúdo são as
   funções em /api, que rodam na Cloudflare.

   A senha nunca é guardada no navegador: o servidor devolve um
   cookie de sessão que o JavaScript daqui não consegue ler. Se
   alguém roubar o que está na memória desta página, não leva
   nada com que entrar de novo.
   ────────────────────────────────────────────────────────── */

type Estado = "verificando" | "fora" | "dentro";

const SECOES = [
  { chave: "shows", nome: "Agenda de shows" },
  { chave: "fotos", nome: "Galeria de fotos" },
  { chave: "historias", nome: "Histórias" },
  { chave: "videos", nome: "Vídeos" },
  { chave: "albuns", nome: "Álbuns e playlists" },
  { chave: "faixas", nome: "Músicas" },
  { chave: "integrantes", nome: "Integrantes" },
  { chave: "banda", nome: "Banda e contato" },
  { chave: "config", nome: "Configurações do site" },
];

export default function PainelPage() {
  const [estado, setEstado] = useState<Estado>("verificando");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  /* Pergunta ao servidor se o cookie desta pessoa ainda vale. Enquanto
     não responde a tela fica em "verificando" — mostrar o formulário de
     login para quem já está dentro é piscada feia. */
  useEffect(() => {
    fetch("/api/sessao", { credentials: "same-origin" })
      .then((r) => setEstado(r.ok ? "dentro" : "fora"))
      .catch(() => setEstado("fora"));
  }, []);

  const entrar = useCallback(
    async (evento: React.FormEvent) => {
      evento.preventDefault();
      setErro("");
      setEnviando(true);
      try {
        const resposta = await fetch("/api/entrar", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email, senha }),
        });
        if (resposta.ok) {
          setSenha("");
          setEstado("dentro");
          return;
        }
        /* Uma mensagem só para e-mail errado e senha errada: dizer qual
           dos dois está certo entrega meio caminho a quem tenta invadir. */
        setErro(
          resposta.status === 401
            ? "E-mail ou senha não conferem."
            : "Não consegui falar com o servidor. Tente de novo.",
        );
      } catch {
        setErro("Sem conexão com o servidor.");
      } finally {
        setEnviando(false);
      }
    },
    [email, senha],
  );

  const sair = useCallback(async () => {
    await fetch("/api/sair", { method: "POST", credentials: "same-origin" }).catch(() => {});
    setEstado("fora");
  }, []);

  if (estado === "verificando") {
    return (
      <main className="grid min-h-[100svh] place-items-center">
        <LoaderCircle className="animate-spin text-muted" size={28} aria-label="Carregando" />
      </main>
    );
  }

  if (estado === "fora") {
    return (
      <main className="grid min-h-[100svh] place-items-center px-5 py-12">
        <div className="w-full max-w-sm">
          <Image
            src="/img/logo.png"
            alt=""
            width={54}
            height={64}
            className="mx-auto h-16 w-auto"
            priority
          />
          <h1 className="font-display mt-7 text-center text-3xl font-extrabold tracking-[-0.04em] uppercase">
            Painel
          </h1>
          <p className="mt-2 text-center text-sm text-muted">Site do Sr. Lakes</p>

          <form onSubmit={entrar} className="mt-9 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.18em] text-muted uppercase">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                className="rounded-lg border border-[var(--line)] bg-graphite px-4 py-3 text-paper outline-none focus:border-accent"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.18em] text-muted uppercase">Senha</span>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
                className="rounded-lg border border-[var(--line)] bg-graphite px-4 py-3 text-paper outline-none focus:border-accent"
              />
            </label>

            {erro && (
              <p role="alert" className="text-sm text-gold">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="font-display mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {enviando && <LoaderCircle className="animate-spin" size={16} />}
              {enviando ? "Entrando" : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="page-width py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <p className="eyebrow eyebrow-gold">Painel</p>
          <h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.04em] uppercase">
            O que você quer mexer?
          </h1>
        </div>
        <button
          type="button"
          onClick={sair}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-xs tracking-[0.18em] text-muted uppercase transition hover:border-accent hover:text-accent"
        >
          <LogOut size={15} /> Sair
        </button>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECOES.map((secao) => (
          <li key={secao.chave}>
            <button
              type="button"
              className="font-display w-full rounded-xl border border-[var(--line)] bg-graphite px-5 py-6 text-left text-lg font-bold tracking-tight text-paper uppercase transition hover:border-accent hover:text-accent"
            >
              {secao.nome}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
