import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BotaoDeLink from "@/components/links/BotaoDeLink";
import TocaAgora from "@/components/links/TocaAgora";
import { albums, band, links, trackBySlug, whatsappLink, type BotaoDeLink as Botao } from "@/lib/data";
import { asset } from "@/lib/site";

/**
 * Endereço para colar na bio do Instagram.
 *
 * Existe em vez de um Linktree da vida por um motivo prático: assim o
 * clique cai no domínio da banda. Quem chega pode seguir para o site, o
 * Google vê o tráfego chegando aqui, e a aparência é da banda e não de
 * um serviço de terceiro com propaganda no rodapé.
 */

/* Botão sem endereço próprio usa o contato oficial da banda — assim
   trocar o WhatsApp em "Banda e contato" arruma os dois lugares. */
function endereco(botao: Botao): string {
  const proprio = botao.url?.trim();
  if (proprio) return proprio;

  if (botao.tipo === "whatsapp") {
    return whatsappLink("Olá! Vim pelo Instagram e quero falar sobre um show do Sr. Lakes.");
  }
  if (botao.tipo === "instagram") return band.instagram ?? "";
  if (botao.tipo === "youtube") return band.youtube ?? "";
  if (botao.tipo === "spotify") return band.spotify ?? "";
  return "";
}

export default function LinksPage() {
  /* Botão sem destino não vira botão: melhor faltar do que levar a
     lugar nenhum na frente de quem acabou de conhecer a banda. */
  const botoes = links.botoes
    .map((botao) => ({ ...botao, destino: endereco(botao) }))
    .filter((botao) => botao.destino);

  const faixa = links.faixa ? trackBySlug(links.faixa) : undefined;
  const capa = albums.find((a) => a.trackSlugs.includes(faixa?.slug ?? ""))?.artwork ?? null;

  return (
    /* `grid place-items-center` centra o bloco quando sobra tela, e o
       `py` segura o respiro quando não sobra — em celular pequeno o
       conteúdo rola normalmente em vez de ficar espremido. */
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-12">
      {/* A arte do celular como fundo, escurecida o bastante para o texto
          ficar legível sem depender da foto que estiver lá. */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        aria-hidden
        style={{ backgroundImage: `url(${asset("/img/capa-mobile-full.webp")})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-ink/85" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(201,162,39,0.18), transparent 70%), linear-gradient(to bottom, transparent 40%, var(--color-ink))",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center">
        <Image
          src="/img/logo.png"
          alt=""
          width={90}
          height={107}
          priority
          className="logo-breathe h-24 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        />

        <h1 className="font-display mt-5 text-center text-[clamp(2.4rem,11vw,3.4rem)] leading-[0.85] font-extrabold tracking-[-0.05em] uppercase">
          {band.name}
        </h1>

        {links.frase && (
          <p className="mt-3 text-center text-sm leading-relaxed text-muted">{links.frase}</p>
        )}

        {faixa && (
          <div className="mt-8 w-full">
            <TocaAgora titulo={faixa.title} src={faixa.src} capa={capa} />
          </div>
        )}

        <nav className="mt-4 flex w-full flex-col gap-3" aria-label="Links do Sr. Lakes">
          {botoes.map((botao) => (
            <BotaoDeLink
              key={`${botao.tipo}-${botao.rotulo}`}
              rotulo={botao.rotulo}
              tipo={botao.tipo}
              url={botao.destino}
              destaque={botao.destaque}
            />
          ))}
        </nav>

        {/* O convite para o site fica por último e discreto: quem veio
            atrás do WhatsApp já resolveu lá em cima; este é para quem
            sobrou curioso. */}
        <Link
          href="/"
          className="font-display mt-9 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-muted uppercase transition hover:text-accent"
        >
          Conhecer o site <ArrowRight size={14} />
        </Link>

        <p className="mt-2 text-[0.68rem] tracking-[0.18em] text-muted/50 uppercase">{band.city}</p>
      </div>
    </main>
  );
}
