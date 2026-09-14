"use client";

import { useRef } from "react";
import { useFx } from "./FxProvider";

/**
 * Inclina o cartão em 3D seguindo o ponteiro e publica a posição dele
 * como `--pointer-x` / `--pointer-y`, que o brilho de vidro usa para
 * saber de onde vem a luz.
 */
export default function Tilt({
  children,
  className = "",
  strength = 1,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** 1 = padrão; use 0.5 em cartões grandes para não exagerar */
  strength?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const { motion } = useFx();

  const onMove = (event: React.PointerEvent) => {
    if (!motion || event.pointerType !== "mouse") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--pointer-x", `${(x + 0.5) * 100}%`);
    element.style.setProperty("--pointer-y", `${(y + 0.5) * 100}%`);
    element.style.transform = `perspective(900px) rotateX(${-y * 5 * strength}deg) rotateY(${
      x * 7 * strength
    }deg) translateY(-3px)`;
  };

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = "";
  };

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </Tag>
  );
}
