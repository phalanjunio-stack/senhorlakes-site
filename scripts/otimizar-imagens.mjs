/* ──────────────────────────────────────────────────────────
   OTIMIZAÇÃO DAS IMAGENS PUBLICADAS

   Roda depois do `next build`, em cima da pasta `out`.

   Por que isto existe: este site é estático e não tem otimizador de
   imagem. O `lib/imageLoader.ts` recebe largura e qualidade e ignora as
   duas — ele só conserta o caminho do arquivo. Ou seja, a foto que
   alguém sobe pelo painel é exatamente a que o visitante baixa, no
   tamanho original, inclusive para a miniatura de 48px do player.
   Foto de celular tem 3 a 8MB. Dez delas na galeria e a página fica
   impossível no 4G — e site lento é coisa que o Google mede.

   A regra é: o repositório guarda o original em qualidade cheia, a
   pasta publicada leva a versão enxuta. Nada de nome de arquivo
   mudando, nada de robô commitando por cima do trabalho de ninguém.

   Lê sempre de `public/`, nunca de `out/`: assim a compressão parte do
   original toda vez e a imagem não vai perdendo qualidade a cada build.
   ────────────────────────────────────────────────────────── */

import { readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ORIGEM = "public";
const PUBLICADA = "out";

/* Dois tetos, não um. Limitar só o "lado maior" estragava a capa do
   celular: ela é 1200x2600 (alta, não larga), e cortar o lado maior
   para 2000 derrubava a largura para 923px — justo a primeira imagem
   que alguém vê no telefone, e justo onde a tela pede uns 1300px de
   verdade. Aqui a imagem cabe dentro da caixa mantendo a proporção:
   larga encosta na largura, alta encosta na altura. */
const LARGURA_MAX = 2000;
const ALTURA_MAX = 2600;

/* A logo é desenho de cor chapada, não fotografia: 800px sobram para o
   maior uso dela (a arte de 512px que aparece na tela de bloqueio do
   celular). No cabeçalho ela tem 64px de altura. */
const TETO_DESENHO = 800;

const EXTENSOES = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* imagens(pasta) {
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) yield* imagens(caminho);
    else if (EXTENSOES.has(path.extname(item.name).toLowerCase())) yield caminho;
  }
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

const { default: sharp } = await import("sharp").catch(() => ({ default: null }));

if (!sharp) {
  /* Falhar aqui derrubaria a publicação inteira por causa de uma
     otimização. O site no ar vale mais que o peso das imagens — mas o
     aviso é barulhento de propósito, para ninguém descobrir meses
     depois que parou de otimizar. */
  console.warn("\n⚠  sharp indisponível — imagens publicadas SEM otimizar.\n");
  process.exit(0);
}

if (!existsSync(PUBLICADA)) {
  console.warn(`⚠  pasta "${PUBLICADA}" não existe — rode depois do build.`);
  process.exit(0);
}

let totalAntes = 0;
let totalDepois = 0;
const linhas = [];

for await (const original of imagens(ORIGEM)) {
  const destino = path.join(PUBLICADA, path.relative(ORIGEM, original));
  if (!existsSync(destino)) continue;

  const antes = (await stat(destino)).size;
  const meta = await sharp(original).metadata();
  const desenho = meta.format === "png" && meta.hasAlpha;

  let img = sharp(original).resize({
    width: desenho ? TETO_DESENHO : LARGURA_MAX,
    height: desenho ? TETO_DESENHO : ALTURA_MAX,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (meta.format === "png") img = img.png({ compressionLevel: 9, palette: desenho });
  else if (meta.format === "webp") img = img.webp({ quality: 78, effort: 6 });
  else img = img.jpeg({ quality: 78, mozjpeg: true });

  const otimizada = await img.toBuffer();

  /* Imagem já enxuta pode ficar maior depois de reprocessada. Nesse
     caso a original fica — o objetivo é peso, não passar o rodo. */
  const vale = otimizada.length < antes;
  if (vale) await writeFile(destino, otimizada);

  totalAntes += antes;
  totalDepois += vale ? otimizada.length : antes;
  linhas.push({
    arquivo: path.relative(ORIGEM, original).split(path.sep).join("/"),
    antes,
    depois: vale ? otimizada.length : antes,
    vale,
  });
}

if (linhas.length === 0) {
  console.log("Nenhuma imagem para otimizar.");
  process.exit(0);
}

const largura = Math.max(...linhas.map((l) => l.arquivo.length));
console.log("\nImagens publicadas:");
for (const l of linhas) {
  const corte = l.vale ? `-${Math.round((1 - l.depois / l.antes) * 100)}%` : "já enxuta";
  console.log(
    `  ${l.arquivo.padEnd(largura)}  ${kb(l.antes).padStart(8)} → ${kb(l.depois).padStart(8)}  ${corte}`,
  );
}
console.log(
  `  ${"TOTAL".padEnd(largura)}  ${kb(totalAntes).padStart(8)} → ${kb(totalDepois).padStart(8)}  ` +
    `-${Math.round((1 - totalDepois / totalAntes) * 100)}%\n`,
);
