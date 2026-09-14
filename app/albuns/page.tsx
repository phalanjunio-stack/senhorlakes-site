import type { Metadata } from "next";
import AlbumCard from "@/components/albums/AlbumCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { albums } from "@/lib/data";

export const metadata: Metadata = {
  title: "Álbuns",
  description:
    "Ouça os álbuns e playlists do Senhor Lakes direto do site — pop rock ao vivo, gravado do jeito que soa no palco.",
  alternates: { canonical: "/albuns" },
};

export default function AlbunsPage() {
  return (
    <main className="page-width pt-32 pb-24">
      <SectionHeading
        index="Biblioteca"
        title="Álbuns"
        aside="Clique numa capa para abrir a lista de faixas. O player continua tocando enquanto você navega pelo site."
      />

      <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {albums.map((album, i) => (
          <Reveal key={album.slug} delay={i * 70}>
            <AlbumCard album={album} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
