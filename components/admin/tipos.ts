/** Descrição de um campo, vinda do .pages.yml via scripts/gerar-schema-painel.mjs. */
export type CampoSchema = {
  name: string;
  label: string;
  type: "string" | "text" | "number" | "date" | "select" | "image" | "object";
  list?: boolean;
  required?: boolean;
  description?: string;
  options?: { values?: Array<string | { value: string; label: string }>; format?: string };
  fields?: CampoSchema[];
};

export type SecaoSchema = {
  chave: string;
  nome: string;
  arquivo: string;
  campos: CampoSchema[];
};

/** O conteúdo é JSON livre: cada seção tem o formato que o schema descreve. */
export type Valor = unknown;
export type Registro = Record<string, Valor>;

/** Um campo de seleção pode listar textos soltos ou pares valor/rótulo. */
export function opcoes(campo: CampoSchema): Array<{ value: string; label: string }> {
  return (campo.options?.values ?? []).map((v) =>
    typeof v === "string" ? { value: v, label: v } : v,
  );
}

/** Texto curto que identifica um item dentro de uma lista, para o cabeçalho do cartão. */
export function resumo(campo: CampoSchema, item: Registro, indice: number): string {
  const preferidos = ["title", "name", "label", "city", "venue", "slug", "id"];
  for (const chave of preferidos) {
    const valor = item[chave];
    if (typeof valor === "string" && valor.trim()) return valor;
  }
  for (const sub of campo.fields ?? []) {
    const valor = item[sub.name];
    if (typeof valor === "string" && valor.trim()) return valor;
  }
  return `Item ${indice + 1}`;
}
