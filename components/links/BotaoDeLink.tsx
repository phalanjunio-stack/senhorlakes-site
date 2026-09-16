"use client";

import { ArrowUpRight, CalendarDays, CirclePlay, Globe, Link2, Music } from "lucide-react";
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/Social";
import { useFx } from "@/components/fx/FxProvider";

const ICONES: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  whatsapp: WhatsappIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  "youtube-music": CirclePlay,
  spotify: CirclePlay,
  agenda: CalendarDays,
  musica: Music,
  site: Globe,
  link: Link2,
};

/**
 * Um botão da página de links.
 *
 * Alvo grande de propósito: quem chega aqui está com o celular na mão,
 * andando, usando o polegar. Botão apertado é toque errado.
 */
export default function BotaoDeLink({
  rotulo,
  tipo,
  url,
  destaque = false,
}: {
  rotulo: string;
  tipo: string;
  url: string;
  destaque?: boolean;
}) {
  const Icone = ICONES[tipo] ?? Link2;
  const { play } = useFx();

  /* Link para fora abre em aba nova; link do próprio site continua na
     mesma, senão a pessoa acumula abas sem perceber. */
  const externo = /^https?:\/\//.test(url);

  return (
    <a
      href={url}
      {...(externo ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      onClick={() => play("navigate")}
      onPointerEnter={() => play("hover")}
      className={
        destaque
          ? "group flex items-center gap-3 rounded-2xl bg-accent px-5 py-4 text-ink transition active:scale-[0.98]"
          : "group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-4 text-paper backdrop-blur-md transition hover:border-accent/60 hover:bg-white/[0.12] active:scale-[0.98]"
      }
    >
      <Icone size={20} className={destaque ? "shrink-0" : "shrink-0 text-accent"} />
      <span className="font-display flex-1 text-sm font-bold tracking-[0.06em] uppercase">
        {rotulo}
      </span>
      <ArrowUpRight
        size={17}
        className={destaque ? "shrink-0 opacity-70" : "shrink-0 text-muted transition group-hover:text-accent"}
      />
    </a>
  );
}
