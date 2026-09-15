import Image from "next/image";
import { ImagePlus } from "lucide-react";
import Reveal from "@/components/Reveal";
import Prose from "@/components/Prose";
import type { Story } from "@/lib/data";

/**
 * Uma história: chapéu, título, linha de apoio, foto e texto.
 *
 * A foto fica numa coluna estreita ao lado do texto no desktop e acima
 * dele no celular. Estreita de propósito: as fotos que chegam aqui vêm
 * de celular, em pé, e uma dessas ocupando a largura da página vira uma
 * parede — a pessoa rola meia tela antes de chegar na primeira linha.
 */
export default function StoryArticle({ story }: { story: Story }) {
  return (
    <article id={story.slug} className="scroll-mt-28">
      <Reveal>
        {story.kicker && <p className="eyebrow eyebrow-gold">{story.kicker}</p>}
        <h2 className="font-display mt-4 text-[clamp(2.1rem,5.2vw,3.6rem)] leading-[0.92] font-extrabold tracking-[-0.045em] uppercase">
          {story.title}
        </h2>
        {story.lead && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{story.lead}</p>
        )}
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <figure className="w-full max-w-[15rem] lg:max-w-none">
            {/* A proporção vem do conteúdo, então o espaço já nasce com o
                tamanho certo: a foto entra sem empurrar o texto para baixo. */}
            <div
              className="relative w-full overflow-hidden rounded-xl bg-graphite"
              style={{ aspectRatio: story.ratio }}
            >
              {story.photo ? (
                <Image
                  src={story.photo}
                  alt={story.alt ?? ""}
                  fill
                  sizes="(max-width: 1024px) 60vw, 18rem"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center border border-dashed border-[var(--line-strong)] bg-white/[0.03] text-muted">
                  <span className="flex flex-col items-center gap-1.5 px-3 text-center">
                    <ImagePlus size={22} />
                    <span className="text-[0.68rem] tracking-[0.18em] uppercase">
                      Espaço reservado
                    </span>
                  </span>
                </span>
              )}
            </div>
            {story.caption && (
              <figcaption className="mt-3 text-xs leading-relaxed text-muted">
                {story.caption}
              </figcaption>
            )}
          </figure>
        </Reveal>

        <Reveal delay={120}>
          <Prose text={story.body} className="max-w-2xl" />
        </Reveal>
      </div>
    </article>
  );
}
