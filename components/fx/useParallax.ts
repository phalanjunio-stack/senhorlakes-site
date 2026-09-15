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
 *
 * Mouse e dedo fazem coisas diferentes de propósito. O mouse move a
 * imagem e acende a cor; o dedo só acende a cor. Mexer a foto embaixo
 * do dedo que a está colorindo dá a impressão de que ela escorregou —
 * e no celular o movimento já nasce desligado de qualquer forma.
 *
 * O toque é lido por eventos de touch, não de pointer: quando a pessoa
 * arrasta para rolar a página, o navegador cancela os eventos de
 * pointer, e a lupa apagaria no meio do gesto. O touchmove continua
 * chegando (e é passivo, então a rolagem não é atrapalhada).
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { motion } = useFx();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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

    /** Aponta a lupa. `arrasta` diz se a imagem também acompanha. */
    const apontar = (clientX: number, clientY: number, arrasta: boolean) => {
      const rect = element.getBoundingClientRect();
      const ratioX = (clientX - rect.left) / rect.width;
      const ratioY = (clientY - rect.top) / rect.height;
      targetPx = ratioX * 100;
      targetPy = ratioY * 100;
      if (arrasta) {
        targetX = clamp((ratioX - 0.5) * 2);
        targetY = clamp((ratioY - 0.5) * 2);
      }
      element.classList.add("is-pointing");
      if (frame === null) frame = requestAnimationFrame(render);
    };

    const apagar = () => {
      targetX = 0;
      targetY = 0;
      element.classList.remove("is-pointing");
      if (frame === null) frame = requestAnimationFrame(render);
    };

    /* ── Mouse: move a imagem e acende a cor ─────────────── */
    const onMouseMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      apontar(event.clientX, event.clientY, true);
    };

    /* ── Dedo: só acende a cor ───────────────────────────── */
    const onToque = (event: TouchEvent) => {
      const toque = event.touches[0];
      if (toque) apontar(toque.clientX, toque.clientY, false);
    };

    if (motion) {
      element.addEventListener("pointermove", onMouseMove);
      element.addEventListener("pointerleave", apagar);
    } else {
      /* Com o movimento desligado a imagem fica parada, mas os valores
         precisam existir zerados — as camadas leem essas variáveis. */
      element.style.setProperty("--mx", "0");
      element.style.setProperty("--my", "0");
    }

    element.addEventListener("touchstart", onToque, { passive: true });
    element.addEventListener("touchmove", onToque, { passive: true });
    element.addEventListener("touchend", apagar, { passive: true });
    element.addEventListener("touchcancel", apagar, { passive: true });

    return () => {
      element.removeEventListener("pointermove", onMouseMove);
      element.removeEventListener("pointerleave", apagar);
      element.removeEventListener("touchstart", onToque);
      element.removeEventListener("touchmove", onToque);
      element.removeEventListener("touchend", apagar);
      element.removeEventListener("touchcancel", apagar);
      element.classList.remove("is-pointing");
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [motion]);

  return ref;
}
