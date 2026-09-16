/** Domínio final do site — usado em metadata, sitemap e JSON-LD. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srlakes.com.br";

/** Prefixo quando o site não é servido na raiz (caso do GitHub Pages). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixa um caminho de /public com o basePath.
 *
 * O next/image e o Link já fazem isso sozinhos — use esta função apenas
 * onde o caminho é montado à mão: o src do <audio> e as imagens de fundo
 * em CSS.
 */
export const asset = (path: string) => `${basePath}${path}`;
