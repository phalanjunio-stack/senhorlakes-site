import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { band, config } from "@/lib/data";
import { asset, siteUrl } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-outfit",
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
  icons: { icon: asset("/img/logo.png"), apple: asset("/img/logo.png") },
  /* A verificação do Search Console só aparece quando preenchida no
     painel — uma meta vazia não verifica nada e ainda confunde quem lê
     o código-fonte. */
  ...(config.googleSiteVerification?.trim()
    ? { verification: { google: config.googleSiteVerification.trim() } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#16181b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
