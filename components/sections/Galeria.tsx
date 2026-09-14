import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Masonry from "@/components/gallery/Masonry";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Galeria() {
  return (
    <section id="galeria" className="page-width scroll-mt-24 py-24" aria-labelledby="galeria-title">
      <SectionHeading
        id="galeria-title"
        ghost="05"
        index="05 / Registros"
        title={
          <>
            Mídia <em className="font-normal text-gold not-italic">/</em> Galeria
          </>
        }
        aside={
          <>
            Uma jornada real.
            <br />
            Vista de perto.
          </>
        }
      />

      <Masonry limit={8} />

      <Reveal className="mt-10">
        <Link
          href="/galeria"
          className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.18em] text-muted uppercase transition hover:text-accent"
        >
          Ver a galeria completa <ArrowUpRight size={15} />
        </Link>
      </Reveal>
    </section>
  );
}
