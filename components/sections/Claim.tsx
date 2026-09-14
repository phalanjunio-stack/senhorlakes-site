import Reveal from "@/components/Reveal";
import { albums, band, members, tracks, upcomingEvents } from "@/lib/data";

/**
 * Faixa que quebra o ritmo entre as seções: hachura da logo, o lema
 * da banda em tipo grande e três números para dar peso. Sem isso a
 * página vira uma sequência de blocos iguais no mesmo preto.
 */
export default function Claim() {
  const stats = [
    { value: String(tracks.length), label: "faixas gravadas" },
    { value: String(members.length), label: "na formação" },
    { value: String(albums.length), label: "álbuns e playlists" },
    { value: String(upcomingEvents().length), label: "shows marcados" },
  ];

  return (
    <section className="panel hatch overflow-hidden py-20" aria-label="A banda em números">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 80% at 20% 0%, rgba(201,162,39,0.09), transparent 70%), radial-gradient(50% 70% at 90% 100%, rgba(159,195,189,0.08), transparent 70%)",
        }}
      />

      <div className="page-width relative">
        <Reveal>
          <p className="eyebrow eyebrow-gold">{band.city}</p>
          <p className="font-display mt-5 max-w-3xl text-[clamp(2rem,5.2vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.045em] uppercase">
            Mais que música.
            <br />
            <span className="text-gold">Boas histórias.</span>
          </p>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-[var(--line)] pt-4">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display block text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-extrabold tracking-tight text-accent">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-xs tracking-[0.2em] text-muted uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
