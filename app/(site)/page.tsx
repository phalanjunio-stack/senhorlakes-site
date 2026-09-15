import Hero from "@/components/sections/Hero";
import Banda from "@/components/sections/Banda";
import Agenda from "@/components/sections/Agenda";
import Albuns from "@/components/sections/Albuns";
import Videos from "@/components/sections/Videos";
import Galeria from "@/components/sections/Galeria";
import Claim from "@/components/sections/Claim";
import { siteUrl } from "@/lib/site";
import { upcomingEvents, band } from "@/lib/data";

export default function Home() {
  /* Faz o Google exibir os próximos shows direto no resultado da busca. */
  const eventsJsonLd = upcomingEvents().map((event) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${band.name} em ${event.city}`,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: event.url ?? `${siteUrl}/#agenda`,
    performer: { "@type": "MusicGroup", name: band.name },
    location: {
      "@type": "Place",
      name: event.venue,
      address: { "@type": "PostalAddress", addressLocality: event.city, addressCountry: "BR" },
    },
  }));

  return (
    <main>
      {eventsJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
        />
      )}
      <Hero />
      <Banda />
      <Claim />
      <Agenda />
      <Albuns />
      <Videos />
      <Galeria />
    </main>
  );
}
