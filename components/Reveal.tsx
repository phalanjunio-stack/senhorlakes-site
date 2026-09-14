"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima o conteúdo ao entrar na viewport. Sem JS (ou com movimento
 * reduzido) o CSS já deixa tudo visível, então nada some.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /* A margem negativa abaixo segura a animação até o elemento entrar
       um pouco na tela — bom ao rolar, péssimo para o que já nasce
       visível perto do rodapé da primeira tela, que nunca cruzaria esse
       limite e ficaria invisível para sempre. Então o que já está na
       viewport no primeiro quadro aparece direto. */
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
