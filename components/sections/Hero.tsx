import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import Reveal from "@/components/Reveal";
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/Social";
import { band, whatsappLink } from "@/lib/data";

const socials = [
  { href: band.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: band.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: whatsappLink(), label: "WhatsApp", Icon: WhatsappIcon },
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24 pb-14"
      aria-labelledby="hero-title"
    >
      <Image
        src="/img/banda.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_28%] brightness-[0.55] contrast-[1.1] grayscale"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, #080808 2%, rgba(8,8,8,0.72) 38%, rgba(8,8,8,0.38) 100%)",
        }}
      />

      {/* marca d'água tipográfica, como no layout original */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -top-2 left-1/2 hidden -translate-x-1/2 text-[15vw] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-white/[0.025] uppercase lg:block"
      >
        Senhor Lakes
      </span>

      <div className="page-width relative">
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
              <span className="ml-[0.09em] block text-charcoal">Lakes</span>
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#c9dedb] to-accent px-6 py-3 font-display text-sm font-semibold tracking-[0.12em] text-ink uppercase transition hover:from-charcoal hover:to-charcoal hover:text-paper"
            >
              <Play size={15} fill="currentColor" /> Ouvir agora
            </Link>
            <Link
              href="/#agenda"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/5 px-6 py-3 font-display text-sm font-semibold tracking-[0.12em] text-paper uppercase transition hover:border-accent hover:text-accent"
            >
              Ver agenda <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-3" aria-label="Redes sociais da banda">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
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
