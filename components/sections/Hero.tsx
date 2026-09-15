"use client";


import Link from "next/link";
import { ArrowUpRight, ChevronDown, Play } from "lucide-react";
import Reveal from "@/components/Reveal";
import Glow, { useRipple } from "@/components/fx/Glow";
import { useFx } from "@/components/fx/FxProvider";
import { useParallax } from "@/components/fx/useParallax";
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/Social";
import { band, whatsappLink } from "@/lib/data";
import { asset } from "@/lib/site";

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
      {/* No celular a moldura é exata e sem zoom. A arte de celular foi
          feita mais alta que qualquer telefone, então ela cobre a tela
          sobrando em altura — e o object-bottom joga essa sobra para o
          topo, onde só há textura. Os integrantes nunca são cortados.
          No desktop a sobra de 4% e o zoom continuam, porque é o que dá
          folga para o parallax mexer a foto sem mostrar borda. */}
      <div
        className="hero-art absolute inset-0 [--hero-zoom:1] md:inset-[-4%] md:[--hero-zoom:1.03]"
        style={{
          transform:
            "translate3d(calc(var(--mx, 0) * -24px), calc(var(--my, 0) * -16px), 0) scale(var(--hero-zoom))",
        }}
      >
        {/* Duas artes diferentes, não a mesma recortada: a deitada corta
            os integrantes quando a tela é um retângulo em pé. O <picture>
            deixa o navegador baixar só a que ele vai usar — next/image
            não faz troca por tamanho de tela, e como o loader deste
            projeto não otimiza nada, não se perde nada usando <img>. */}

        {/* Camada de baixo: a arte dessaturada. É o que se vê parado. */}
        <picture>
          <source media="(max-width: 767px)" srcSet={asset("/img/capa-mobile-full.webp")} />
          <img
            src={asset("/img/capa.jpg")}
            alt="Os integrantes do Senhor Lakes"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-bottom grayscale contrast-[1.08] brightness-[0.88] md:object-[center_38%]"
          />
        </picture>

        {/* Camada de cima: a mesma arte colorida, recortada por uma
            máscara redonda que segue o cursor. O alt fica vazio porque
            é a mesma imagem da camada de baixo. */}
        <picture>
          <source media="(max-width: 767px)" srcSet={asset("/img/capa-mobile-full.webp")} />
          <img
            src={asset("/img/capa.jpg")}
            alt=""
            aria-hidden
            fetchPriority="high"
            className="spotlight absolute inset-0 size-full object-cover object-bottom md:object-[center_38%]"
          />
        </picture>
      </div>

      {/* Escurecimento só no pé, onde o texto fica. Termina em 64%, bem
          abaixo dos rostos — é isso que deixa o texto legível sem
          apagar ninguém. */}
      {/* No celular a faixa escura é mais curta: com menos texto por cima,
          não precisa subir tanto, e assim sobra mais arte à mostra. */}
      <div
        className="absolute inset-0 md:hidden"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, rgba(22,24,27,0.72) 0%, rgba(22,24,27,0.34) 18%, transparent 34%)",
        }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, #16181b 0%, rgba(22,24,27,0.9) 20%, rgba(22,24,27,0.52) 38%, transparent 60%)",
        }}
      />

      {/* Véu curto no topo, para o menu nunca depender do que estiver
          atrás dele. Acaba antes dos rostos. */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        aria-hidden
        style={{
          background: "linear-gradient(to bottom, rgba(22,24,27,0.62), transparent 100%)",
        }}
      />

      {/* facho de luz que segue o mouse */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
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

        {/* Some no celular: ali a arte é o argumento, e cada linha de
            texto a mais empurra a banda para trás do escurecimento. */}
        <Reveal delay={160} className="hidden md:block">
          <p className="mt-6 max-w-md text-lg text-paper/90">
            Energia, presença e som ao vivo. Cinco histórias, um só som.
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

        {/* Some no celular: as mesmas redes estão no rodapé e em Contato. */}
        <Reveal delay={320} className="hidden md:block">
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

      {/* Indicação de que a página continua. É um link de verdade para
          #banda: funciona sem JavaScript e pega a rolagem suave que o
          globals.css já aplica. O rótulo só aparece no hover para não
          disputar espaço com as redes sociais logo acima. */}
      <a
        href="#banda"
        onClick={() => play("navigate")}
        aria-label="Rolar para a seção A Banda"
        className="group absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
      >
        <span className="font-display text-[10px] font-semibold tracking-[0.2em] text-paper/60 uppercase opacity-0 transition-opacity group-hover:opacity-100">
          Veja mais
        </span>
        <span className="scroll-cue grid size-10 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition group-hover:border-accent group-hover:bg-white/20">
          <ChevronDown size={20} className="text-paper/85 transition group-hover:text-accent" />
        </span>
      </a>
    </section>
  );
}
