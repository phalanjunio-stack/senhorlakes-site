import Reveal from "@/components/Reveal";

export default function SectionHeading({
  index,
  title,
  aside,
  id,
}: {
  index: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--line)] pb-6">
      <div>
        <p className="eyebrow">{index}</p>
        <h2
          id={id}
          className="font-display mt-3 text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.88] font-extrabold tracking-[-0.045em] uppercase"
        >
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-xs text-sm leading-relaxed text-muted">{aside}</p>}
    </Reveal>
  );
}
