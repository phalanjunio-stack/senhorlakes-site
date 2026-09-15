"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Sparkles, Volume2, VolumeX } from "lucide-react";
import Glow, { useRipple } from "./Glow";
import { useFx } from "./FxProvider";

/** Fio de progresso da leitura, colado no topo da janela. */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? window.scrollY / range : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden>
      <div
        className="h-full origin-left"
        style={{
          background: "linear-gradient(to right, var(--color-gold), var(--color-accent))",
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
}

/**
 * Cantinho de controles: ligar/desligar movimento e som, e voltar ao
 * topo. Fica acima da barra do player para não brigar com ela.
 */
export default function FxControls() {
  const { motion, sound, toggleMotion, toggleSound, play } = useFx();
  const [showTop, setShowTop] = useState(false);
  const top = useRipple();
  const snd = useRipple();
  const mov = useRipple();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const button =
    "smoke-glow glow-fill relative grid size-10 place-items-center rounded-full border border-[var(--line)] bg-carbon/85 backdrop-blur transition hover:text-ink";

  return (
    <>
      <ScrollProgress />

      <div className="fixed right-4 bottom-[calc(var(--player-h)+1rem)] z-40 flex flex-col gap-2 lg:right-6">
        {showTop && (
          <button
            type="button"
            onClick={() => {
              top.burst();
              play("open");
              window.scrollTo({ top: 0, behavior: motion ? "smooth" : "auto" });
            }}
            className={` text-muted`}
            aria-label="Voltar ao topo"
           
          >
            <Glow ripple={top.ripple} round />
            <ArrowUp size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            snd.burst();
            toggleSound();
          }}
          className={`${button} ${sound ? "text-accent" : "text-muted"} hidden md:grid`}
          aria-pressed={sound}
          aria-label={sound ? "Desligar efeitos sonoros" : "Ligar efeitos sonoros"}
          title={sound ? "Som: ligado" : "Som: desligado"}
         
        >
          <Glow ripple={snd.ripple} round />
          {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* Os dois botões só existem no desktop. O movimento já nasce
            desligado no celular (não há ponteiro para mover nada) e a arte
            já vem colorida, com a lupa perdendo a máscara em telas de
            toque. E o som é um detalhe de quem navega com mouse: no
            telefone a pessoa já tem o botão de volume na lateral. */}
        <button
          type="button"
          onClick={() => {
            mov.burst();
            play(motion ? "close" : "open");
            toggleMotion();
          }}
          className={`${button} ${motion ? "text-accent" : "text-muted"} hidden md:grid`}
          aria-pressed={motion}
          aria-label={motion ? "Desligar animações" : "Ligar animações"}
          title={motion ? "Movimento: ligado" : "Movimento: desligado"}
         
        >
          <Glow ripple={mov.ripple} round />
          <Sparkles size={17} />
        </button>
      </div>
    </>
  );
}
