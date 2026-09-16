"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import CampoImagem from "./CampoImagem";
import { opcoes, resumo, type CampoSchema, type Registro, type Valor } from "./tipos";

/* ──────────────────────────────────────────────────────────
   UM CAMPO DO PAINEL

   Desenha o campo a partir da descrição dele. Texto curto vira uma
   linha, texto longo vira caixa, seleção vira lista, e "object com
   list" vira uma pilha de cartões que dá para somar, apagar e trocar
   de ordem.
   ────────────────────────────────────────────────────────── */

const entrada =
  "w-full rounded-lg border border-[var(--line)] bg-graphite px-3.5 py-2.5 text-paper outline-none focus:border-accent";

function Rotulo({ campo }: { campo: CampoSchema }) {
  return (
    <>
      <span className="text-xs tracking-[0.16em] text-muted uppercase">
        {campo.label}
        {campo.required && <span className="ml-1 text-gold">*</span>}
      </span>
      {campo.description && (
        <span className="text-xs leading-relaxed text-muted/80">{campo.description}</span>
      )}
    </>
  );
}

/** Um valor simples: texto, número, data, seleção ou caminho de imagem. */
function CampoSimples({
  campo,
  valor,
  aoMudar,
}: {
  campo: CampoSchema;
  valor: Valor;
  aoMudar: (v: Valor) => void;
}) {
  const texto = typeof valor === "string" || typeof valor === "number" ? String(valor) : "";

  if (campo.type === "image") {
    return <CampoImagem valor={valor} aoMudar={aoMudar} />;
  }

  if (campo.type === "boolean") {
    return (
      /* Sem <label> aqui: este campo já é desenhado dentro de um, e
         <label> dentro de <label> é inválido — o clique passa a valer
         para o de fora e o leitor de tela anuncia errado. */
      <div className="flex w-fit items-center gap-2.5">
        <input
          type="checkbox"
          checked={valor === true}
          onChange={(e) => aoMudar(e.target.checked)}
          className="size-4 accent-[var(--color-accent)]"
        />
        <span className="text-sm text-muted">{valor === true ? "Sim" : "Não"}</span>
      </div>
    );
  }

  if (campo.type === "text") {
    /* História e biografia são textos longos de verdade; os outros
       campos de texto do site cabem em quatro linhas. */
    const alto = campo.name === "body" || campo.name === "story";
    return (
      <textarea
        value={texto}
        onChange={(e) => aoMudar(e.target.value)}
        rows={alto ? 14 : 4}
        className={`${entrada} resize-y leading-relaxed`}
      />
    );
  }

  if (campo.type === "select") {
    return (
      <select value={texto} onChange={(e) => aoMudar(e.target.value)} className={entrada}>
        <option value="">—</option>
        {opcoes(campo).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (campo.type === "number") {
    return (
      <input
        type="number"
        value={texto}
        onChange={(e) => aoMudar(e.target.value === "" ? "" : Number(e.target.value))}
        className={entrada}
      />
    );
  }

  return (
    <input
      type={campo.type === "date" ? "date" : "text"}
      value={texto}
      onChange={(e) => aoMudar(e.target.value)}
      className={entrada}
    />
  );
}

/** Lista de textos soltos — os códigos das faixas de um álbum, por exemplo. */
function ListaDeTextos({
  campo,
  valor,
  aoMudar,
}: {
  campo: CampoSchema;
  valor: Valor;
  aoMudar: (v: Valor) => void;
}) {
  const itens = Array.isArray(valor) ? (valor as string[]) : [];
  const trocar = (i: number, v: string) => aoMudar(itens.map((x, j) => (j === i ? v : x)));

  return (
    <div className="flex flex-col gap-2">
      {itens.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item ?? ""} onChange={(e) => trocar(i, e.target.value)} className={entrada} />
          <button
            type="button"
            onClick={() => aoMudar(itens.filter((_, j) => j !== i))}
            aria-label={`Remover item ${i + 1} de ${campo.label}`}
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-[var(--line)] text-muted transition hover:border-gold hover:text-gold"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => aoMudar([...itens, ""])}
        className="inline-flex w-fit items-center gap-1.5 text-xs tracking-[0.16em] text-accent uppercase transition hover:text-paper"
      >
        <Plus size={14} /> Adicionar
      </button>
    </div>
  );
}

/** Pilha de cartões: cada um é um show, uma foto, uma história. */
function ListaDeCartoes({
  campo,
  valor,
  aoMudar,
}: {
  campo: CampoSchema;
  valor: Valor;
  aoMudar: (v: Valor) => void;
}) {
  const itens = Array.isArray(valor) ? (valor as Registro[]) : [];

  const trocarItem = (i: number, item: Registro) =>
    aoMudar(itens.map((x, j) => (j === i ? item : x)));

  const mover = (i: number, passo: number) => {
    const destino = i + passo;
    if (destino < 0 || destino >= itens.length) return;
    const copia = [...itens];
    [copia[i], copia[destino]] = [copia[destino], copia[i]];
    aoMudar(copia);
  };

  return (
    <div className="flex flex-col gap-4">
      {itens.map((item, i) => (
        <div key={i} className="rounded-xl border border-[var(--line)] bg-graphite/60 p-4 lg:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
            <p className="font-display truncate text-sm font-bold tracking-tight text-paper uppercase">
              {resumo(campo, item, i)}
            </p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                aria-label="Subir"
                className="grid size-8 place-items-center rounded-md text-muted transition hover:text-accent disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === itens.length - 1}
                aria-label="Descer"
                className="grid size-8 place-items-center rounded-md text-muted transition hover:text-accent disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => aoMudar(itens.filter((_, j) => j !== i))}
                aria-label="Apagar"
                className="grid size-8 place-items-center rounded-md text-muted transition hover:text-gold"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {(campo.fields ?? []).map((sub) => (
              <Campo
                key={sub.name}
                campo={sub}
                valor={item[sub.name]}
                aoMudar={(v) => trocarItem(i, { ...item, [sub.name]: v })}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => aoMudar([...itens, {}])}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 text-xs tracking-[0.16em] text-accent uppercase transition hover:border-accent"
      >
        <Plus size={14} /> Adicionar {campo.label.toLowerCase()}
      </button>
    </div>
  );
}

export default function Campo({
  campo,
  valor,
  aoMudar,
}: {
  campo: CampoSchema;
  valor: Valor;
  aoMudar: (v: Valor) => void;
}) {
  /* Lista não vai dentro de <label>: um rótulo que embrulha vinte
     campos faz o leitor de tela anunciar tudo de uma vez quando a
     pessoa chega em qualquer um deles. */
  if (campo.list) {
    return (
      <div className="flex flex-col gap-2">
        <Rotulo campo={campo} />
        {campo.type === "object" ? (
          <ListaDeCartoes campo={campo} valor={valor} aoMudar={aoMudar} />
        ) : (
          <ListaDeTextos campo={campo} valor={valor} aoMudar={aoMudar} />
        )}
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-2">
      <Rotulo campo={campo} />
      <CampoSimples campo={campo} valor={valor} aoMudar={aoMudar} />
    </label>
  );
}
