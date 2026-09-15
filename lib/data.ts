/* ──────────────────────────────────────────────────────────
   CONTEÚDO DO SITE
   Este é o único arquivo que você precisa editar para mudar
   músicas, álbuns, shows, vídeos, fotos e integrantes.
   ────────────────────────────────────────────────────────── */

export type Track = {
  /** identificador único, usado na URL e no player */
  slug: string;
  title: string;
  /** duração em segundos (lida dos arquivos reais) */
  duration: number;
  /** caminho do arquivo dentro de /public */
  src: string;
  /** autoria original — deixe vazio se a música for da banda */
  cover?: string;
};

export type Album = {
  slug: string;
  title: string;
  /** "Álbum", "EP", "Single", "Playlist"… aparece acima do título */
  kind: string;
  year: number;
  /** caminho de uma imagem em /public. null = capa gerada automaticamente */
  artwork: string | null;
  /** cor usada na capa gerada e no fundo da página do álbum */
  accent: string;
  description: string;
  trackSlugs: string[];
};

export type Member = {
  name: string;
  role: string;
  /** posição do recorte na foto de grupo, enquanto não houver retrato individual */
  framePosition: string;
  photo?: string;
};

export type GigEvent = {
  date: string; // AAAA-MM-DD
  city: string;
  venue: string;
  url?: string;
};

export type Video = {
  /** id do YouTube — o trecho depois de "watch?v=" */
  youtubeId: string;
  title: string;
  description?: string;
};

export type Photo = {
  id: string;
  src: string | null;
  alt: string;
  category: "shows" | "bastidores" | "retratos" | "estrada";
  caption?: string;
  /** proporção largura/altura — define a altura no masonry */
  ratio: number;
};

/* ── BANDA ─────────────────────────────────────────────── */

export const band = {
  name: "Senhor Lakes",
  tagline: "Pop rock ao vivo",
  claim: "Mais que música. Boas histórias.",
  city: "Sete Lagoas, MG",
  email: "contato@senhorlakes.com.br",
  /** formato internacional, só dígitos — usado no link do WhatsApp */
  whatsapp: "5531998765432",
  phoneLabel: "(31) 9 9876-5432",
  instagram: "https://instagram.com/senhorlakes",
  youtube: "https://youtube.com/@senhorlakes",
  spotify: "",
};

/* framePosition = qual pessoa da foto de grupo aparece no card.
   Da esquerda para a direita: 5% · 27% · 49% · 70% · 92%.
   Quando houver retrato individual, preencha `photo` e a posição
   passa a ser ignorada. */
export const members: Member[] = [
  { name: "Davisson", role: "Voz / baixo", framePosition: "5%" },
  { name: "Alan", role: "Voz / guitarra / violão", framePosition: "27%" },
  { name: "Lauro", role: "Voz / guitarra", framePosition: "49%" },
  { name: "Wither", role: "Bateria", framePosition: "70%" },
  { name: "Vanildo", role: "Teclado", framePosition: "92%" },
];

/* ── FAIXAS ────────────────────────────────────────────── */
/* As durações abaixo foram lidas dos arquivos reais em /public/audio. */

export const tracks: Track[] = [
  { slug: "carla", title: "Carla", duration: 235, src: "/audio/carla.mp3" },
  { slug: "dias-atras", title: "Dias Atrás", duration: 253, src: "/audio/dias-atras.mp3" },
  { slug: "eu-que-nao-amo-voce", title: "Eu Que Não Amo Você", duration: 276, src: "/audio/eu-que-nao-amo-voce.mp3" },
  { slug: "meu-erro", title: "Meu Erro", duration: 221, src: "/audio/meu-erro.mp3" },
  { slug: "olhos-certos", title: "Olhos Certos", duration: 233, src: "/audio/olhos-certos.mp3" },
  { slug: "pescador", title: "Pescador", duration: 304, src: "/audio/pescador.mp3" },
  { slug: "segredo", title: "Segredo", duration: 196, src: "/audio/segredo.mp3" },
  { slug: "sem-radar", title: "Sem Radar", duration: 239, src: "/audio/sem-radar.mp3" },
  { slug: "so-hoje", title: "Só Hoje", duration: 320, src: "/audio/so-hoje.mp3" },
  { slug: "so-por-meu-prazer", title: "Só Por Meu Prazer", duration: 208, src: "/audio/so-por-meu-prazer.mp3" },
  { slug: "sua-maneira", title: "Sua Maneira", duration: 203, src: "/audio/sua-maneira.mp3" },
];

/* ── ÁLBUNS ────────────────────────────────────────────── */
/* Para criar um novo álbum, copie um bloco e distribua os
   trackSlugs entre eles. Uma faixa pode estar em mais de um. */

