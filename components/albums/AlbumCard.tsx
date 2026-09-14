"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import AlbumArt from "@/components/AlbumArt";
import Glow, { useRipple } from "@/components/fx/Glow";
import Tilt from "@/components/fx/Tilt";
import { useFx } from "@/components/fx/FxProvider";
import { usePlayer } from "@/components/player/PlayerProvider";
import { albumTracks, type Album } from "@/lib/data";
import { hexToRgbTriplet } from "@/lib/color";

export default function AlbumCard({ album, priority = false }: { album: Album; priority?: boolean }) {
  const { playAlbum, toggle, isPlaying, source } = usePlayer();
  const { play } = useFx();
  const { ripple, burst } = useRipple();
  const tracks = albumTracks(album);
  const isCurrent = source?.href === `/albuns/${album.slug}`;
  const showPause = isCurrent && isPlaying;

  return (
    <article className="group">
      <Tilt className="relative" strength={0.8}>
        <Link
          href={`/albuns/${album.slug}`}
          aria-label={`Abrir ${album.title}`}
          data-cursor="ABRIR"
          onClick={() => play("click")}
        >
          <AlbumArt
            album={album}
            priority={priority}
            className="aspect-square w-full rounded-xl transition duration-500 group-hover:brightness-110"
          />
          {/* brilho de vidro que segue o ponteiro dentro do cartão */}
          <span
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
            style={{
              background:
                "radial-gradient(18rem 18rem at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.13), transparent 60%)",
            }}
          />
        </Link>

        <button
          type="button"
          data-cursor={showPause ? "PAUSAR" : "PLAY"}
          onClick={() => {
            burst();
            if (isCurrent) {
              play(isPlaying ? "close" : "open");
              toggle();
            } else {
              play("open");
              playAlbum(album, tracks);
            }
          }}
          className="smoke-glow absolute right-3 bottom-3 grid size-12 translate-y-2 place-items-center rounded-full text-ink opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 hover:scale-105"
          style={
            {
              "--glow-rgb": hexToRgbTriplet(album.accent),
              background: album.accent,
            } as React.CSSProperties
          }
          aria-label={showPause ? `Pausar ${album.title}` : `Tocar ${album.title}`}
        >
          <Glow ripple={ripple} />
          {showPause ? (
            <Pause size={19} fill="currentColor" />
          ) : (
            <Play size={19} fill="currentColor" className="ml-[2px]" />
          )}
        </button>
      </Tilt>

      <Link
        href={`/albuns/${album.slug}`}
        className="mt-3 block"
        onClick={() => play("click")}
        data-cursor="ABRIR"
      >
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
