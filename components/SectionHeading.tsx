import Reveal from "@/components/Reveal";

export default function SectionHeading({
  index,
  title,
  aside,
  id,
  /** alterna a cor do rótulo entre as seções para o site não ficar monocromático */
  tone = "sage",
}: {
  index: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
  tone?: "sage" | "gold";
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 pb-6">
      <div>
        <p className={`eyebrow ${tone === "gold" ? "eyebrow-gold" : ""}`}>{index}</p>
        <h2
          id={id}
          className="font-display mt-3 text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.88] font-extrabold tracking-[-0.045em] uppercase"
        >
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-xs text-sm leading-relaxed text-muted">{aside}</p>}

      {/* filete degradê no lugar da linha cinza — dourado da logo virando sálvia */}
      <span
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            tone === "gold"
              ? "linear-gradient(to right, rgba(201,162,39,0.75), rgba(159,195,189,0.25) 40%, transparent 85%)"
              : "linear-gradient(to right, rgba(159,195,189,0.75), rgba(201,162,39,0.25) 40%, transparent 85%)",
        }}
      />
    </Reveal>
  );
}
