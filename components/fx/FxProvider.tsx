"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { armAudio, setSoundEnabled, SoundFX } from "@/lib/sound";

type Fx = {
  /** parallax, tilt, cursor e ímã ligados? */
  motion: boolean;
  sound: boolean;
  toggleMotion: () => void;
  toggleSound: () => void;
  /** atalho seguro: não faz nada se o som estiver desligado */
  play: (name: keyof typeof SoundFX) => void;
};

const FxContext = createContext<Fx | null>(null);

export function useFx() {
  const context = useContext(FxContext);
  // Fora do provider (ex.: testes) tudo fica desligado em vez de quebrar.
  return (
    context ?? {
      motion: false,
      sound: false,
      toggleMotion: () => {},
      toggleSound: () => {},
      play: () => {},
    }
  );
}

const read = (key: string, fallback: boolean) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "on";
  } catch {
    return fallback;
  }
};

const write = (key: string, value: boolean) => {
  try {
    localStorage.setItem(key, value ? "on" : "off");
  } catch {
    /* navegador sem storage — a preferência só não sobrevive ao reload */
  }
};

export function FxProvider({ children }: { children: React.ReactNode }) {
  // Começa desligado no servidor para o HTML bater com o cliente; o efeito
  // abaixo liga assim que sabemos a preferência real da pessoa.
  const [motion, setMotion] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setMotion(read("sl:motion", !reduced && fine));
    const wantsSound = read("sl:sound", true);
    setSound(wantsSound);
    setSoundEnabled(wantsSound);
  }, []);

  /* O áudio só pode nascer depois de um gesto — armamos no primeiro deles. */
  useEffect(() => {
    const arm = () => armAudio();
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, arm, { once: true, capture: true }));
    return () =>
      events.forEach((event) => window.removeEventListener(event, arm, { capture: true }));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-on", motion);
  }, [motion]);

  const toggleMotion = useCallback(() => {
    setMotion((on) => {
      write("sl:motion", !on);
      return !on;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSound((on) => {
      const next = !on;
      write("sl:sound", next);
      setSoundEnabled(next);
      armAudio();
      if (next) SoundFX.favorite(); // confirma que voltou a tocar
      return next;
    });
  }, []);

  const play = useCallback(
    (name: keyof typeof SoundFX) => {
      if (!sound) return;
      SoundFX[name]();
    },
    [sound],
  );

  const value = useMemo(
    () => ({ motion, sound, toggleMotion, toggleSound, play }),
    [motion, sound, toggleMotion, toggleSound, play],
  );

  return <FxContext.Provider value={value}>{children}</FxContext.Provider>;
}
