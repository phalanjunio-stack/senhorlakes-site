import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/icons/Social";
import Reveal from "@/components/Reveal";
import { band, whatsappLink } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer id="contato" className="scroll-mt-24 border-t border-[var(--line)] pt-20 pb-10">
      <div className="page-width">
        <Reveal className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Contato para shows</p>
            <h2 className="font-display mt-4 text-[clamp(2.6rem,7vw,5rem)] leading-[0.86] font-extrabold tracking-[-0.05em] uppercase">
              Vamos tocar{" "}
              <br />
              <span className="text-accent">juntos?</span>
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Casas de show, festas, eventos corporativos e casamentos em {band.city} e região.
              Responde rápido no WhatsApp.
            </p>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="FALAR"
              className="smoke-glow mt-7 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.04]"
            >
              Chamar no WhatsApp <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="flex flex-col gap-5">
            <a
              href={`mailto:${band.email}`}
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-4 transition hover:text-accent"
            >
              <Mail size={18} className="shrink-0 text-muted transition group-hover:text-accent" />
              <span className="min-w-0 flex-1 truncate">{band.email}</span>
              <ArrowUpRight size={15} className="shrink-0 text-muted" />
            </a>
            <a
              href={`tel:+${band.whatsapp}`}
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-4 transition hover:text-accent"
            >
              <Phone size={18} className="shrink-0 text-muted transition group-hover:text-accent" />
              <span className="flex-1">{band.phoneLabel}</span>
              <ArrowUpRight size={15} className="shrink-0 text-muted" />
            </a>
            <a
              href={band.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-4 transition hover:text-accent"
            >
              <InstagramIcon size={18} className="shrink-0 text-muted transition group-hover:text-accent" />
              <span className="flex-1">Instagram</span>
              <ArrowUpRight size={15} className="shrink-0 text-muted" />
            </a>
            <a
              href={band.youtube}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-4 transition hover:text-accent"
            >
              <YoutubeIcon size={18} className="shrink-0 text-muted transition group-hover:text-accent" />
              <span className="flex-1">YouTube</span>
              <ArrowUpRight size={15} className="shrink-0 text-muted" />
            </a>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--line)] pt-8">
          <Image src="/img/logo.png" alt={band.name} width={60} height={72} className="h-14 w-auto opacity-80" />
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {band.name}. Todos os direitos reservados.
          </p>
          <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">Música move.</p>
        </div>
      </div>
    </footer>
  );
}
