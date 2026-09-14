"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import type { Photo } from "@/lib/data";

export default function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const photo = photos[index];

  const go = useCallback(
    (step: number) => {
      const next = (index + step + photos.length) % photos.length;
      onIndexChange(next);
    },
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption ?? "Foto"}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 grid size-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20 lg:left-8"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute right-3 grid size-11 place-items-center rounded-full bg-white/10 text-paper transition hover:bg-white/20 lg:right-8"
            aria-label="Próxima foto"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <figure
        className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            width={1600}
            height={Math.round(1600 / photo.ratio)}
            sizes="90vw"
            className="max-h-[78vh] w-auto rounded-lg object-contain"
            priority
          />
        ) : (
          <div className="grid aspect-[3/2] w-full max-w-2xl place-items-center rounded-lg border border-dashed border-[var(--line-strong)] bg-white/[0.03] text-muted">
            <span className="flex flex-col items-center gap-2 text-sm">
              <ImageOff size={26} /> Espaço reservado
            </span>
          </div>
        )}

        <figcaption className="text-center">
          <p className="font-display text-lg font-bold tracking-tight uppercase">{photo.caption}</p>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">
            {photo.category} • {index + 1} / {photos.length}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
