"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { YoutubeIcon } from "@/components/icons/Social";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { band, videos, type Video } from "@/lib/data";
import { usePlayer } from "@/components/player/PlayerProvider";

/**
 * Miniatura clicável no lugar do iframe do YouTube. O player só é
 * carregado depois do clique — evita ~1 MB de scripts de terceiros
 * e cookies de rastreamento em quem nunca assiste.
 */
function VideoCard({ video }: { video: Video }) {
  const [active, setActive] = useState(false);
  const player = usePlayer();

  return (
    <article className="group">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-graphite">
        {active ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              // Dois áudios ao mesmo tempo é ruído: pausa a música antes do vídeo.
              if (player.isPlaying) player.toggle();
              setActive(true);
            }}
            className="absolute inset-0 size-full"
            aria-label={`Assistir ${video.title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover brightness-[0.72] transition duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-accent text-ink transition group-hover:scale-110">
                <Play size={24} fill="currentColor" className="ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>
      <h3 className="font-display mt-3 text-lg font-bold tracking-tight uppercase">{video.title}</h3>
      {video.description && <p className="text-sm text-muted">{video.description}</p>}
    </article>
  );
}

export default function Videos() {
  return (
    <section id="videos" className="page-width scroll-mt-24 py-24" aria-labelledby="videos-title">
      <SectionHeading
        id="videos-title"
        index="04 / Vídeos"
        title="No palco"
        aside="Registros ao vivo, clipes e bastidores."
      />

      {videos.length === 0 ? (
        <Reveal className="rounded-xl border border-dashed border-[var(--line-strong)] bg-white/[0.02] p-10 text-center">
          <YoutubeIcon size={30} className="mx-auto text-muted" />
          <p className="mt-4 text-muted">
            Nenhum vídeo publicado ainda. Para adicionar, cole o id do YouTube na lista{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-paper">videos</code> em{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-paper">lib/data.ts</code>.
          </p>
          <a
            href={band.youtube}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.14em] text-accent uppercase"
          >
            Abrir o canal
          </a>
        </Reveal>
      ) : (
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {videos.map((video, i) => (
            <Reveal key={video.youtubeId} delay={i * 90}>
              <VideoCard video={video} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
