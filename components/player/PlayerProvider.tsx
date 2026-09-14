"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Album, Track } from "@/lib/data";

type RepeatMode = "off" | "all" | "one";

type PlayerState = {
  queue: Track[];
  index: number;
  current: Track | null;
  /** de onde a fila veio — aparece como "Tocando do álbum X" */
  source: { title: string; href: string; accent: string } | null;
  isPlaying: boolean;
  isLoading: boolean;
  time: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  expanded: boolean;
};

type PlayerActions = {
  playAlbum: (album: Album, tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setExpanded: (value: boolean) => void;
  jumpTo: (index: number) => void;
};

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer precisa estar dentro de <PlayerProvider>");
  return context;
}

function shuffled<T>(items: T[], keepFirst: number): T[] {
  const head = items[keepFirst];
  const rest = items.filter((_, i) => i !== keepFirst);
  for (let i = rest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [head, ...rest];
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** ordem original da fila, para desfazer o modo aleatório */
  const orderedRef = useRef<Track[]>([]);

  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [source, setSource] = useState<PlayerState["source"]>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [expanded, setExpanded] = useState(false);

  const current = queue[index] ?? null;

  /* Preferências de volume sobrevivem ao recarregar a página. */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sl:volume");
      if (saved !== null) setVolumeState(Math.min(1, Math.max(0, Number(saved))));
    } catch {
      /* navegador sem storage — segue com o volume padrão */
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
    try {
      localStorage.setItem("sl:volume", String(volume));
    } catch {
      /* ignorado de propósito */
    }
  }, [volume, muted]);

  /* Carrega a faixa e toca. `shouldPlay` evita autoplay no primeiro render. */
  const load = useCallback((track: Track | null, shouldPlay: boolean) => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (!audio.src.endsWith(track.src)) {
      audio.src = track.src;
      audio.load();
    }
    if (shouldPlay) {
      setIsLoading(true);
      audio.play().catch(() => setIsPlaying(false));
    }
  }, []);

  useEffect(() => {
    if (current) load(current, isPlaying);
    // `isPlaying` de propósito fora das dependências: trocar de faixa mantém
    // o estado de reprodução, mas pausar não deve recarregar o áudio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.slug]);

  const playQueue = useCallback(
    (tracks: Track[], startIndex: number, from: PlayerState["source"]) => {
      if (!tracks.length) return;
      orderedRef.current = tracks;
      const ordered = shuffle ? shuffled(tracks, startIndex) : tracks;
      setQueue(ordered);
      setIndex(shuffle ? 0 : startIndex);
      setSource(from);
      setIsPlaying(true);
      const track = ordered[shuffle ? 0 : startIndex];
      // Precisa acontecer no mesmo gesto do clique, senão o navegador bloqueia.
      const audio = audioRef.current;
      if (audio && track) {
        audio.src = track.src;
        audio.load();
        setIsLoading(true);
        audio.play().catch(() => setIsPlaying(false));
      }
    },
    [shuffle],
  );

  const playAlbum = useCallback(
    (album: Album, tracks: Track[], startIndex = 0) => {
      playQueue(tracks, startIndex, {
        title: album.title,
        href: `/albuns/${album.slug}`,
        accent: album.accent,
      });
    },
    [playQueue],
  );

  const playTrack = useCallback(
    (track: Track) => {
      playQueue([track], 0, null);
    },
    [playQueue],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      setIsLoading(true);
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [current]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i < queue.length - 1) return i + 1;
      return repeat === "all" ? 0 : i;
    });
  }, [queue.length, repeat]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    // Igual ao YouTube Music: depois de 3 s, volta para o começo da faixa.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setIndex((i) => (i > 0 ? i - 1 : repeat === "all" ? queue.length - 1 : 0));
  }, [queue.length, repeat]);

  const jumpTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= queue.length) return;
      setIndex(target);
      setIsPlaying(true);
      const audio = audioRef.current;
      const track = queue[target];
      if (audio && track) {
        audio.src = track.src;
        audio.load();
        setIsLoading(true);
        audio.play().catch(() => setIsPlaying(false));
      }
    },
    [queue],
  );

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setTime(seconds);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (value > 0) setMuted(false);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((on) => {
      const nowOn = !on;
      const playing = queue[index];
      if (!playing) return nowOn;
      if (nowOn) {
        const base = orderedRef.current.length ? orderedRef.current : queue;
        const at = base.findIndex((t) => t.slug === playing.slug);
        setQueue(shuffled(base, at < 0 ? 0 : at));
        setIndex(0);
      } else {
        const base = orderedRef.current.length ? orderedRef.current : queue;
        setQueue(base);
        setIndex(Math.max(0, base.findIndex((t) => t.slug === playing.slug)));
      }
      return nowOn;
    });
  }, [queue, index]);

  const cycleRepeat = useCallback(() => {
    setRepeat((mode) => (mode === "off" ? "all" : mode === "all" ? "one" : "off"));
  }, []);

  /* ── Eventos do elemento <audio> ─────────────────────── */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => setIsPlaying(false);
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onEnded = () => {
      if (repeat === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      if (index < queue.length - 1) {
        setIndex(index + 1);
      } else if (repeat === "all" && queue.length > 1) {
        setIndex(0);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
    };
  }, [index, queue.length, repeat]);

  /* Controles de mídia do sistema (tela de bloqueio, fones, teclado). */
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: "Senhor Lakes",
      album: source?.title ?? "Senhor Lakes",
      artwork: [{ src: "/img/logo.png", sizes: "512x512", type: "image/png" }],
    });
    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("previoustrack", previous);
  }, [current, source, next, previous]);

  /* Barra de espaço toca/pausa, desde que o foco não esteja num campo. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing || !current) return;
      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      }
      if (event.code === "Escape" && expanded) setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, current, expanded]);

  /* Reserva espaço no fim da página para a barra do player não cobrir nada. */
  useEffect(() => {
    document.documentElement.style.setProperty("--player-h", current ? "5.5rem" : "0px");
  }, [current]);

  const value = useMemo(
    () => ({
      queue,
      index,
      current,
      source,
      isPlaying,
      isLoading,
      time,
      duration: duration || current?.duration || 0,
      volume,
      muted,
      shuffle,
      repeat,
      expanded,
      playAlbum,
      playTrack,
      toggle,
      next,
      previous,
      seek,
      setVolume,
      toggleMute: () => setMuted((m) => !m),
      toggleShuffle,
      cycleRepeat,
      setExpanded,
      jumpTo,
    }),
    [
      queue, index, current, source, isPlaying, isLoading, time, duration,
      volume, muted, shuffle, repeat, expanded, playAlbum, playTrack, toggle,
      next, previous, seek, setVolume, toggleShuffle, cycleRepeat, jumpTo,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}
