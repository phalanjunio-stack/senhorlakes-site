import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AlbumCard from "@/components/albums/AlbumCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { albums } from "@/lib/data";

export default function Albuns() {
  return (
    <section id="albuns" className="page-width scroll-mt-24 py-24" aria-labelledby="albuns-title">
      <SectionHeading
        id="albuns-title"
        index="03 / Gravações"
        title="Ouça a banda"
        aside="Toque direto daqui. O player acompanha você por todas as páginas do site."
      />

      <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
        {albums.slice(0, 4).map((album, i) => (
          <Reveal key={album.slug} delay={i * 80}>
            <AlbumCard album={album} />
          </Reveal>
        ))}
      </div>

      {albums.length > 4 && (
        <Reveal className="mt-10">
          <Link
            href="/albuns"
            className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.18em] text-muted uppercase transition hover:text-accent"
          >
            Ver todos os álbuns <ArrowUpRight size={15} />
          </Link>
        </Reveal>
      )}
    </section>
  );
}
