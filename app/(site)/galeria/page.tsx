import type { Metadata } from "next";
import Masonry from "@/components/gallery/Masonry";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Shows, bastidores e retratos da banda Senhor Lakes.",
  alternates: { canonical: "/galeria" },
};

export default function GaleriaPage() {
  return (
    <main className="page-width pt-32 pb-24">
      <SectionHeading
        index="Registros"
        title="Galeria"
        aside="Clique em qualquer foto para abrir em tela cheia. Use as setas do teclado para navegar."
      />
      <Masonry />
    </main>
  );
}
