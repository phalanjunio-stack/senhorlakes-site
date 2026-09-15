/* ──────────────────────────────────────────────────────────
   GERA O QUE O SERVIDOR PRECISA GUARDAR DA SUA SENHA

   Rode assim, no terminal, dentro da pasta do site:

     node scripts/gerar-senha.mjs

   Ele pede a senha, e devolve duas linhas para você colar nas
   configurações da Cloudflare.

   A senha em si não sai daqui: o que ele imprime é o resultado de uma
   conta que só funciona num sentido. Dá para conferir se uma senha bate
   com aquele resultado, mas não dá para voltar dele até a senha. Por
   isso nem eu, nem quem olhar o servidor, nem quem roubar o banco um
   dia, descobre o que você digitou.

   Não passe a senha como argumento do comando — ela ficaria guardada no
   histórico do terminal.
   ────────────────────────────────────────────────────────── */

import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline";

/* Quantas vezes a conta é repetida antes de virar o resultado final.
   Quanto mais voltas, mais caro fica para alguém testar senha por senha
   — e mais caro também para o servidor conferir a sua. Este número é o
   ponto onde a conferência ainda cabe no tempo de processamento que a
   Cloudflare dá de graça por requisição. */
const VOLTAS = 100_000;

function perguntar(pergunta) {
  const leitor = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => leitor.question(pergunta, (resposta) => {
    leitor.close();
    resolve(resposta);
  }));
}

const senha = (await perguntar("Senha que você quer usar no painel: ")).trim();

if (senha.length < 10) {
  console.error("\nCurta demais. Use pelo menos 10 caracteres — essa senha abre o site inteiro.\n");
  process.exit(1);
}

const sal = randomBytes(16);
const hash = pbkdf2Sync(senha, sal, VOLTAS, 32, "sha256");

console.log(`
Cole estes dois valores na Cloudflare, em Settings → Variables and Secrets.
Os dois entram como "Secret" (não como "Text"):

ADMIN_SENHA_HASH
pbkdf2$${VOLTAS}$${sal.toString("base64")}$${hash.toString("base64")}

SESSAO_SEGREDO
${randomBytes(32).toString("base64")}

Guarde a senha num lugar seguro. Não dá para recuperá-la a partir disso
aí — se esquecer, o caminho é gerar outra e trocar o valor lá.
`);
