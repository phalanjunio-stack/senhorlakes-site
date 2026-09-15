"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, RotateCcw } from "lucide-react";
import Campo from "./Campo";
import type { Registro, SecaoSchema, Valor } from "./tipos";

/* ──────────────────────────────────────────────────────────
   UMA SEÇÃO DO PAINEL

   Lê o conteúdo atual pelo servidor, deixa mexer, e devolve.

   Lê do servidor e não do site publicado de propósito: depois de salvar,
   o site leva uns dois minutos para se reconstruir. Se o painel lesse de
   lá, quem abrisse nesse meio tempo veria a versão velha e acharia que
   perdeu o trabalho.
   ────────────────────────────────────────────────────────── */

type Estado = "carregando" | "erro" | "pronto";
type Salvamento = "parado" | "salvando" | "salvo" | "falhou";

export default function EditorSecao({
  secao,
  aoVoltar,
}: {
  secao: SecaoSchema;
  aoVoltar: () => void;
}) {
  const [estado, setEstado] = useState<Estado>("carregando");
  const [dados, setDados] = useState<Registro>({});
  const [original, setOriginal] = useState<string>("");
  /* A "versão" identifica o conteúdo que eu li. Mando ela de volta ao
     salvar: se alguém tiver mexido no meio do caminho, o servidor recusa
     em vez de passar o rodo por cima do trabalho da outra pessoa. */
  const [versao, setVersao] = useState<string | null>(null);
  const [salvamento, setSalvamento] = useState<Salvamento>("parado");
  const [recado, setRecado] = useState("");

  /* Busca sem mexer em estado antes do primeiro await: o efeito abaixo
     chama esta função na montagem, e trocar estado de forma síncrona ali
     dentro faz o React renderizar duas vezes à toa. Quem quer a tela de
     "carregando" de volta usa `recarregar`. */
  const buscar = useCallback(async () => {
    try {
      const r = await fetch(`/api/conteudo/${secao.chave}`, { credentials: "same-origin" });
      if (!r.ok) throw new Error(String(r.status));
      const corpo = await r.json();
      setDados(corpo.dados ?? {});
      setOriginal(JSON.stringify(corpo.dados ?? {}));
      setVersao(corpo.versao ?? null);
      setEstado("pronto");
    } catch {
      setEstado("erro");
    }
  }, [secao.chave]);

  const recarregar = useCallback(() => {
    setEstado("carregando");
    buscar();
  }, [buscar]);

  useEffect(() => {
    /* A regra react-hooks/set-state-in-effect não enxerga o await: ela vê
       que `buscar` mexe em estado e reclama, mesmo o primeiro setState
       acontecendo só depois da resposta chegar. Buscar dados na montagem
       é exatamente para isso que o efeito serve — o conteúdo só pode ser
       pedido depois que a pessoa entrou, então não dá para carregar no
       servidor. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscar();
  }, [buscar]);

  const mudou = estado === "pronto" && JSON.stringify(dados) !== original;

  /* Fechar a aba com alteração não salva é o jeito mais bobo de perder
     texto escrito. O navegador só deixa avisar, não deixa escolher a
     frase — e é o suficiente. */
  useEffect(() => {
    if (!mudou) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [mudou]);

  const salvar = useCallback(async () => {
    setSalvamento("salvando");
    setRecado("");
    try {
      const r = await fetch(`/api/conteudo/${secao.chave}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ dados, versao }),
      });
      if (r.status === 409) {
        setSalvamento("falhou");
        setRecado("Alguém mexeu nesta seção depois que você abriu. Recarregue antes de salvar.");
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      const corpo = await r.json();
      setVersao(corpo.versao ?? null);
      setOriginal(JSON.stringify(dados));
      setSalvamento("salvo");
      setRecado("Salvo. O site se reconstrói sozinho em uns dois minutos.");
    } catch {
      setSalvamento("falhou");
      setRecado("Não consegui salvar. O que você escreveu continua aqui na tela.");
    }
  }, [dados, secao.chave, versao]);

  return (
    <main className="page-width py-10 lg:py-12">
      <button
        type="button"
        onClick={aoVoltar}
        className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-muted uppercase transition hover:text-accent"
      >
        <ArrowLeft size={15} /> Todas as seções
      </button>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em] uppercase">
          {secao.nome}
        </h1>

        {estado === "pronto" && (
          <div className="flex items-center gap-3">
            {mudou && (
              <button
                type="button"
                onClick={recarregar}
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.16em] text-muted uppercase transition hover:text-gold"
              >
                <RotateCcw size={14} /> Descartar
              </button>
            )}
            <button
              type="button"
              onClick={salvar}
              disabled={!mudou || salvamento === "salvando"}
              className="font-display inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              {salvamento === "salvando" && <LoaderCircle className="animate-spin" size={15} />}
              {salvamento === "salvo" && !mudou && <Check size={15} />}
              {mudou ? "Salvar" : salvamento === "salvo" ? "Salvo" : "Sem alteração"}
            </button>
          </div>
        )}
      </div>

      {recado && (
        <p
          role="status"
          className={`mt-5 text-sm ${salvamento === "falhou" ? "text-gold" : "text-accent"}`}
        >
          {recado}
        </p>
      )}

      {estado === "carregando" && (
        <p className="mt-10 flex items-center gap-2 text-muted">
          <LoaderCircle className="animate-spin" size={18} /> Buscando o conteúdo…
        </p>
      )}

      {estado === "erro" && (
        <div className="mt-10 max-w-lg rounded-xl border border-[var(--line)] bg-graphite p-6">
          <p className="text-paper">Não consegui buscar o conteúdo.</p>
          <p className="mt-2 text-sm text-muted">
            Ou o servidor está fora do ar, ou sua sessão expirou. Tente de novo; se insistir,
            entre no painel outra vez.
          </p>
          <button
            type="button"
            onClick={recarregar}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-xs tracking-[0.16em] text-accent uppercase transition hover:border-accent"
          >
            <RotateCcw size={14} /> Tentar de novo
          </button>
        </div>
      )}

      {estado === "pronto" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mudou) salvar();
          }}
          className="mt-8 flex max-w-3xl flex-col gap-7"
        >
          {secao.campos.map((campo) => (
            <Campo
              key={campo.name}
              campo={campo}
              valor={dados[campo.name]}
              aoMudar={(v: Valor) => setDados((d) => ({ ...d, [campo.name]: v }))}
            />
          ))}
        </form>
      )}
    </main>
  );
}
