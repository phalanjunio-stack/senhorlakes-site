"use client";

import { useCallback, useState } from "react";

const SPARKS = [
  { ang: 35, dur: 1.8, delay: 0 },
  { ang: 125, dur: 2.1, delay: 0.4 },
  { ang: 215, dur: 1.7, delay: 0.7 },
  { ang: 305, dur: 2.0, delay: 0.2 },
];

/**
 * Aura + halo + faíscas orbitando, acesas no hover do elemento-pai
 * (que precisa ter `position: relative` e a classe `smoke-glow`).
 *
 * Portado do painel da Contourline. A cor sai de `--glow-rgb`, então
 * dá para pintar cada botão com a cor do próprio álbum.
 */
export default function Glow({ ripple = 0 }: { ripple?: number }) {
  return (
    <>
      <span className="sg-aura" aria-hidden />
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
