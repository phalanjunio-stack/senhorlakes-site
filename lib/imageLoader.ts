import { basePath } from "./site";

/**
 * Loader de imagens do next/image.
 *
 * Na exportação estática não existe otimizador, e o next/image NÃO
 * aplica o basePath sozinho no src — as imagens apontavam para a raiz
 * do domínio e quebravam no GitHub Pages. Este loader devolve o caminho
 * já prefixado. URLs absolutas (miniaturas do YouTube) passam direto.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (/^https?:\/\//.test(src)) return src;
  return `${basePath}${src}`;
}
