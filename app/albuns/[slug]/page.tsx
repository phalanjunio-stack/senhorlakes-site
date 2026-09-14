import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AlbumArt from "@/components/AlbumArt";
import AlbumActions from "@/components/albums/AlbumActions";
import TrackList from "@/components/albums/TrackList";
import { albums, albumBySlug, albumDuration, albumTracks, band, formatLongDuration } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const album = albumBySlug(slug);
  if (!album) return { title: "Álbum não encontrado" };
  return {
    title: album.title,
    description: album.description,
    alternates: { canonical: `/albuns/${album.slug}` },
    openGraph: { title: `${album.title} — ${band.name}`, description: album.description },
  };
}

export default async function AlbumPage({ params }: Params) {
  const { slug } = await params;
  const album = albumBySlug(slug);
  if (!album) notFound();

  const tracks = albumTracks(album);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: album.title,
    byArtist: { "@type": "MusicGroup", name: band.name },
    datePublished: String(album.year),
    numTracks: tracks.length,
    track: tracks.map((track, i) => ({
      "@type": "MusicRecording",
      position: i + 1,
      name: track.title,
      duration: `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`,
    })),
  };

  return (
    <main className="relative pt-24 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        aria-hidden
        style={{
          background: `linear-gradient(to bottom, ${album.accent}2e, transparent 72%)`,
        }}
      />

      <div className="page-width relative">
        <Link
          href="/albuns"
          className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-paper"
        >
          <ChevronLeft size={16} /> Álbuns
        </Link>

        <header className="mt-8 flex flex-col gap-8 md:flex-row md:items-end">
          <AlbumArt
            album={album}
            priority
            sizes="(max-width: 768px) 70vw, 288px"
            className="aspect-square w-52 shrink-0 rounded-xl shadow-2xl md:w-72"
          />

          <div className="min-w-0">
            <p className="eyebrow">{album.kind}</p>
            <h1 className="font-display mt-3 text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.86] font-extrabold tracking-[-0.05em] uppercase">
              {album.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{album.description}</p>
            <p className="mt-3 text-sm text-muted">
              <span className="font-semibold text-paper">{band.name}</span> • {album.year} •{" "}
              {tracks.length} faixas • {formatLongDuration(albumDuration(album))}
            </p>
            <AlbumActions album={album} />
          </div>
        </header>

        <section className="mt-14" aria-label="Faixas">
          <div className="flex items-center gap-4 border-b border-[var(--line)] px-3 pb-2 font-display text-[0.68rem] tracking-[0.2em] text-muted uppercase">
            <span className="w-6 text-center">#</span>
            <span className="flex-1">Faixa</span>
            <span>Duração</span>
          </div>
          <TrackList album={album} />
        </section>
      </div>
    </main>
  );
}
