"use client";

import { Pause, Play, Shuffle } from "lucide-react";
import Glow, { useRipple } from "@/components/fx/Glow";
import { useFx } from "@/components/fx/FxProvider";
import { usePlayer } from "@/components/player/PlayerProvider";
import { albumTracks, type Album } from "@/lib/data";
import { hexToRgbTriplet } from "@/lib/color";

export default function AlbumActions({ album }: { album: Album }) {
  const { playAlbum, toggle, isPlaying, source, toggleShuffle, shuffle } = usePlayer();
  const { play } = useFx();
  const main = useRipple();
  const random = useRipple();
  const tracks = albumTracks(album);
  const isCurrent = source?.href === `/albuns/${album.slug}`;
  const showPause = isCurrent && isPlaying;
  const glow = { "--glow-rgb": hexToRgbTriplet(album.accent) } as React.CSSProperties;

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <button
        type="button"
        data-cursor={showPause ? "PAUSAR" : "PLAY"}
        onClick={() => {
          main.burst();
          if (isCurrent) {
            play(isPlaying ? "close" : "open");
            toggle();
          } else {
            play("open");
            playAlbum(album, tracks);
          }
        }}
        className="smoke-glow inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-display text-sm font-bold tracking-[0.12em] text-ink uppercase transition hover:scale-[1.04]"
        style={{ ...glow, background: album.accent }}
      >
        <Glow ripple={main.ripple} />
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
        data-cursor="MISTURAR"
        onClick={() => {
          random.burst();
          play("chatOpen");
          if (!shuffle) toggleShuffle();
          playAlbum(album, tracks, Math.floor(Math.random() * tracks.length));
        }}
        className="smoke-glow inline-flex items-center gap-2.5 rounded-full border border-white/35 px-7 py-3.5 font-display text-sm font-bold tracking-[0.12em] text-paper uppercase transition hover:scale-[1.04] hover:border-accent hover:text-accent"
        style={glow}
      >
        <Glow ripple={random.ripple} />
        <Shuffle size={16} /> Aleatório
      </button>
    </div>
  );
}
