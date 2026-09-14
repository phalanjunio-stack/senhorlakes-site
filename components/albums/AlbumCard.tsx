"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import AlbumArt from "@/components/AlbumArt";
import { usePlayer } from "@/components/player/PlayerProvider";
import { albumTracks, type Album } from "@/lib/data";

export default function AlbumCard({ album, priority = false }: { album: Album; priority?: boolean }) {
  const { playAlbum, toggle, isPlaying, source } = usePlayer();
  const tracks = albumTracks(album);
  const isCurrent = source?.href === `/albuns/${album.slug}`;
  const showPause = isCurrent && isPlaying;

  return (
    <article className="group">
      <div className="relative">
        <Link href={`/albuns/${album.slug}`} aria-label={`Abrir ${album.title}`}>
          <AlbumArt
            album={album}
            priority={priority}
            className="aspect-square w-full rounded-xl transition duration-500 group-hover:brightness-110"
          />
        </Link>

        <button
          type="button"
          onClick={() => (isCurrent ? toggle() : playAlbum(album, tracks))}
          className="absolute right-3 bottom-3 grid size-12 translate-y-2 place-items-center rounded-full bg-accent text-ink opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 hover:scale-105"
          aria-label={showPause ? `Pausar ${album.title}` : `Tocar ${album.title}`}
        >
          {showPause ? (
            <Pause size={19} fill="currentColor" />
          ) : (
            <Play size={19} fill="currentColor" className="ml-[2px]" />
          )}
        </button>
      </div>

      <Link href={`/albuns/${album.slug}`} className="mt-3 block">
        <h3
          className={`font-display truncate text-lg leading-tight font-bold tracking-tight uppercase transition ${
            isCurrent ? "text-accent" : "group-hover:text-accent"
          }`}
        >
          {album.title}
        </h3>
        <p className="text-xs text-muted">
          {album.kind} • {album.year} • {tracks.length} faixas
        </p>
      </Link>
    </article>
  );
}
