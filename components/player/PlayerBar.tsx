"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { albums, formatTime } from "@/lib/data";
import AlbumArt from "@/components/AlbumArt";
import Glow, { useRipple } from "@/components/fx/Glow";
import { useFx } from "@/components/fx/FxProvider";
import { usePlayer } from "./PlayerProvider";

function Scrubber({ compact = false }: { compact?: boolean }) {
  const { time, duration, seek } = usePlayer();
  const percent = duration ? (time / duration) * 100 : 0;

  return (
    <div className={`flex w-full items-center gap-3 ${compact ? "" : "max-w-xl"}`}>
      {!compact && (
        <span className="w-10 text-right font-mono text-[0.7rem] text-muted tabular-nums">
          {formatTime(time)}
        </span>
      )}
      <input
        type="range"
        className="range h-4 w-full"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(time, duration || 0)}
        onChange={(event) => seek(Number(event.target.value))}
        style={{ ["--fill" as string]: `${percent}%` }}
        aria-label="Progresso da faixa"
      />
      {!compact && (
        <span className="w-10 font-mono text-[0.7rem] text-muted tabular-nums">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
}

function TransportButtons({ size = "md" }: { size?: "md" | "lg" }) {
  const { isPlaying, isLoading, toggle, next, previous, index, queue } = usePlayer();
  const { play } = useFx();
  const { ripple, burst } = useRipple();
  const big = size === "lg";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
       
        onClick={() => {
          play("click");
          previous();
        }}
        disabled={queue.length < 2 && index === 0}
        className="grid size-9 place-items-center rounded-full text-muted transition hover:text-paper disabled:opacity-30"
        aria-label="Faixa anterior"
      >
        <SkipBack size={big ? 22 : 18} fill="currentColor" />
      </button>

      <button
        type="button"
       
        onClick={() => {
          burst();
          play(isPlaying ? "close" : "open");
          toggle();
        }}
        className={`smoke-glow grid place-items-center rounded-full bg-paper text-ink transition hover:scale-105 active:scale-95 ${
          big ? "size-16" : "size-10"
        }`}
        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
      >
        <Glow ripple={ripple} round />
        {isLoading && !isPlaying ? (
          <span
            className="block size-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink"
            aria-hidden
          />
        ) : isPlaying ? (
          <Pause size={big ? 28 : 18} fill="currentColor" />
        ) : (
          <Play size={big ? 28 : 18} fill="currentColor" className="ml-[2px]" />
        )}
      </button>

      <button
        type="button"
       
        onClick={() => {
          play("click");
          next();
        }}
        disabled={index >= queue.length - 1}
        className="grid size-9 place-items-center rounded-full text-muted transition hover:text-paper disabled:opacity-30"
        aria-label="Próxima faixa"
      >
        <SkipForward size={big ? 22 : 18} fill="currentColor" />
      </button>
    </div>
  );
}

function ShuffleButton() {
  const { shuffle, toggleShuffle } = usePlayer();
  return (
    <button
      type="button"
      onClick={toggleShuffle}
      className={`grid size-8 place-items-center rounded-full transition ${
        shuffle ? "text-accent" : "text-muted hover:text-paper"
      }`}
      aria-pressed={shuffle}
      aria-label="Ordem aleatória"
      title="Ordem aleatória"
    >
      <Shuffle size={16} />
    </button>
  );
}

function RepeatButton() {
  const { repeat, cycleRepeat } = usePlayer();
  return (
    <button
      type="button"
      onClick={cycleRepeat}
      className={`grid size-8 place-items-center rounded-full transition ${
        repeat !== "off" ? "text-accent" : "text-muted hover:text-paper"
      }`}
      aria-label={
        repeat === "one" ? "Repetir a faixa" : repeat === "all" ? "Repetir a fila" : "Repetição desligada"
      }
      title={repeat === "one" ? "Repetir faixa" : repeat === "all" ? "Repetir fila" : "Repetir"}
    >
      {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
    </button>
  );
}

function ModeButtons() {
  return (
    <>
      <ShuffleButton />
      <RepeatButton />
    </>
  );
}

function VolumeControl() {
  const { volume, muted, setVolume, toggleMute } = usePlayer();
  const level = muted ? 0 : volume;
  const Icon = level === 0 ? VolumeX : level < 0.55 ? Volume1 : Volume2;

  return (
    <div className="group flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMute}
        className="grid size-8 place-items-center text-muted transition hover:text-paper"
        aria-label={muted ? "Reativar som" : "Silenciar"}
      >
        <Icon size={18} />
      </button>
      <input
        type="range"
        className="range h-4 w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100 focus-visible:w-20 focus-visible:opacity-100"
        min={0}
        max={1}
        step={0.01}
        value={level}
        onChange={(event) => setVolume(Number(event.target.value))}
        style={{ ["--fill" as string]: `${level * 100}%` }}
        aria-label="Volume"
      />
    </div>
  );
}

/** Tela cheia "Tocando agora", com a fila ao lado. */
function NowPlayingSheet() {
  const { current, source, queue, index, jumpTo, setExpanded, isPlaying } = usePlayer();
  const { play } = useFx();

  const album = useMemo(
    () => albums.find((a) => `/albuns/${a.slug}` === source?.href) ?? albums[0],
    [source?.href],
  );

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Tocando agora"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(70% 55% at 50% 0%, ${source?.accent ?? "#9fc3bd"}33, transparent 70%)`,
        }}
      />

      <header className="relative flex items-center justify-between px-5 py-4 lg:px-10">
        <button
          type="button"
         
          onClick={() => {
            play("close");
            setExpanded(false);
          }}
          className="flex items-center gap-2 text-sm text-muted transition hover:text-paper"
        >
          <ChevronDown size={20} /> Fechar
        </button>
        {source && (
          <Link
            href={source.href}
            onClick={() => setExpanded(false)}
            className="eyebrow !text-[0.62rem] transition hover:text-paper"
          >
            {source.title}
          </Link>
        )}
      </header>

      <div className="relative grid flex-1 gap-8 overflow-y-auto px-5 pb-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-7 lg:max-w-lg">
          <AlbumArt album={album} className="aspect-square w-full rounded-2xl shadow-2xl" sizes="500px" />
          <div className="w-full text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-paper uppercase lg:text-4xl">
              {current.title}
            </h2>
            <p className="mt-1 text-sm text-muted">Senhor Lakes</p>
          </div>
          <Scrubber />
          {/* As duas colunas laterais têm a mesma largura (1fr), então o
              play fica no centro exato da tela mesmo quando o volume não
              aparece. No celular o repetir migra para a direita: assim a
              linha fica simétrica e aproveita a largura toda. */}
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex items-center gap-2 justify-self-start">
              <ShuffleButton />
              <span className="hidden lg:block">
                <RepeatButton />
              </span>
            </div>

            <TransportButtons size="lg" />

            <div className="flex items-center justify-self-end">
              <span className="lg:hidden">
                <RepeatButton />
              </span>
              <span className="hidden lg:flex">
                <VolumeControl />
              </span>
            </div>
          </div>
        </div>

        <aside className="w-full">
          <h3 className="eyebrow mb-4">
            <ListMusic size={14} className="shrink-0" /> A seguir
          </h3>
          <ol className="max-h-[46vh] space-y-1 overflow-y-auto rail pr-1">
            {queue.map((track, i) => {
              const isCurrent = i === index;
              return (
                <li key={`${track.slug}-${i}`}>
                  <button
                    type="button"
                   
                    onClick={() => {
                      play("click");
                      jumpTo(i);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                      isCurrent ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-center">
                      {isCurrent && isPlaying ? (
                        <EqualizerIcon />
                      ) : (
                        <span className="font-mono text-xs text-muted tabular-nums">{i + 1}</span>
                      )}
                    </span>
                    <span
                      className={`flex-1 truncate text-sm ${isCurrent ? "text-accent" : "text-paper"}`}
                    >
                      {track.title}
                    </span>
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {formatTime(track.duration)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}

export function EqualizerIcon() {
  return (
    <span className="flex h-3 items-end justify-center gap-[2px]" aria-label="Tocando agora">
      {[0, 150, 300].map((delay) => (
        <i
          key={delay}
          className="eq-bar block h-full w-[2px] rounded-full bg-accent"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export default function PlayerBar() {
  const { current, source, expanded, setExpanded, time, duration } = usePlayer();
  const { play } = useFx();

  const album = useMemo(
    () => albums.find((a) => `/albuns/${a.slug}` === source?.href) ?? albums[0],
    [source?.href],
  );

  if (!current) return null;

  return (
    <>
      {expanded && <NowPlayingSheet />}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-carbon/92 backdrop-blur-xl">
        {/* linha de progresso sempre visível no topo da barra */}
        <div className="h-[2px] w-full bg-white/10 lg:hidden">
          <div
            className="h-full bg-accent transition-[width] duration-200"
            style={{ width: `${duration ? (time / duration) * 100 : 0}%` }}
          />
        </div>

        <div className="page-width flex h-[5.5rem] items-center gap-4">
          {/* faixa atual */}
          <button
            type="button"
           
            onClick={() => {
              play("chatOpen");
              setExpanded(true);
            }}
            className="flex min-w-0 flex-1 items-center gap-3 text-left lg:flex-none lg:w-[26%]"
            aria-label="Abrir tela Tocando agora"
          >
            <AlbumArt album={album} className="size-12 shrink-0 rounded-md" sizes="48px" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-paper">{current.title}</span>
              <span className="block truncate text-xs text-muted">
                {source?.title ?? "Senhor Lakes"}
              </span>
            </span>
            <ChevronUp size={18} className="shrink-0 text-muted lg:hidden" />
          </button>

          {/* transporte */}
          <div className="flex flex-col items-center gap-1 lg:flex-1">
            <div className="flex items-center gap-1">
              <span className="hidden lg:flex">
                <ModeButtons />
              </span>
              <TransportButtons />
            </div>
            <div className="hidden w-full justify-center lg:flex">
              <Scrubber />
            </div>
          </div>

          {/* extras */}
          <div className="hidden items-center justify-end gap-2 lg:flex lg:w-[26%]">
            <VolumeControl />
            <button
              type="button"
             
              onClick={() => {
                play("chatOpen");
                setExpanded(true);
              }}
              className="grid size-8 place-items-center text-muted transition hover:text-paper"
              aria-label="Abrir tela Tocando agora"
              title="Tocando agora"
            >
              <ListMusic size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
