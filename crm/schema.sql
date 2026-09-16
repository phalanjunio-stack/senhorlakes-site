-- ─────────────────────────────────────────────────────────
--  ESTRUTURA DO SISTEMA DA BANDA
--
--  Cinco pessoas, um quadro de shows, ensaios com confirmação, e o
--  dinheiro de cada show. Roda no D1 da Cloudflare.
--
--  Duas regras que valem para o arquivo inteiro:
--
--  Dinheiro é guardado em CENTAVOS, como número inteiro. Guardar
--  1.200,50 como número quebrado leva a somas que erram por um centavo
--  e ninguém entende de onde veio. Em centavos, 120050 é exato.
--
--  Data é texto no formato AAAA-MM-DD. O SQLite não tem tipo de data, e
--  esse formato ordena certo como texto — "2026-09-19" vem depois de
--  "2026-09-05" tanto para o banco quanto para uma pessoa lendo.
-- ─────────────────────────────────────────────────────────

-- ── Quem entra ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS integrantes (
  id           TEXT PRIMARY KEY,
  nome         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  -- pbkdf2$voltas$sal$hash — mesmo formato do painel do site
  senha_hash   TEXT NOT NULL,
  -- "admin" mexe em tudo; "integrante" vê e confirma presença
  papel        TEXT NOT NULL DEFAULT 'integrante',
  -- Desligar alguém sem apagar o histórico: quem saiu da banda continua
  -- aparecendo nos shows que tocou.
  ativo        INTEGER NOT NULL DEFAULT 1,
  criado_em    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── O card de show ───────────────────────────────────────
-- Carrega negociação, data, combinado e dinheiro. É o objeto central:
-- quatro das cinco dores relatadas moram aqui dentro.
CREATE TABLE IF NOT EXISTS shows (
  id              TEXT PRIMARY KEY,
  -- conversando | negociando | confirmado | tocado | cancelado
  -- É a coluna do quadro. Arrastar o card muda este campo.
  estado          TEXT NOT NULL DEFAULT 'conversando',
  -- Posição dentro da coluna, para a ordem sobreviver ao recarregar.
  ordem           INTEGER NOT NULL DEFAULT 0,

  titulo          TEXT NOT NULL,
  data            TEXT,               -- AAAA-MM-DD; vazio enquanto não há data
  hora            TEXT,               -- HH:MM do show
  hora_passagem   TEXT,               -- HH:MM da passagem de som
  local           TEXT,
  endereco        TEXT,
  cidade          TEXT,

  contato_nome    TEXT,
  contato_fone    TEXT,

  cache_centavos  INTEGER NOT NULL DEFAULT 0,
  -- O que ficou combinado por escrito: quantas horas, se tem comida, se
  -- o som é da casa. É o que evita discussão depois do show.
  combinado       TEXT,

  criado_em       TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- O quadro é sempre lido por coluna e em ordem.
CREATE INDEX IF NOT EXISTS idx_shows_quadro ON shows (estado, ordem);
-- A agenda é lida por data.
CREATE INDEX IF NOT EXISTS idx_shows_data ON shows (data);

-- ── Gastos de um show ────────────────────────────────────
-- Combustível, alimentação, som alugado. Separados do card porque são
-- vários por show e cada um tem seu valor.
CREATE TABLE IF NOT EXISTS gastos (
  id              TEXT PRIMARY KEY,
  show_id         TEXT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  descricao       TEXT NOT NULL,
  valor_centavos  INTEGER NOT NULL,
  -- Quem tirou do bolso — para acertar depois. Vazio = caixa da banda.
  pago_por        TEXT REFERENCES integrantes(id),
  criado_em       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gastos_show ON gastos (show_id);

-- ── Ensaio ───────────────────────────────────────────────
-- Uma data proposta. Várias por vez: a ideia é lançar três ou quatro e
-- ver qual junta mais gente.
CREATE TABLE IF NOT EXISTS ensaios (
  id          TEXT PRIMARY KEY,
  data        TEXT NOT NULL,          -- AAAA-MM-DD
  hora        TEXT,
  local       TEXT,
  -- proposto | marcado | cancelado
  estado      TEXT NOT NULL DEFAULT 'proposto',
  observacao  TEXT,
  criado_em   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ensaios_data ON ensaios (data);

-- ── Quem pode ────────────────────────────────────────────
-- Uma linha por pessoa por ensaio. A chave dupla impede a mesma pessoa
-- de responder duas vezes e deixa trocar a resposta sem criar lixo.
CREATE TABLE IF NOT EXISTS presencas (
  ensaio_id     TEXT NOT NULL REFERENCES ensaios(id) ON DELETE CASCADE,
  integrante_id TEXT NOT NULL REFERENCES integrantes(id) ON DELETE CASCADE,
  -- pode | nao_pode | talvez
  resposta      TEXT NOT NULL,
  observacao    TEXT,
  respondido_em TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (ensaio_id, integrante_id)
);

-- ── Conversa dentro do card ──────────────────────────────
-- "Liguei, ele pediu desconto", "confirmou por WhatsApp". O histórico da
-- negociação fica junto do show, não perdido no grupo.
CREATE TABLE IF NOT EXISTS recados (
  id            TEXT PRIMARY KEY,
  show_id       TEXT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  integrante_id TEXT REFERENCES integrantes(id),
  texto         TEXT NOT NULL,
  criado_em     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_recados_show ON recados (show_id, criado_em);
