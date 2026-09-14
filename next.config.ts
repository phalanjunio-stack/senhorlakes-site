import type { NextConfig } from "next";

/* No GitHub Pages o site é servido em /<nome-do-repo>/, não na raiz.
   O workflow define NEXT_PUBLIC_BASE_PATH; rodando local ele fica vazio. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Evita que o Next procure o lock file fora da pasta do projeto
  turbopack: { root: import.meta.dirname },

  /* Exportação estática: o site vira HTML puro, sem servidor. Todas as
     páginas já eram estáticas, então nada se perde. */
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,

  images: {
    // O otimizador de imagens do Next precisa de servidor; na exportação
    // as imagens vão como estão.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default nextConfig;
