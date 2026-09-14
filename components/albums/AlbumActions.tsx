"use client";

import { Pause, Play, Shuffle } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { albumTracks, type Album } from "@/lib/data";

export default function AlbumActions({ album }: { album: Album }) {
  const { playAlbum, toggle, isPlaying, source, toggleShuffle, shuffle } = usePlayer();
  const tracks = albumTracks(album);
  const isCurrent = source?.href === `/albuns/${album.slug}`;
  const showPause = isCurrent && isPlaying;

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => (isCurrent ? toggle() : playAlbum(album, tracks))}
        className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-display text-sm font-bold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.03]"
        style={{ background: album.accent }}
      >
        {showPause ? (
          <>
            <Pause size={17} fill="currentColor" /> Pausar
          </>
        ) : (
          <>
            <Play size={17} fill="currentColor" /> Tocar
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          if (!shuffle) toggleShuffle();
          playAlbum(album, tracks, Math.floor(Math.random() * tracks.length));
        }}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/35 px-7 py-3.5 font-display text-sm font-bold tracking-[0.12em] text-paper uppercase transition hover:border-accent hover:text-accent"
      >
        <Shuffle size={16} /> Aleatório
      </button>
    </div>
  );
}
