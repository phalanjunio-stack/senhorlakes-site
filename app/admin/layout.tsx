import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel",
  /* O painel não é conteúdo: fora do Google, fora do sitemap. Indexar
     uma tela de login não traz ninguém e ainda mostra a porta. */
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
