/* ──────────────────────────────────────────────────────────
   SoundFX — sons sintetizados na hora pela Web Audio API.
   Nenhum arquivo de áudio: tudo é gerado por osciladores, então
   custa 0 KB de download e nunca atrasa o carregamento.

   Portado do painel da Contourline (public/js/components/sound-fx.js).
   ────────────────────────────────────────────────────────── */

type Wave = OscillatorType;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let volume = 0.32;
let gestured = false;
let lastHover = 0;

/** O navegador só deixa criar áudio depois de um clique/toque. */
export function armAudio() {
  gestured = true;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function isSoundEnabled() {
  return enabled;
}

function ac(): AudioContext | null {
  if (!enabled || !gestured || typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

function note(
  type: Wave,
  freq: number,
  start: number,
  dur: number,
  peak = 0.25,
  attack = 0.008,
  freqEnd: number | null = null,
) {
  const audio = ac();
  if (!audio || !master) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd != null) osc.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

function noise(start: number, dur: number, gainValue = 0.2) {
  const audio = ac();
  if (!audio || !master) return;
  const size = Math.max(1, Math.floor(audio.sampleRate * dur));
  const buffer = audio.createBuffer(1, size, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(start);
  source.stop(start + dur + 0.01);
}

const now = () => ac()?.currentTime ?? null;

/** Tick agudo e curtíssimo, com limite para não virar metralhadora. */
function hover() {
  const stamp = Date.now();
  if (stamp - lastHover < 90) return;
  lastHover = stamp;
  const t = now();
  if (t == null) return;
  note("sine", 1568, t, 0.1, 0.07, 0.006);
  note("sine", 3136, t + 0.004, 0.06, 0.03, 0.004);
}

/** Pop tátil de clique. */
function click() {
  const t = now();
  if (t == null) return;
  note("sine", 880, t, 0.12, 0.16, 0.005);
  note("sine", 440, t + 0.002, 0.16, 0.09, 0.008);
}

/** Subida suave — abrir painel, lightbox, menu. */
function open() {
  const t = now();
  if (t == null) return;
  note("sine", 300, t, 0.18, 0.24, 0.04, 600);
}

/** Descida — espelho do open. */
function close() {
  const t = now();
  if (t == null) return;
  note("sine", 600, t, 0.2, 0.24, 0.012, 300);
  note("sine", 1200, t + 0.02, 0.1, 0.04, 0.006);
}

/** Tríade Dó-Mi-Sol com brilho no topo — começar a tocar um álbum. */
function success() {
  const t = now();
  if (t == null) return;
  note("sine", 523, t, 0.22, 0.2, 0.01);
  note("sine", 659, t + 0.1, 0.24, 0.2, 0.01);
  note("sine", 784, t + 0.2, 0.3, 0.18, 0.012);
  note("sine", 1568, t + 0.2, 0.2, 0.08, 0.008);
}

/** Whoosh de transição. */
function navigate() {
  const t = now();
  if (t == null) return;
  note("sine", 220, t, 0.18, 0.08, 0.01, 880);
  noise(t, 0.1, 0.05);
  note("sine", 1760, t + 0.1, 0.12, 0.03, 0.006);
}

/** Ping doce — favoritar, curtir, confirmar. */
function favorite() {
  const t = now();
  if (t == null) return;
  note("sine", 880, t, 0.28, 0.2, 0.01);
  note("sine", 1100, t + 0.05, 0.26, 0.15, 0.01);
  note("sine", 1320, t + 0.1, 0.3, 0.14, 0.01);
  note("sine", 2640, t + 0.12, 0.18, 0.05, 0.006);
}

/** Cascata mágica — usada quando o player abre em tela cheia. */
function magic() {
  const t = now();
  if (t == null) return;
  note("sine", 880, t, 0.34, 0.15, 0.012);
  note("sine", 1047, t, 0.26, 0.16, 0.006);
  note("sine", 1319, t + 0.04, 0.24, 0.15, 0.006);
  note("sine", 1568, t + 0.08, 0.22, 0.15, 0.006);
  note("sine", 2093, t + 0.13, 0.2, 0.13, 0.006);
  note("sine", 4186, t + 0.18, 0.14, 0.04, 0.004);
}

/** Thud grave — pausar. */
function drop() {
  const t = now();
  if (t == null) return;
  note("triangle", 80, t, 0.28, 0.24, 0.005, 50);
  note("sine", 160, t, 0.16, 0.12, 0.005, 100);
  noise(t, 0.04, 0.12);
}

export const SoundFX = {
  hover,
  click,
  open,
  close,
  success,
  navigate,
  favorite,
  magic,
  drop,
};
