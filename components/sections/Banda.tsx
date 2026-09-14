import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Tilt from "@/components/fx/Tilt";
import { members } from "@/lib/data";

export default function Banda() {
  return (
    <section id="banda" className="page-width scroll-mt-24 py-24" aria-labelledby="banda-title">
      <SectionHeading
        id="banda-title"
        ghost="01"
        index="01 / Formação"
        title="A Banda"
        aside={
          <>
            Cinco histórias.
            <br />
            Um só som.
          </>
        }
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] lg:gap-4">
        {members.map((member, i) => (
          <Reveal as="li" key={member.name} delay={i * 90}>
            <Tilt>
            <article
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
             
            >
              <div
                className="absolute inset-[-3%] bg-no-repeat grayscale brightness-[0.72] contrast-[1.16] transition duration-700 group-hover:scale-[1.06] group-hover:grayscale-0 group-hover:brightness-90"
                style={{
                  backgroundImage: `url(${member.photo ?? "/img/banda.jpg"})`,
                  // 500% deixa cada pessoa ocupando o card inteiro; 15% na
                  // vertical alinha o recorte na altura dos rostos.
                  backgroundSize: member.photo ? "cover" : "500% auto",
                  backgroundPosition: member.photo ? "center" : `${member.framePosition} 15%`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-xl font-extrabold tracking-tight uppercase">
                  {member.name}
                </h3>
                <p className="text-xs text-muted">{member.role}</p>
              </div>
              {/* luz que acompanha o ponteiro */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(14rem 14rem at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(159,195,189,0.18), transparent 62%)",
                }}
              />
            </article>
            </Tilt>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
