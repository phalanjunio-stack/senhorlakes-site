import SectionHeading from "@/components/SectionHeading";
import MemberGrid from "@/components/band/MemberGrid";

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

      <MemberGrid />
    </section>
  );
}
