"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import type { Valor } from "./tipos";

/* ──────────────────────────────────────────────────────────
   ESCOLHER UMA FOTO

   A foto é encolhida aqui no navegador, antes de subir. Três motivos, e
   todos importam mais no celular:

     · foto de celular tem 3 a 8MB; subir isso no 4G demora e às vezes
       nem completa
     · o servidor tem um tempo curto de processamento por pedido, e
       converter um arquivo desse tamanho lá não cabe
     · o resultado já sai no formato que o site publica

   O tamanho máximo é o mesmo que o site usa ao publicar
   (scripts/otimizar-imagens.mjs), então o arquivo que chega ao
   repositório já é o arquivo final.
   ────────────────────────────────────────────────────────── */

const LARGURA_MAX = 2000;
const ALTURA_MAX = 2600;
const QUALIDADE = 0.85;

/** Encolhe e converte. Devolve o arquivo pronto para subir. */
async function preparar(arquivo: File): Promise<{ dados: Blob; nome: string }> {
  /* `from-image` respeita a orientação gravada na foto. Sem isso, retrato
     tirado no celular chega deitado — o navegador desenha os pixels crus
     e ignora a etiqueta que diz "isto está de lado". */
  const imagem = await createImageBitmap(arquivo, { imageOrientation: "from-image" });

  const escala = Math.min(LARGURA_MAX / imagem.width, ALTURA_MAX / imagem.height, 1);
  const largura = Math.round(imagem.width * escala);
  const altura = Math.round(imagem.height * escala);

  const tela = document.createElement("canvas");
  tela.width = largura;
  tela.height = altura;
  const pincel = tela.getContext("2d");
  if (!pincel) throw new Error("sem canvas");
  pincel.drawImage(imagem, 0, 0, largura, altura);
  imagem.close();

  const semPonto = arquivo.name.replace(/\.[^.]+$/, "");

  const gerar = (tipo: string) =>
    new Promise<Blob | null>((resolve) => tela.toBlob(resolve, tipo, QUALIDADE));

  /* WebP primeiro: guarda transparência e pesa bem menos. Navegador que
     não sabe gerar WebP devolve nulo aqui — ou devolve PNG fingindo que
     atendeu, daí a conferência do tipo. */
  const webp = await gerar("image/webp");
  if (webp && webp.type === "image/webp") return { dados: webp, nome: `${semPonto}.webp` };

  /* Sem WebP: PNG continua PNG para não perder transparência; o resto
     vira JPEG, que é o certo para fotografia. */
  const ehPng = arquivo.type === "image/png";
  const alternativa = await gerar(ehPng ? "image/png" : "image/jpeg");
  if (!alternativa) throw new Error("não consegui converter");
  return { dados: alternativa, nome: `${semPonto}.${ehPng ? "png" : "jpg"}` };
}

export default function CampoImagem({
  valor,
  aoMudar,
}: {
  valor: Valor;
  aoMudar: (v: Valor) => void;
}) {
  const caminho = typeof valor === "string" ? valor : "";
  const entrada = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function escolher(arquivo: File | undefined) {
    if (!arquivo) return;
    setErro("");
    setEnviando(true);
    try {
      const { dados, nome } = await preparar(arquivo);
      const resposta = await fetch(`/api/imagem?nome=${encodeURIComponent(nome)}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": dados.type },
        body: dados,
      });
      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        throw new Error((corpo as { erro?: string }).erro ?? "falhou");
      }
      const { caminho: novo } = (await resposta.json()) as { caminho: string };
      aoMudar(novo);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "não consegui enviar");
    } finally {
      setEnviando(false);
      /* Limpa a seleção para dar para escolher o mesmo arquivo de novo
         depois de um erro — senão o navegador não dispara o evento. */
      if (entrada.current) entrada.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-[var(--line)] bg-graphite">
          {caminho ? (
            /* eslint-disable-next-line @next/next/no-img-element -- o caminho
               é decidido em tempo de execução, e aqui não há ganho em
               otimização: é miniatura de conferência dentro do painel. */
            <img src={caminho} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus size={20} className="text-muted" />
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              disabled={enviando}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-xs tracking-[0.16em] text-accent uppercase transition hover:border-accent disabled:opacity-50"
            >
              {enviando ? <LoaderCircle className="animate-spin" size={14} /> : <ImagePlus size={14} />}
              {enviando ? "Enviando" : caminho ? "Trocar foto" : "Escolher foto"}
            </button>

            {caminho && !enviando && (
              <button
                type="button"
                onClick={() => aoMudar("")}
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.16em] text-muted uppercase transition hover:text-gold"
              >
                <Trash2 size={13} /> Tirar
              </button>
            )}
          </div>

          {caminho && <p className="truncate text-xs text-muted">{caminho}</p>}
          {erro && (
            <p role="alert" className="text-xs text-gold">
              {erro}
            </p>
          )}
        </div>
      </div>

      <input
        ref={entrada}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => escolher(e.target.files?.[0])}
      />
    </div>
  );
}
