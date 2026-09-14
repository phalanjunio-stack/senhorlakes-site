import Image from "next/image";
import type { Album } from "@/lib/data";

/** Soma simples do título — mantém a capa gerada igual a cada render. */
function seedFrom(text: string) {
  let seed = 0;
  for (let i = 0; i < text.length; i += 1) seed = (seed * 31 + text.charCodeAt(i)) % 9973;
  return seed;
}

/**
 * Capa do álbum. Se `album.artwork` existir, usa a imagem real.
 * Caso contrário desenha uma capa a partir da cor de acento — assim a
 * biblioteca já fica apresentável antes da arte definitiva existir.
 */
export default function AlbumArt({
  album,
  className = "",
  sizes = "(max-width: 768px) 45vw, 320px",
  priority = false,
}: {
  album: Album;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (album.artwork) {
    return (
      <div className={`relative overflow-hidden bg-graphite ${className}`}>
        <Image
          src={album.artwork}
          alt={`Capa de ${album.title}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const seed = seedFrom(album.slug);
  const rotation = (seed % 40) - 20;
  const bars = Array.from({ length: 13 }, (_, i) => 22 + ((seed >> i) % 9) * 9);

  return (
    <div
      className={`@container relative overflow-hidden bg-graphite ${className}`}
      role="img"
      aria-label={`Capa de ${album.title}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 18% 12%, ${album.accent}38, transparent 62%), linear-gradient(150deg, #101211, #050505)`,
        }}
      />
      <div
        className="absolute -inset-[30%] opacity-25"
        style={{
          transform: `rotate(${rotation}deg)`,
          background: `repeating-linear-gradient(90deg, ${album.accent}00 0 14px, ${album.accent}22 14px 15px)`,
        }}
      />
      {/* onda de áudio estilizada */}
      <div className="absolute inset-x-[14%] bottom-[16%] flex h-[26%] items-end justify-between gap-[2px]">
        {bars.map((height, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-[1px]"
            style={{ height: `${height}%`, background: album.accent, opacity: 0.55 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col justify-start p-[9%]">
        <span
          className="font-display text-[clamp(0.3rem,2.6cqw,0.6rem)] font-semibold tracking-[0.3em] uppercase"
          style={{ color: album.accent }}
        >
          {album.kind}
        </span>
        <span className="font-display mt-1 text-[clamp(0.42rem,8.5cqw,2.1rem)] leading-[0.92] font-extrabold tracking-[-0.03em] text-paper uppercase">
          {album.title}
        </span>
      </div>
    </div>
  );
}
