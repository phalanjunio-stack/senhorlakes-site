import { ArrowUpRight, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { upcomingEvents, whatsappLink } from "@/lib/data";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function parts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { day: String(day).padStart(2, "0"), month: MONTHS[month - 1], year };
}

export default function Agenda() {
  const list = upcomingEvents();

  return (
    <section id="agenda" className="page-width scroll-mt-24 py-24" aria-labelledby="agenda-title">
      <SectionHeading
        id="agenda-title"
        tone="gold"
        ghost="02"
        index="02 / Próximos shows"
        title="Agenda"
        aside={
          <>
            Novos lugares.
            <br />
            Mesma energia.
          </>
        }
      />

      {list.length === 0 ? (
        <Reveal className="rounded-xl border border-[var(--line)] bg-white/[0.02] p-10 text-center">
          <p className="text-muted">
            Nenhuma data confirmada no momento — mas a agenda abre rápido.
          </p>
          <a
            href={whatsappLink("Olá! Quero saber das próximas datas do Senhor Lakes.")}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.14em] text-accent uppercase"
          >
            Chamar no WhatsApp <ArrowUpRight size={15} />
          </a>
        </Reveal>
      ) : (
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {list.map((event, i) => {
            const { day, month, year } = parts(event.date);
            return (
              <Reveal as="li" key={`${event.date}-${event.venue}`} delay={i * 80}>
                <a
                  href={event.url ?? whatsappLink(`Olá! Quero detalhes do show em ${event.city}.`)}
                  target={event.url ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  className="gig group relative isolate flex flex-wrap items-center gap-x-8 gap-y-3 overflow-hidden px-4 py-8"
                >
                  <time
                    dateTime={event.date}
                    className="font-display flex shrink-0 items-baseline gap-2 border-r border-[var(--line)] pr-8"
                  >
                    <strong className="inline-block text-5xl font-extrabold tracking-tight text-gold transition-transform duration-500 group-hover:scale-110">
                      {day}
                    </strong>
                    <span className="text-sm tracking-[0.2em] text-muted uppercase">
                      {month} {year}
                    </span>
                  </time>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none font-extrabold tracking-[-0.02em] uppercase transition-colors duration-300 group-hover:text-gold">
                      {event.city}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin size={13} className="text-accent" /> {event.venue}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 font-display text-xs font-semibold tracking-[0.18em] text-muted uppercase transition duration-300 group-hover:border-gold group-hover:text-gold">
                    Detalhes
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </ul>
      )}
    </section>
  );
}
