"use client";

import { Pause, Play } from "lucide-react";
import { EqualizerIcon } from "@/components/player/PlayerBar";
import { useFx } from "@/components/fx/FxProvider";
import { usePlayer } from "@/components/player/PlayerProvider";
import { albumTracks, formatTime, type Album } from "@/lib/data";

export default function TrackList({ album }: { album: Album }) {
  const { playAlbum, toggle, current, isPlaying, source } = usePlayer();
  const { play } = useFx();
  const tracks = albumTracks(album);
  const fromThisAlbum = source?.href === `/albuns/${album.slug}`;

  return (
    <ol className="mt-2">
      {tracks.map((track, i) => {
        const isCurrent = fromThisAlbum && current?.slug === track.slug;
        const playingThis = isCurrent && isPlaying;

        return (
          <li key={track.slug}>
            <button
              type="button"
              data-cursor={playingThis ? "PAUSAR" : "PLAY"}
              onClick={() => {
                if (isCurrent) {
                  play(isPlaying ? "drop" : "click");
                  toggle();
                } else {
                  play("click");
                  playAlbum(album, tracks, i);
                }
              }}
              className="group flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.06]"
              aria-label={playingThis ? `Pausar ${track.title}` : `Tocar ${track.title}`}
            >
              <span className="grid w-6 shrink-0 place-items-center">
                {playingThis ? (
                  <>
                    <span className="group-hover:hidden">
                      <EqualizerIcon />
                    </span>
                    <Pause size={15} className="hidden text-paper group-hover:block" fill="currentColor" />
                  </>
                ) : (
                  <>
                    <span
                      className={`font-mono text-xs tabular-nums group-hover:hidden ${
                        isCurrent ? "text-accent" : "text-muted"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Play size={15} className="hidden text-paper group-hover:block" fill="currentColor" />
                  </>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate font-medium ${isCurrent ? "text-accent" : "text-paper"}`}
                >
                  {track.title}
                </span>
                <span className="block truncate text-xs text-muted">Senhor Lakes</span>
              </span>

              <span className="font-mono text-xs text-muted tabular-nums">
                {formatTime(track.duration)}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
