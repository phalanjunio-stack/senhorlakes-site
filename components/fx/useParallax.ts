"use client";

import { useEffect, useRef } from "react";
import { useFx } from "./FxProvider";

/**
 * Lê a posição do ponteiro dentro do elemento e publica dois números
 * de -1 a 1 como variáveis CSS (`--mx`, `--my`). Cada camada decide
 * o quanto e para que lado se mexer — é isso que dá a sensação de
 * profundidade: o fundo vai para o lado oposto ao do mouse.
 *
 * O valor é suavizado (lerp) a cada quadro, então o movimento chega
 * com inércia em vez de grudar no cursor.
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { motion } = useFx();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!motion) {
      element.style.setProperty("--mx", "0");
      element.style.setProperty("--my", "0");
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame: number | null = null;

    const clamp = (value: number) => Math.min(1, Math.max(-1, value));

    const render = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      element.style.setProperty("--mx", x.toFixed(4));
      element.style.setProperty("--my", y.toFixed(4));
      if (Math.abs(targetX - x) > 0.002 || Math.abs(targetY - y) > 0.002) {
        frame = requestAnimationFrame(render);
      } else {
        frame = null;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      if (frame === null) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (frame === null) frame = requestAnimationFrame(render);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [motion]);

  return ref;
}
