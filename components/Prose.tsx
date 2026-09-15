import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────
   TEXTO CORRIDO DAS HISTÓRIAS

   O painel de administração dá uma caixa de texto só. Para quem
   escreve, aprender uma linguagem de marcação seria um custo alto
   por pouco retorno, então aqui existem exatamente duas regras —
   e as duas são o que a pessoa já faria sem pensar:

     linha em branco          separa um parágrafo do outro
     **entre dois asteriscos** fica em negrito
     > começando com maior-que vira citação em destaque

   É de propósito que não há mais nada. Cada regra nova é uma coisa
   a mais para explicar, e o site não precisa de títulos, listas ou
   links no meio da história.
   ────────────────────────────────────────────────────────── */

/** Quebra o texto nos trechos entre ** ** e devolve os pares já marcados. */
function comNegrito(texto: string): ReactNode[] {
  /* split com grupo de captura devolve [fora, dentro, fora, dentro…],
     então o que está em posição ímpar é o que estava entre asteriscos. */
  return texto.split(/\*\*(.+?)\*\*/g).map((pedaco, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-paper">
        {pedaco}
      </strong>
    ) : (
      pedaco
    ),
  );
}

export default function Prose({ text, className = "" }: { text: string; className?: string }) {
  const blocos = text.trim().split(/\n\s*\n/);

  return (
    <div className={`space-y-6 ${className}`}>
      {blocos.map((bloco, i) => {
        if (bloco.startsWith(">")) {
          /* A citação pode ocupar várias linhas: tira o sinal de cada uma
             e junta, senão o ">" apareceria no meio da frase. */
          const frase = bloco
            .split("\n")
            .map((linha) => linha.replace(/^>\s?/, ""))
            .join(" ")
            .trim();

          return (
            <blockquote key={i} className="my-10 border-l-2 border-gold/60 py-1 pl-6 lg:pl-8">
              <p className="font-display text-[clamp(1.5rem,3.4vw,2.3rem)] leading-[1.15] font-extrabold tracking-[-0.035em] text-paper">
                &ldquo;{comNegrito(frase)}&rdquo;
              </p>
            </blockquote>
          );
        }

        return (
          <p key={i} className="text-[1.05rem] leading-[1.8] text-paper/75">
            {comNegrito(bloco)}
          </p>
        );
      })}
    </div>
  );
}
