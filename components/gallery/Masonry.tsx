"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImagePlus } from "lucide-react";
import Lightbox from "./Lightbox";
import { photos as allPhotos, type Photo } from "@/lib/data";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "shows", label: "Shows" },
  { key: "bastidores", label: "Bastidores" },
  { key: "retratos", label: "Retratos" },
  { key: "estrada", label: "Estrada" },
] as const;

function Tile({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-xl bg-graphite text-left"
      style={{ aspectRatio: photo.ratio }}
      aria-label={photo.caption ? `Abrir foto: ${photo.caption}` : "Abrir foto"}
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={index < 4 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          className={`object-cover transition duration-700 group-hover:scale-[1.04] ${
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          }`}
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center border border-dashed border-[var(--line-strong)] bg-white/[0.03] text-muted transition group-hover:border-accent group-hover:text-accent">
          <span className="flex flex-col items-center gap-1.5 px-3 text-center">
            <ImagePlus size={22} />
            <span className="text-[0.68rem] tracking-[0.18em] uppercase">Espaço reservado</span>
          </span>
        </span>
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      {photo.caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block text-[0.62rem] tracking-[0.24em] text-accent uppercase">
            {photo.category}
          </span>
          <span className="font-display block text-base leading-tight font-bold tracking-tight text-paper uppercase">
            {photo.caption}
          </span>
        </span>
      )}
    </button>
  );
}

export default function Masonry({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<string>("todos");
  const [openAt, setOpenAt] = useState<number | null>(null);

  const visible = useMemo(() => {
    const list = filter === "todos" ? allPhotos : allPhotos.filter((p) => p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit]);

  return (
    <>
      <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filtrar galeria">
        {FILTERS.map((item) => {
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 font-display text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition ${
                active
                  ? "border-accent bg-accent text-ink"
                  : "border-[var(--line)] text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--line-strong)] p-10 text-center text-muted">
          Nenhuma foto nesta categoria ainda.
        </p>
      ) : (
        <div className="masonry columns-2 lg:columns-3 xl:columns-4">
          {visible.map((photo, i) => (
            <Tile key={photo.id} photo={photo} index={i} onOpen={() => setOpenAt(i)} />
          ))}
        </div>
      )}

      {openAt !== null && (
        <Lightbox
          photos={visible}
          index={openAt}
          onClose={() => setOpenAt(null)}
          onIndexChange={setOpenAt}
        />
      )}
    </>
  );
}
