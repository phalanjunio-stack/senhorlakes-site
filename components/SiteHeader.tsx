"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useFx } from "@/components/fx/FxProvider";
import { band } from "@/lib/data";

const links = [
  { href: "/#inicio", label: "Início" },
  { href: "/#banda", label: "Banda" },
  { href: "/#agenda", label: "Agenda" },
  { href: "/albuns", label: "Álbuns" },
  { href: "/#videos", label: "Vídeos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/#contato", label: "Contato" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { play } = useFx();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      /* A barra escura ao rolar só aparece a partir do desktop: no celular
         a logo e o botão de menu já se leem sozinhos sobre o fundo escuro
         do site, e a barra virava uma faixa atravessada no meio da arte.

         Com o menu aberto ela volta em qualquer tamanho — sem ela os
         itens do menu ficariam por cima do conteúdo, ilegíveis. No celular
         vai além e toma a tela inteira (`bottom-0`), senão o painel
         terminava logo depois de "Contato" e o conteúdo da página
         reaparecia embaixo, como se o menu não tivesse fechado o quadro.
         Uso `bottom-0` e não uma altura fixa porque a barra de endereço do
         navegador móvel aparece e some: o elemento fixo acompanha sozinho.
         A borda de baixo só faz sentido no desktop; em tela cheia ela cairia
         rente ao fim da tela. */
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        open
          ? "bottom-0 flex flex-col bg-ink/85 backdrop-blur-md lg:bottom-auto lg:block lg:border-b lg:border-[var(--line)]"
          : scrolled
            ? "lg:border-b lg:border-[var(--line)] lg:bg-ink/85 lg:backdrop-blur-md"
            : ""
      }`}
    >
      {/* No celular a logo fica centralizada e maior: sem o título escrito
          sobre a arte, ela virou a única assinatura da página, e no canto
          se perdia. O posicionamento absoluto tira ela do fluxo, então o
          centro é o da tela — e não o do espaço que sobra ao lado do
          botão de menu. No desktop nada muda: continua à esquerda, na
          linha do menu. */}
      <div className="page-width relative flex h-20 shrink-0 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="absolute left-1/2 flex shrink-0 -translate-x-1/2 items-center gap-3 lg:static lg:translate-x-0"
          aria-label={`${band.name} — início`}
        >
          <Image
            src="/img/logo.png"
            alt=""
            width={54}
            height={64}
            className="logo-breathe h-16 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] lg:h-16 lg:drop-shadow-none"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
             
              onClick={() => play("open")}
              className="font-display text-xs font-semibold tracking-[0.22em] text-paper/85 uppercase transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-display hidden text-right text-[0.68rem] leading-tight tracking-[0.18em] text-paper/70 uppercase xl:block">
          Mais que música.
          <br />
          <strong className="text-paper">Boas histórias.</strong>
        </p>

        <button
          type="button"
         
          onClick={() => {
            play(open ? "close" : "open");
            setOpen((value) => !value);
          }}
          className="ml-auto grid size-10 place-items-center text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* `flex-1` faz a lista ocupar o que sobra da tela; `overflow-y-auto`
          é o seguro para o celular deitado, onde os sete itens não cabem
          de uma vez. O respiro de baixo cresce com a barra do player, que
          fica por cima do menu agora que ele vai até o fim da tela —
          `--player-h` é 0 quando não há música tocando, então em repouso
          isso é o mesmo `pb-8` de antes. */}
      {open && (
        <nav
          id="menu-mobile"
          className="page-width flex flex-1 flex-col gap-1 overflow-y-auto pb-[calc(var(--player-h)+2rem)] lg:hidden"
          aria-label="Navegação principal"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => play("open")}
              className="font-display border-b border-[var(--line)] py-4 text-2xl font-extrabold tracking-tight text-paper uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
