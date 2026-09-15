"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/fx/Tilt";
import { useFx } from "@/components/fx/FxProvider";
import MemberStory from "./MemberStory";
import { members, type Member } from "@/lib/data";
import { asset } from "@/lib/site";

/* O cartão é o mesmo para todo mundo; só quem tem história vira botão.
   Deixar todos clicáveis prometeria algo que a maioria não entrega. */
function conteudoDoCartao(member: Member) {
  return (
    <>
      <div
        className="absolute inset-[-3%] bg-no-repeat grayscale brightness-[0.72] contrast-[1.16] transition duration-700 group-hover:scale-[1.06] group-hover:grayscale-0 group-hover:brightness-90"
        style={{
          backgroundImage: `url(${asset(member.photo ?? "/img/banda.jpg")})`,
          // 500% deixa cada pessoa ocupando o card inteiro; 15% na
          // vertical alinha o recorte na altura dos rostos.
          backgroundSize: member.photo ? "cover" : "500% auto",
          backgroundPosition: member.photo ? "center" : `${member.framePosition} 15%`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-xl font-extrabold tracking-tight uppercase">
          {member.name}
        </h3>
        <p className="text-xs text-muted">{member.role}</p>
        {/* Visível sempre, não só no hover: no celular não existe hover,
            e sem esse aviso ninguém descobre que o cartão abre. */}
        {member.story && (
          <span className="font-display mt-2 inline-flex items-center gap-1 text-[0.6rem] font-semibold tracking-[0.1em] whitespace-nowrap text-accent uppercase">
            Ler a história <ArrowUpRight size={11} />
          </span>
        )}
      </div>
      {/* luz que acompanha o ponteiro */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(14rem 14rem at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(159,195,189,0.18), transparent 62%)",
        }}
      />
    </>
  );
}

export default function MemberGrid() {
  const [aberto, setAberto] = useState<Member | null>(null);
  const gatilho = useRef<HTMLButtonElement | null>(null);
  const { play } = useFx();

  const abrir = (member: Member, botao: HTMLButtonElement) => {
    gatilho.current = botao;
    play("open");
    setAberto(member);
  };

  const fechar = () => {
    play("close");
    setAberto(null);
    /* Devolve o foco ao cartão de onde a pessoa veio — sem isso o
       teclado volta para o começo da página. */
    gatilho.current?.focus();
  };

  const molduraDoCartao = "group relative aspect-[3/4] overflow-hidden rounded-xl";

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] lg:gap-4">
        {members.map((member, i) => (
          <Reveal as="li" key={member.name} delay={i * 90}>
            <Tilt>
              {member.story ? (
                <button
                  type="button"
                  onClick={(event) => abrir(member, event.currentTarget)}
                  aria-haspopup="dialog"
                  className={`${molduraDoCartao} w-full cursor-pointer text-left`}
                >
                  {conteudoDoCartao(member)}
                </button>
              ) : (
                <article className={molduraDoCartao}>{conteudoDoCartao(member)}</article>
              )}
            </Tilt>
          </Reveal>
        ))}
      </ul>

      {aberto && <MemberStory member={aberto} onClose={fechar} />}
    </>
  );
}
