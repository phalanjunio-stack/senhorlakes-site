import type { Metadata } from "next";
import { FxProvider } from "@/components/fx/FxProvider";
import FxControls from "@/components/fx/FxControls";
import { band } from "@/lib/data";

export const metadata: Metadata = {
  title: "Links",
  description: `${band.name} — WhatsApp, Instagram, YouTube, agenda e músicas num lugar só.`,
  alternates: { canonical: "/links" },
  /* Fora do Google de propósito. Esta página é funil, não conteúdo: o
     trabalho dela é receber quem veio do Instagram e empurrar para o
     site. Indexada, competiria com a página inicial pelo nome da banda
     oferecendo bem menos. */
  robots: { index: false, follow: true },
};

/**
 * A página de links não usa o cabeçalho nem o rodapé do site — menu em
 * cima de uma página que é só botão só rouba o toque.
 *
 * Mas carrega o FxProvider: é ele que dá o som dos botões, e é ele que
 * dá o controle de desligar. Som sem botão de mudo é armadilha.
 */
export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <FxProvider>
      {children}
      <FxControls />
    </FxProvider>
  );
}
