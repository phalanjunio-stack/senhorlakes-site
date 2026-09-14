"use client";

import { useEffect, useRef, useState } from "react";
import { useFx } from "./FxProvider";

const TARGETS = "a, button, [data-cursor], input[type='range']";

/**
 * Cursor próprio: um anel que segue o ponteiro com atraso e cresce
 * mostrando um rótulo quando passa sobre algo clicável. O rótulo vem
 * do atributo `data-cursor` do elemento.
 *
 * Só aparece em mouse de verdade — em toque nem é montado.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [fine, setFine] = useState(false);
  const { motion, play } = useFx();

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!fine || !motion) return;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = requestAnimationFrame(function loop() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      ring.classList.add("is-visible");
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(TARGETS);
      if (!target) return;
      ring.classList.add("is-active");
      if (label) label.textContent = target.dataset.cursor ?? "";
      play("hover");
    };

    const onOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(TARGETS);
      if (!target) return;
      const next = (event.relatedTarget as HTMLElement | null)?.closest?.(TARGETS);
      if (next) return;
      ring.classList.remove("is-active");
      if (label) label.textContent = "";
    };

    const onLeave = () => ring.classList.remove("is-visible");
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      ring.classList.remove("is-visible", "is-active", "is-down");
    };
  }, [fine, motion, play]);

  if (!fine || !motion) return null;

  return (
    <div ref={ringRef} className="cursor-ring" aria-hidden>
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
