"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Prose from "@/components/Prose";
import type { Member } from "@/lib/data";

/**
 * A história de um integrante, num quadro por cima da página.
 *
 * Pequeno de propósito: é uma leitura curta, de quem clicou no rosto
 * por curiosidade. Quem quiser história longa vai em /historias — esta
 * aqui tem que caber sem parecer que virou outra página.
 */
export default function MemberStory({ member, onClose }: { member: Member; onClose: () => void }) {
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    /* O foco entra no quadro, senão quem navega por teclado continua
       preso nos cartões atrás dele. */
    fechar.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!member.story) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="historia-do-integrante"
      onClick={onClose}
    >
      {/* O botão de fechar fica fora da área que rola: dentro dela ele
          subiria junto com o texto e sumiria no meio da leitura. */}
      <div
        className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-graphite"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={fechar}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto p-7 lg:p-9">
          <p className="eyebrow pr-12">{member.role}</p>
          <h3
            id="historia-do-integrante"
            className="font-display mt-3 text-[clamp(1.9rem,5vw,2.6rem)] leading-[0.95] font-extrabold tracking-[-0.04em] uppercase"
          >
            {member.name}
          </h3>

          <Prose text={member.story} className="mt-6" />
        </div>
      </div>
    </div>
  );
}
