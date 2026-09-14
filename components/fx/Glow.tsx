"use client";

import { useCallback, useState } from "react";

const SPARKS = [
  { ang: 35, dur: 1.8, delay: 0 },
  { ang: 125, dur: 2.1, delay: 0.4 },
  { ang: 215, dur: 1.7, delay: 0.7 },
  { ang: 305, dur: 2.0, delay: 0.2 },
];

/**
 * Aura acesa no hover do elemento-pai (que precisa ter `position: relative`
 * e a classe `smoke-glow`). A cor sai de `--glow-rgb`.
 *
 * `round` liga o halo giratório e as faíscas orbitando — eles só funcionam
 * em botões circulares, porque giram em torno do centro. Num botão
 * comprido a rotação joga o brilho para fora da forma, então a versão
 * padrão usa só a aura, que acompanha qualquer formato.
 *
 * Portado do painel da Contourline.
 */
export default function Glow({ ripple = 0, round = false }: { ripple?: number; round?: boolean }) {
  return (
    <>
      <span className={`sg-aura ${round ? "is-round" : ""}`} aria-hidden />
      {round && (
        <>
          <span className="sg-halo" aria-hidden />
          {SPARKS.map((spark, i) => (
            <span
              key={i}
              className="sg-spark"
              aria-hidden
              style={
                {
                  "--ang": `${spark.ang}deg`,
                  "--d": `${spark.dur}s`,
                  "--del": `${spark.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </>
      )}
      {/* trocar a key remonta o elemento e a animação toca de novo */}
      {ripple > 0 && <span key={ripple} className="sg-ripple" aria-hidden />}
    </>
  );
}

/** Contador para disparar o anel de clique: `onClick={() => { burst(); ... }}`. */
export function useRipple() {
  const [ripple, setRipple] = useState(0);
  const burst = useCallback(() => setRipple((n) => n + 1), []);
  return { ripple, burst };
}
