"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useFx } from "@/components/fx/FxProvider";
import { asset } from "@/lib/site";

/* ──────────────────────────────────────────────────────────
   A MÚSICA DA PÁGINA DE LINKS

   Um player pequeno, de uma faixa só. Não é o player do site: aqui a
   pessoa veio do Instagram, vai ficar dez segundos, e carregar o player
   inteiro seria peso sem retorno.

   Nada toca sozinho. Além de o navegador bloquear, som que começa sem
   pedir licença no meio do feed faz a pessoa fechar a aba.
   ────────────────────────────────────────────────────────── */

export default function TocaAgora({
  titulo,
  src,
  capa,
}: {
  titulo: string;
  src: string;
  capa: string | null;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [tocando, setTocando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const { play } = useFx();

  useEffect(() => {
    const elemento = audio.current;
    if (!elemento) return;

    const andar = () => {
      if (elemento.duration) setProgresso((elemento.currentTime / elemento.duration) * 100);
    };
    const parar = () => {
      setTocando(false);
      setProgresso(0);
    };

    elemento.addEventListener("timeupdate", andar);
    elemento.addEventListener("ended", parar);
    /* Fone desconectado, ligação chegando, outra aba assumindo o áudio:
       o navegador pausa e o botão precisa acompanhar, senão mostra
       "pausar" numa música que já parou. */
    elemento.addEventListener("pause", () => setTocando(false));
    elemento.addEventListener("play", () => setTocando(true));

    return () => {
      elemento.removeEventListener("timeupdate", andar);
      elemento.removeEventListener("ended", parar);
    };
  }, []);

  function alternar() {
    const elemento = audio.current;
    if (!elemento) return;
    play("click");
    if (elemento.paused) elemento.play().catch(() => setTocando(false));
    else elemento.pause();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md">
      <div className="flex items-center gap-3 p-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-graphite">
          {capa && <Image src={capa} alt="" fill sizes="56px" className="object-cover" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.62rem] tracking-[0.22em] text-accent uppercase">
            {tocando ? "Tocando agora" : "Ouça um pedaço"}
          </p>
          <p className="font-display truncate text-base font-bold tracking-tight text-paper uppercase">
            {titulo}
          </p>
        </div>

        {/* Barras dançando: só enquanto toca, senão é enfeite mentindo. */}
        {tocando && (
          <span className="flex h-5 items-end gap-[3px] pr-1" aria-hidden>
            {[0, 150, 300].map((atraso) => (
              <i
                key={atraso}
                className="eq-bar block h-full w-[3px] rounded-full bg-accent"
                style={{ animationDelay: `${atraso}ms` }}
              />
            ))}
          </span>
        )}

        <button
          type="button"
          onClick={alternar}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-ink transition active:scale-95"
          aria-label={tocando ? `Pausar ${titulo}` : `Tocar ${titulo}`}
        >
          {tocando ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
      </div>

      <div className="h-[3px] w-full bg-white/10">
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* `preload="none"`: quem não apertar o play não baixa um megabyte
          de música à toa — e muita gente que vem do Instagram está no
          4G. */}
      <audio ref={audio} src={asset(src)} preload="none" />
    </div>
  );
}
