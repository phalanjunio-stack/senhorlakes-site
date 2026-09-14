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
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled || open ? "border-b border-[var(--line)] bg-ink/85 backdrop-blur-md" : ""
      }`}
    >
      <div className="page-width flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${band.name} — início`}>
          <Image src="/img/logo.png" alt="" width={44} height={53} className="h-11 w-auto" priority />
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
          className="grid size-10 place-items-center text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          className="page-width flex flex-col gap-1 pb-8 lg:hidden"
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
