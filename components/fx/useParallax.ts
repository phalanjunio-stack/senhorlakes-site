"use client";

import { useEffect, useRef } from "react";
import { useFx } from "./FxProvider";

/**
 * Lê a posição do ponteiro dentro do elemento e publica:
 *
 * - `--mx` / `--my`: de -1 a 1, com inércia. Cada camada decide o quanto
 *   e para que lado se mexer — é isso que dá a profundidade, com o fundo
 *   indo para o lado oposto ao do mouse.
 * - `--px` / `--py`: a mesma posição em porcentagem (0–100%), quase sem
 *   atraso. Serve para o holofote de cor, que precisa ficar embaixo do
 *   cursor e não atrás dele.
 * - a classe `is-pointing` enquanto o ponteiro estiver dentro.
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
    /* posição crua do holofote, em porcentagem */
    let targetPx = 50;
    let targetPy = 50;
    let px = 50;
    let py = 50;
    let frame: number | null = null;

    const clamp = (value: number) => Math.min(1, Math.max(-1, value));

    const render = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      // bem mais rápido: o holofote precisa acompanhar o cursor de perto
      px += (targetPx - px) * 0.3;
      py += (targetPy - py) * 0.3;

      element.style.setProperty("--mx", x.toFixed(4));
      element.style.setProperty("--my", y.toFixed(4));
      element.style.setProperty("--px", `${px.toFixed(2)}%`);
      element.style.setProperty("--py", `${py.toFixed(2)}%`);

      const moving =
        Math.abs(targetX - x) > 0.002 ||
        Math.abs(targetY - y) > 0.002 ||
        Math.abs(targetPx - px) > 0.1 ||
        Math.abs(targetPy - py) > 0.1;
      frame = moving ? requestAnimationFrame(render) : null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width;
      const ratioY = (event.clientY - rect.top) / rect.height;
      targetX = clamp((ratioX - 0.5) * 2);
      targetY = clamp((ratioY - 0.5) * 2);
      targetPx = ratioX * 100;
      targetPy = ratioY * 100;
      element.classList.add("is-pointing");
      if (frame === null) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      element.classList.remove("is-pointing");
      if (frame === null) frame = requestAnimationFrame(render);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.classList.remove("is-pointing");
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [motion]);

  return ref;
}
