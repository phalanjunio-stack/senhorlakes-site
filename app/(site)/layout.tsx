import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import PlayerBar from "@/components/player/PlayerBar";
import { FxProvider } from "@/components/fx/FxProvider";
import FxControls from "@/components/fx/FxControls";
import { band, members } from "@/lib/data";
import { siteUrl } from "@/lib/site";

/**
 * Tudo que é "o site": cabeçalho, menu, rodapé, player e os efeitos.
 *
 * O painel em /admin fica de fora de propósito — quem está editando não
 * precisa do menu do site em volta, nem do player tocando música por
 * cima do trabalho. Por isso essa camada vive aqui e não na raiz.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: band.name,
    genre: "Pop rock",
    url: siteUrl,
    email: band.email,
    telephone: `+${band.whatsapp}`,
    image: `${siteUrl}/img/capa.jpg`,
    address: { "@type": "PostalAddress", addressLocality: band.city, addressCountry: "BR" },
    sameAs: [band.instagram, band.youtube, band.spotify].filter(Boolean),
    member: members.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-ink"
      >
        Ir para o conteúdo
      </a>

      <FxProvider>
        <PlayerProvider>
          <SiteHeader />
          <div id="conteudo">{children}</div>
          <SiteFooter />
          <PlayerBar />
          <FxControls />
        </PlayerProvider>
      </FxProvider>
    </>
  );
}
