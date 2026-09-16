/* ──────────────────────────────────────────────────────────
   TESTE DA ESTRUTURA DO SISTEMA DA BANDA

   Rode com:  node crm/teste-schema.mjs

   Não testa telas nem servidor — testa as duas contas que o sistema não
   pode errar, porque errar nelas é briga entre amigos:

     1. quanto sobra de um show e quanto vai para cada um
     2. qual dia de ensaio junta mais gente

   Usa um banco de memória, então não toca em nada de verdade.
   ────────────────────────────────────────────────────────── */

import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(readFileSync(new URL("schema.sql", import.meta.url), "utf8"));

const reais = (centavos) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

let falhas = 0;
function confere(descricao, obtido, esperado) {
  const ok = obtido === esperado;
  if (!ok) falhas += 1;
  console.log(`  ${ok ? "ok  " : "ERRO"} ${descricao}${ok ? "" : ` — esperava ${esperado}, veio ${obtido}`}`);
}

/* ── A banda ─────────────────────────────────────────────── */

const banda = [
  ["i1", "Davisson"],
  ["i2", "Alan"],
  ["i3", "Lauro"],
  ["i4", "Wither"],
  ["i5", "Vanildo"],
];
const inserirIntegrante = db.prepare(
  "INSERT INTO integrantes (id, nome, email, senha_hash) VALUES (?, ?, ?, 'pbkdf2$1$x$y')",
);
banda.forEach(([id, nome]) => inserirIntegrante.run(id, nome, `${id}@exemplo.com`));

/* ── 1. O dinheiro de um show ────────────────────────────── */

console.log("\nDinheiro de um show");

db.prepare(
  `INSERT INTO shows (id, estado, titulo, data, local, cidade, cache_centavos)
   VALUES ('s1', 'tocado', 'Emporio Matuto', '2026-09-19', 'Emporio Matuto Cachaçaria', 'Sete Lagoas, MG', 120000)`,
).run();

const gasto = db.prepare(
  "INSERT INTO gastos (id, show_id, descricao, valor_centavos, pago_por) VALUES (?, 's1', ?, ?, ?)",
);
gasto.run("g1", "Combustível", 12000, "i2");
gasto.run("g2", "Lanche da equipe", 6000, "i3");

const conta = db
  .prepare(
    `SELECT s.cache_centavos AS cache,
            COALESCE(SUM(g.valor_centavos), 0) AS gastos
       FROM shows s
       LEFT JOIN gastos g ON g.show_id = s.id
      WHERE s.id = 's1'`,
  )
  .get();

const liquido = conta.cache - conta.gastos;
/* Divisão inteira e sobra separada: R$102,00 entre 5 dá 20,40 certinho,
   mas 100,01 entre 3 não fecha. A sobra em centavos precisa ter dono —
   somar os cinco tem que dar exatamente o líquido, sempre. */
const porPessoa = Math.floor(liquido / banda.length);
const sobra = liquido - porPessoa * banda.length;

console.log(`  cachê ${reais(conta.cache)} − gastos ${reais(conta.gastos)} = ${reais(liquido)}`);
console.log(`  cada um: ${reais(porPessoa)}   sobra: ${sobra} centavo(s)`);

confere("gastos somados", conta.gastos, 18000);
confere("líquido do show", liquido, 102000);
confere("valor por pessoa", porPessoa, 20400);
confere("soma das partes bate com o líquido", porPessoa * banda.length + sobra, liquido);

/* Quem pagou do próprio bolso tem que receber de volta antes da divisão. */
const aReceber = db
  .prepare(
    `SELECT i.nome, SUM(g.valor_centavos) AS total
       FROM gastos g JOIN integrantes i ON i.id = g.pago_por
      WHERE g.show_id = 's1' GROUP BY i.id ORDER BY i.nome`,
  )
  .all();
console.log("  reembolso:", aReceber.map((r) => `${r.nome} ${reais(r.total)}`).join(", "));
confere("duas pessoas a reembolsar", aReceber.length, 2);

/* ── 2. O melhor dia de ensaio ───────────────────────────── */

console.log("\nMelhor dia de ensaio");

const ensaio = db.prepare("INSERT INTO ensaios (id, data, hora, local) VALUES (?, ?, '20:00', 'Estúdio')");
ensaio.run("e1", "2026-09-22");
ensaio.run("e2", "2026-09-23");
ensaio.run("e3", "2026-09-24");

const responder = db.prepare(
  "INSERT INTO presencas (ensaio_id, integrante_id, resposta) VALUES (?, ?, ?)",
);
// Segunda: três podem. Terça: quatro. Quarta: dois.
["i1", "i2", "i3"].forEach((i) => responder.run("e1", i, "pode"));
["i4", "i5"].forEach((i) => responder.run("e1", i, "nao_pode"));
["i1", "i2", "i3", "i4"].forEach((i) => responder.run("e2", i, "pode"));
responder.run("e2", "i5", "talvez");
["i1", "i5"].forEach((i) => responder.run("e3", i, "pode"));

const ranking = db
  .prepare(
    `SELECT e.data,
            SUM(CASE WHEN p.resposta = 'pode' THEN 1 ELSE 0 END) AS podem,
            SUM(CASE WHEN p.resposta = 'talvez' THEN 1 ELSE 0 END) AS talvez
       FROM ensaios e LEFT JOIN presencas p ON p.ensaio_id = e.id
      WHERE e.estado = 'proposto'
      GROUP BY e.id
      ORDER BY podem DESC, talvez DESC, e.data ASC`,
  )
  .all();

ranking.forEach((r) => console.log(`  ${r.data}: ${r.podem} podem, ${r.talvez} talvez`));

confere("o melhor dia é a terça", ranking[0].data, "2026-09-23");
confere("quatro podem na terça", ranking[0].podem, 4);

/* Quem ainda não respondeu — é quem vai levar a cutucada. */
const faltamResponder = db
  .prepare(
    `SELECT i.nome FROM integrantes i
      WHERE i.ativo = 1
        AND i.id NOT IN (SELECT integrante_id FROM presencas WHERE ensaio_id = 'e3')
      ORDER BY i.nome`,
  )
  .all();
console.log("  não responderam sobre a quarta:", faltamResponder.map((r) => r.nome).join(", "));
confere("três ainda devem resposta", faltamResponder.length, 3);

/* ── 3. Apagar um show leva junto o que era dele ─────────── */

console.log("\nApagar um show");
db.exec("PRAGMA foreign_keys = ON");
db.prepare("DELETE FROM shows WHERE id = 's1'").run();
const sobraram = db.prepare("SELECT COUNT(*) AS n FROM gastos WHERE show_id = 's1'").get();
confere("gastos do show apagado somem junto", sobraram.n, 0);

console.log(falhas === 0 ? "\nTudo certo.\n" : `\n${falhas} falha(s).\n`);
process.exit(falhas === 0 ? 0 : 1);
