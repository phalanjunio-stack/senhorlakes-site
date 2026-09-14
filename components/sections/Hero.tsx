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
 * Topo em duas colunas: texto de um lado, foto do outro.
 *
 * A versão anterior jogava o título por cima da foto, e as duas coisas
 * disputavam o mesmo espaço: para o texto ficar legível a foto tinha de
 * escurecer, e escurecendo ninguém enxergava a banda. Com as colunas
 * separadas o texto ganha fundo próprio e a foto pode ficar clara e
 * colorida — que é o ponto dela.
 */
export default function Hero() {
  /* Publica --mx e --my (-1 a 1): a foto se move ao contrário do
     ponteiro dentro do próprio quadro e o letreiro de fundo vai junto
     com ele. A diferença de velocidade é o que cria a profundidade. */
  const ref = useParallax<HTMLElement>();
  const { play } = useFx();
  const primary = useRipple();
  const secondary = useRipple();

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative overflow-hidden pt-24 pb-20 lg:pb-28"
      aria-labelledby="hero-title"
    >
      {/* clarões da marca atrás da coluna de texto */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(45rem 32rem at 12% 32%, rgba(159,195,189,0.10), transparent 70%), radial-gradient(38rem 28rem at 4% 82%, rgba(201,162,39,0.07), transparent 70%)",
        }}
      />

      {/* letreiro de fundo — acompanha o ponteiro */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -top-4 left-1/2 hidden text-[13vw] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-white/[0.03] uppercase lg:block"
        style={{
          transform:
            "translateX(-50%) translate3d(calc(var(--mx, 0) * 30px), calc(var(--my, 0) * 20px), 0)",
        }}
      >
        Senhor Lakes
      </span>

      <div className="page-width relative grid items-center gap-10 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        {/* ── Foto ── */}
        <div className="order-1 lg:order-2">
          <Reveal>
            {/* A foto é 3:2. A moldura usa a MESMA proporção de propósito:
                qualquer outra corta gente das pontas — num recorte em pé,
                os dois das extremidades somem. */}
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-[var(--line)]">
              <div
                className="absolute inset-[-5%]"
                style={{
                  transform:
                    "translate3d(calc(var(--mx, 0) * -22px), calc(var(--my, 0) * -16px), 0) scale(1.04)",
                }}
              >
                <Image
                  src="/img/banda.jpg"
                  alt="Os integrantes do Senhor Lakes"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center brightness-[0.96] contrast-[1.04] saturate-[0.9]"
                />
              </div>

              {/* vinheta leve só nas bordas, para a foto assentar no fundo escuro */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,8,8,0.5), transparent 30%), linear-gradient(to right, rgba(8,8,8,0.3), transparent 20%)",
                }}
              />
            </div>
          </Reveal>
        </div>

        {/* ── Texto ── */}
        <div
          className="order-2 lg:order-1"
          style={{
            transform: "translate3d(calc(var(--mx, 0) * 8px), calc(var(--my, 0) * 6px), 0)",
          }}
        >
          <Reveal>
            <p className="eyebrow">Pop rock • ao vivo</p>
          </Reveal>

          <h1 id="hero-title" className="mt-5">
            <span className="sr-only">Senhor Lakes</span>
            <Reveal delay={80}>
              <span aria-hidden className="hero-title font-display block font-extrabold uppercase">
                <span className="block">Sen</span>
                <span className="ml-[0.28em] block">Hor</span>
                {/* sálvia, como a palavra LAKES na logo */}
                <span className="ml-[0.09em] block text-accent">Lakes</span>
              </span>
            </Reveal>
          </h1>

          <Reveal delay={160}>
            <p className="mt-7 max-w-md text-lg text-paper/85">
              Energia, presença e som ao vivo. Quatro histórias, um só som.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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
                className="smoke-glow font-display inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/5 px-6 py-3 text-sm font-semibold tracking-[0.12em] text-paper uppercase transition hover:scale-[1.04] hover:border-accent hover:text-accent"
              >
                <Glow ripple={secondary.ripple} />
                Ver agenda <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <nav
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3"
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
      </div>
    </section>
  );
}
