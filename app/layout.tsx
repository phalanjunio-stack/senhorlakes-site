import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import PlayerBar from "@/components/player/PlayerBar";
import { FxProvider } from "@/components/fx/FxProvider";
import FxControls from "@/components/fx/FxControls";
import { band, members } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${band.name} — ${band.tagline}`,
    template: `%s — ${band.name}`,
  },
  description:
    "Senhor Lakes — pop rock ao vivo com energia, presença e repertório para cantar junto. Ouça as gravações, veja a agenda e chame a banda para o seu evento.",
  keywords: ["Senhor Lakes", "banda", "pop rock", "ao vivo", "Sete Lagoas", "Minas Gerais", "show"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: band.name,
    title: `${band.name} — ${band.tagline}`,
    description: "Pop rock ao vivo. Ouça as gravações e veja a agenda de shows.",
    images: [{ url: "/img/capa.jpg", width: 2400, height: 1350, alt: band.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${band.name} — ${band.tagline}`,
    description: "Pop rock ao vivo. Ouça as gravações e veja a agenda de shows.",
    images: ["/img/capa.jpg"],
  },
  icons: { icon: "/img/logo.png", apple: "/img/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#16181b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable}`}>
      <body className="antialiased">
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
      </body>
    </html>
  );
}
