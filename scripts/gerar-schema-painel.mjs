/* ──────────────────────────────────────────────────────────
   O .pages.yml vira o formulário do painel

   Os campos de cada seção já estavam descritos em .pages.yml — rótulo,
   tipo, ajuda, opções de seleção, o que é obrigatório. Escrever tudo de
   novo em React seria manter duas listas iguais, e duas listas iguais
   viram duas listas diferentes na primeira pressa.

   Então o painel lê a mesma descrição. Mexeu num campo lá, mudou aqui.
   ────────────────────────────────────────────────────────── */

import { readFile, writeFile } from "node:fs/promises";
import YAML from "yaml";

const yml = YAML.parse(await readFile(".pages.yml", "utf8"));

const schema = yml.content.map((secao) => ({
  chave: secao.name,
  nome: secao.label,
  arquivo: secao.path,
  campos: secao.fields,
}));

await writeFile("content/painel-schema.json", JSON.stringify(schema, null, 2) + "\n", "utf8");

console.log(
  `Painel: ${schema.length} seções — ${schema.map((s) => s.nome).join(", ")}`,
);
