/**
 * Faixa de palavras rolando sem parar. O conteúdo é duplicado e a
 * animação desloca exatamente 100% da primeira cópia, então a emenda
 * é invisível e a faixa parece infinita. Para no hover.
 *
 * Fica parada quando o movimento está desligado.
 */
export default function Marquee({
  words,
  duration = 34,
  reverse = false,
  className = "",
}: {
  words: string[];
  /** segundos para uma volta completa — maior = mais lento */
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const row = (
    <div className="marquee__row" aria-hidden>
      {words.map((word, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>{word}</span>
          <i className="size-1.5 shrink-0 rounded-full bg-gold not-italic" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee ${reverse ? "marquee--reverse" : ""} ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {/* a lista real para leitores de tela, uma vez só */}
      <span className="sr-only">{words.join(", ")}</span>
      {row}
      {row}
    </div>
  );
}
