/* ──────────────────────────────────────────────────────────
   CONTEÚDO DO SITE

   Os dados moram em /content, em arquivos JSON — é de lá que o
   painel de administração lê e escreve. Este arquivo só dá tipo
   a eles e guarda as funções de apoio.

   Para mudar o conteúdo, use o painel. Mexer no JSON à mão
   também funciona; mexer aqui só é necessário para mudar as
   regras, não o conteúdo.
   ────────────────────────────────────────────────────────── */

import bandaJson from "@/content/banda.json";
import integrantesJson from "@/content/integrantes.json";
import faixasJson from "@/content/faixas.json";
import albunsJson from "@/content/albuns.json";
import showsJson from "@/content/shows.json";
import videosJson from "@/content/videos.json";
import fotosJson from "@/content/fotos.json";
import historiasJson from "@/content/historias.json";

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

export type Story = {
  slug: string;
  /** palavrinha acima do título — "A origem do nome", "Bastidores" */
  kicker?: string;
  title: string;
  /** linha de apoio logo abaixo do título */
  lead?: string;
  /** caminho de uma imagem em /public. null = história ainda sem foto */
  photo: string | null;
  alt?: string;
  caption?: string;
  /** proporção largura/altura da foto — reserva o espaço certo e evita corte */
  ratio: number;
  /** texto corrido — as regras de formatação estão em components/Prose.tsx */
  body: string;
};

/* ── DADOS ─────────────────────────────────────────────── */
/* O JSON chega com tipos largos (string no lugar das uniões, por
   exemplo), por isso a afirmação de tipo aqui. O painel valida os
   campos na hora de salvar, seguindo o mesmo formato de .pages.yml. */

export const band = bandaJson;
export const members = integrantesJson.members as Member[];
export const tracks = faixasJson.tracks as Track[];
export const albums = albunsJson.albums as Album[];
export const events = showsJson.events as GigEvent[];
export const videos = videosJson.videos as Video[];
/* Mesma conversão das fotos, pelo mesmo motivo: o campo de seleção do
   painel grava texto e o layout precisa de número. */
export const stories = historiasJson.stories.map((historia) => ({
  ...historia,
  ratio: Number(historia.ratio),
})) as Story[];
/* O formato da foto é um campo de seleção no painel, e seleção grava
   texto. Aqui vira número, que é o que o mosaico usa para calcular a
   altura. Number() aceita tanto "1.5" quanto 1.5, então funciona com
   o que já estava escrito à mão e com o que o painel gravar. */
export const photos = fotosJson.photos.map((foto) => ({
  ...foto,
  ratio: Number(foto.ratio),
})) as Photo[];

/* ── HELPERS ───────────────────────────────────────────── */

export const trackBySlug = (slug: string) => tracks.find((t) => t.slug === slug);

export function albumTracks(album: Album): Track[] {
  return album.trackSlugs.map(trackBySlug).filter((t): t is Track => Boolean(t));
}

export function albumDuration(album: Album): number {
  return albumTracks(album).reduce((total, track) => total + track.duration, 0);
}

export const albumBySlug = (slug: string) => albums.find((a) => a.slug === slug);

export const storyBySlug = (slug: string) => stories.find((h) => h.slug === slug);

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