export const albums: Album[] = [
  {
    slug: "desde-sempre",
    title: "Desde Sempre",
    kind: "Álbum",
    year: 2026,
    artwork: "/img/desde-sempre.webp",
    accent: "#9fc3bd",
    description:
      "As gravações que abriram a estrada da banda. Onze faixas registradas do jeito que soam no palco.",
    trackSlugs: [
      "carla",
      "dias-atras",
      "eu-que-nao-amo-voce",
      "meu-erro",
      "olhos-certos",
      "pescador",
      "segredo",
      "sem-radar",
      "so-hoje",
      "so-por-meu-prazer",
      "sua-maneira",
    ],
  },
  {
    slug: "para-cantar-junto",
    title: "Para Cantar Junto",
    kind: "Playlist",
    year: 2026,
    artwork: null,
    accent: "#c9a227",
    description: "O bloco do show em que ninguém fica parado.",
    trackSlugs: ["sua-maneira", "meu-erro", "so-hoje", "carla", "pescador"],
  },
  {
    slug: "final-da-noite",
    title: "Final da Noite",
    kind: "Playlist",
    year: 2026,
    artwork: null,
    accent: "#6d8f89",
    description: "Quando a casa esvazia e sobram as canções lentas.",
    trackSlugs: ["segredo", "olhos-certos", "dias-atras", "eu-que-nao-amo-voce", "so-por-meu-prazer"],
  },
];

/* ── AGENDA ────────────────────────────────────────────── */
/* Shows passados somem sozinhos da home. */

export const events: GigEvent[] = [
  { date: "2026-09-14", city: "Sete Lagoas, MG", venue: "Santa Fé Music Bar" },
  { date: "2026-09-21", city: "Belo Horizonte, MG", venue: "Mister Rock" },
  { date: "2026-09-28", city: "Divinópolis, MG", venue: "Garagem 55" },
];

/* ── VÍDEOS ────────────────────────────────────────────── */
/* Cole o id do YouTube: youtube.com/watch?v=ESTE_PEDACO   */

export const videos: Video[] = [];

/* ── GALERIA ───────────────────────────────────────────── */
/* src: null gera um espaço reservado no masonry, para você
   enxergar o layout antes das fotos reais existirem.
   Troque por "/img/nome-do-arquivo.jpg" conforme for subindo. */

export const photos: Photo[] = [
  { id: "p1", src: "/img/banda.jpg", alt: "Senhor Lakes reunidos", category: "retratos", caption: "A formação", ratio: 3 / 2 },
  { id: "p2", src: null, alt: "Espaço reservado", category: "shows", caption: "Show em Sete Lagoas", ratio: 2 / 3 },
  { id: "p3", src: null, alt: "Espaço reservado", category: "bastidores", caption: "Passagem de som", ratio: 1 },
  { id: "p4", src: null, alt: "Espaço reservado", category: "shows", caption: "Plateia cantando junto", ratio: 3 / 2 },
  { id: "p5", src: null, alt: "Espaço reservado", category: "estrada", caption: "A caminho do próximo", ratio: 4 / 5 },
  { id: "p6", src: null, alt: "Espaço reservado", category: "retratos", caption: "Lauro", ratio: 2 / 3 },
  { id: "p7", src: null, alt: "Espaço reservado", category: "bastidores", caption: "Antes de subir", ratio: 3 / 2 },
  { id: "p8", src: null, alt: "Espaço reservado", category: "shows", caption: "Luz e volume", ratio: 1 },
  { id: "p9", src: null, alt: "Espaço reservado", category: "estrada", caption: "Estrada de Minas", ratio: 16 / 9 },
  { id: "p10", src: null, alt: "Espaço reservado", category: "retratos", caption: "Alan", ratio: 4 / 5 },
];

/* ── HELPERS ───────────────────────────────────────────── */

export const trackBySlug = (slug: string) => tracks.find((t) => t.slug === slug);

export function albumTracks(album: Album): Track[] {
  return album.trackSlugs.map(trackBySlug).filter((t): t is Track => Boolean(t));
}

export function albumDuration(album: Album): number {
  return albumTracks(album).reduce((total, track) => total + track.duration, 0);
}

export const albumBySlug = (slug: string) => albums.find((a) => a.slug === slug);

/** 235 → "3:55" */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 2894 → "48 min" */
export function formatLongDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Shows a partir de hoje, em ordem cronológica. */
export function upcomingEvents(from = new Date()): GigEvent[] {
  const today = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()))
    .toISOString()
    .slice(0, 10);
  return events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}

export const whatsappLink = (message = "Olá! Gostaria de falar sobre um show do Senhor Lakes.") =>
  `https://wa.me/${band.whatsapp}?text=${encodeURIComponent(message)}`;
