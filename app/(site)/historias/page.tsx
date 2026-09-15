import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import StoryArticle from "@/components/stories/StoryArticle";
import { stories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Histórias",
  description:
    "De onde vem o nome Senhor Lakes e os casos que ficaram pelo caminho — contados por quem estava lá.",
  alternates: { canonical: "/historias" },
};

export default function HistoriasPage() {
  return (
    <main className="page-width pt-32 pb-24">
      <SectionHeading
        index="Mais que música"
        title="Histórias"
        tone="gold"
        aside="Toda banda tem um repertório. Esta aqui também tem um caderno de histórias — e a primeira é a do próprio nome."
      />

      {stories.length === 0 ? (
        <p className="max-w-xl text-muted">
          Nenhuma história publicada ainda. As próximas aparecem aqui assim que forem escritas no
          painel.
        </p>
      ) : (
        <div className="space-y-16 lg:space-y-24">
          {stories.map((story, i) => (
            <div
              key={story.slug}
              className={i > 0 ? "border-t border-[var(--line)] pt-16 lg:pt-24" : undefined}
            >
              <StoryArticle story={story} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
