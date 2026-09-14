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
  { href: band.instagram, label: "Instagram", Icon: InstagramIcon, cursor: "ABRIR" },
  { href: band.youtube, label: "YouTube", Icon: YoutubeIcon, cursor: "PLAY" },
  { href: whatsappLink(), label: "WhatsApp", Icon: WhatsappIcon, cursor: "FALAR" },
];

export default function Hero() {
  /* Publica --mx e --my (-1 a 1). Cada camada abaixo escolhe o quanto
     e para que lado reagir: a foto vai para o lado oposto ao do mouse,
     o letreiro vai junto, e o texto quase não se mexe. É a diferença
     de velocidade entre elas que cria a profundidade. */
  const ref = useParallax<HTMLElement>();
  const { play } = useFx();
  const primary = useRipple();
  const secondary = useRipple();

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24 pb-14"
      aria-labelledby="hero-title"
    >
      {/* fundo — anda ao contrário do ponteiro */}
      <div
        className="absolute inset-[-4%]"
        style={{
          transform:
            "translate3d(calc(var(--mx, 0) * -26px), calc(var(--my, 0) * -18px), 0) scale(1.03)",
        }}
      >
        <Image
          src="/img/banda.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%] brightness-[0.55] contrast-[1.1] grayscale"
        />
      </div>

      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, #080808 2%, rgba(8,8,8,0.72) 38%, rgba(8,8,8,0.38) 100%)",
        }}
      />

      {/* facho de luz que segue o mouse */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-screen"
        aria-hidden
        style={{
          background:
            "radial-gradient(38rem 26rem at calc(60% + var(--mx, 0) * 9%) calc(30% + var(--my, 0) * 7%), rgba(159,195,189,0.16), transparent 70%)",
        }}
      />

      {/* letreiro de fundo — anda junto com o ponteiro, ao contrário da foto */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -top-2 left-1/2 hidden text-[15vw] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-white/[0.035] uppercase lg:block"
        style={{
          transform:
            "translateX(-50%) translate3d(calc(var(--mx, 0) * 34px), calc(var(--my, 0) * 22px), 0)",
        }}
      >
        Senhor Lakes
      </span>

      <div
        className="page-width relative"
        style={{
          transform: "translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 8px), 0)",
        }}
      >
        <Reveal>
          <p className="eyebrow">Pop rock • ao vivo</p>
        </Reveal>

        <h1 id="hero-title" className="mt-5">
          <span className="sr-only">Senhor Lakes</span>
          <Reveal delay={80}>
            <span
              aria-hidden
              className="font-display block text-[clamp(4.2rem,13vw,10rem)] leading-[0.7] font-extrabold tracking-[-0.075em] uppercase"
            >
              <span className="block">Sen</span>
              <span className="ml-[0.28em] block">Hor</span>
              <span
                className="ml-[0.09em] block text-charcoal"
                style={{ transform: "translateX(calc(var(--mx, 0) * 10px))" }}
              >
                Lakes
              </span>
            </span>
          </Reveal>
        </h1>

        <Reveal delay={160}>
          <p className="mt-7 max-w-md text-lg text-paper/90">
            Energia, presença e som ao vivo. Quatro histórias, um só som.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/albuns"
              onClick={() => {
                primary.burst();
                play("navigate");
              }}
              data-cursor="OUVIR"
              className="smoke-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#c9dedb] to-accent px-6 py-3 font-display text-sm font-semibold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.04]"
            >
              <Glow ripple={primary.ripple} />
              <Play size={15} fill="currentColor" /> Ouvir agora
            </Link>

            <Link
              href="/#agenda"
              onClick={() => {
                secondary.burst();
                play("click");
              }}
              data-cursor="VER"
              className="smoke-glow inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/5 px-6 py-3 font-display text-sm font-semibold tracking-[0.12em] text-paper uppercase transition hover:scale-[1.04] hover:border-accent hover:text-accent"
            >
              <Glow ripple={secondary.ripple} />
              Ver agenda <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-3" aria-label="Redes sociais da banda">
            {socials.map(({ href, label, Icon, cursor }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor={cursor}
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
