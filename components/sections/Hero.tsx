"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import Reveal from "@/components/Reveal";
import Glow, { useRipple } from "@/components/fx/Glow";
import { useFx } from "@/components/fx/FxProvider";
import { useParallax } from "@/components/fx/useParallax";
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/Social";
import { band, whatsappLink } from "@/lib/data";

const socials = [
  { href: band.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: band.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: whatsappLink(), label: "WhatsApp", Icon: WhatsappIcon },
];

/**
 * Topo com a foto ocupando a tela inteira e o texto por cima, no pé.
 *
 * O que faz isso funcionar sem apagar a banda: o título é pequeno e o
 * escurecimento é só uma faixa no rodapé — na altura das pernas e do
 * torso, nunca na dos rostos, que ficam no terço de cima e continuam
 * claros e coloridos.
 */
export default function Hero() {
  /* Publica --mx e --my (-1 a 1): a foto anda ao contrário do ponteiro
     e o texto quase não se mexe. A diferença de velocidade entre eles é
     o que cria a profundidade. */
  const ref = useParallax<HTMLElement>();
  const { play } = useFx();
  const primary = useRipple();
  const secondary = useRipple();

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24 pb-16"
      aria-labelledby="hero-title"
    >
      {/* foto em tela cheia — anda ao contrário do ponteiro */}
      <div
        className="absolute inset-[-4%]"
        style={{
          transform:
            "translate3d(calc(var(--mx, 0) * -24px), calc(var(--my, 0) * -16px), 0) scale(1.03)",
        }}
      >
        <Image
          src="/img/banda.jpg"
          alt="Os integrantes do Senhor Lakes"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_26%] brightness-[0.92] contrast-[1.05] saturate-[0.92]"
        />
      </div>

      {/* Escurecimento só no pé, onde o texto fica. Termina em 64%, bem
          abaixo dos rostos — é isso que deixa o texto legível sem
          apagar ninguém. */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, #16181b 0%, rgba(22,24,27,0.95) 24%, rgba(22,24,27,0.74) 42%, transparent 64%)",
        }}
      />

      {/* Véu curto no topo: o fundo do estúdio é claro e o menu sumia em
          cima dele. Acaba em 14%, antes dos rostos. */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        aria-hidden
        style={{
          background: "linear-gradient(to bottom, rgba(22,24,27,0.78), transparent 100%)",
        }}
      />

      {/* facho de luz que segue o mouse */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        aria-hidden
        style={{
          background:
            "radial-gradient(38rem 26rem at calc(58% + var(--mx, 0) * 9%) calc(28% + var(--my, 0) * 7%), rgba(159,195,189,0.14), transparent 70%)",
        }}
      />

      <div
        className="page-width relative"
        style={{
          transform: "translate3d(calc(var(--mx, 0) * 10px), calc(var(--my, 0) * 7px), 0)",
        }}
      >
        <Reveal>
          <p className="eyebrow">Pop rock • ao vivo</p>
        </Reveal>

        <h1 id="hero-title" className="mt-4">
          <span className="sr-only">Senhor Lakes</span>
          <Reveal delay={80}>
            <span aria-hidden className="hero-title font-display block font-extrabold uppercase">
              <span className="block">Sen</span>
              <span className="ml-[0.28em] block">Hor</span>
              {/* sálvia, como a palavra LAKES na logo */}
              <span
                className="ml-[0.09em] block text-accent"
                style={{ transform: "translateX(calc(var(--mx, 0) * 8px))" }}
              >
                Lakes
              </span>
            </span>
          </Reveal>
        </h1>

        <Reveal delay={160}>
          <p className="mt-6 max-w-md text-lg text-paper/90">
            Energia, presença e som ao vivo. Quatro histórias, um só som.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/albuns"
              onClick={() => {
                primary.burst();
                play("open");
              }}
              className="smoke-glow font-display inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold to-gold-deep px-6 py-3 text-sm font-semibold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.04]"
              style={
                { "--glow-rgb": "201 162 39", "--glow-spark": "#f3dc94" } as React.CSSProperties
              }
            >
              <Glow ripple={primary.ripple} />
              <Play size={15} fill="currentColor" /> Ouvir agora
            </Link>

            <Link
              href="/#agenda"
              onClick={() => {
                secondary.burst();
                play("open");
              }}
              className="smoke-glow font-display inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-6 py-3 text-sm font-semibold tracking-[0.12em] text-paper uppercase backdrop-blur-sm transition hover:scale-[1.04] hover:border-accent hover:text-accent"
            >
              <Glow ripple={secondary.ripple} />
              Ver agenda <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <nav
            className="mt-8 flex flex-wrap gap-x-7 gap-y-3 pr-20 lg:pr-0"
            aria-label="Redes sociais da banda"
          >
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => play("click")}
                className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
