import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o Next procure o lock file fora da pasta do projeto
  turbopack: { root: import.meta.dirname },
  images: {
    // Miniaturas dos vídeos do YouTube
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default nextConfig;
