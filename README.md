# Site do Senhor Lakes

Next.js 16 + Tailwind 4. Player de álbuns no estilo YouTube Music, galeria masonry
com lightbox, agenda, vídeos do YouTube e páginas estáticas (rápidas e indexáveis).

## Rodar

```bash
npm run dev
```

Abre em http://localhost:3000.

## Onde mexer

**Praticamente tudo está em [`lib/data.ts`](lib/data.ts).** Você não precisa abrir
mais nenhum arquivo para atualizar o conteúdo do site.

| O que mudar | Onde |
| --- | --- |
| E-mail, WhatsApp, Instagram, YouTube | `band` |
| Integrantes | `members` |
| Músicas | `tracks` |
| Álbuns e playlists | `albums` |
| Shows | `events` |
| Vídeos | `videos` |
| Fotos da galeria | `photos` |

### Adicionar uma música

1. Coloque o arquivo em `public/audio/`.
2. Acrescente uma linha em `tracks` com `slug`, `title`, `duration` (em segundos)
   e `src`.
3. Cite o `slug` em `trackSlugs` de algum álbum.

Para descobrir a duração: `ffprobe -v quiet -show_format public/audio/arquivo.mp3`.

### Criar um álbum

Copie um bloco de `albums` e troque `slug`, `title`, `kind`, `accent` e a lista
`trackSlugs`. A mesma música pode aparecer em vários álbuns — é assim que as
playlists funcionam.

Enquanto `artwork` for `null`, a capa é desenhada automaticamente a partir da cor
`accent`. Para usar a arte real, salve a imagem quadrada em `public/img/` e
aponte: `artwork: "/img/capa-do-album.jpg"`.

### Adicionar um vídeo

Abra o vídeo no YouTube e copie o trecho depois de `watch?v=`:

```ts
export const videos: Video[] = [
  { youtubeId: "dQw4w9WgXcQ", title: "Ao vivo no Santa Fé" },
];
```

O player do YouTube só carrega depois que a pessoa clica na miniatura — isso
mantém a página leve e sem rastreadores para quem não assiste.

### Adicionar fotos

1. Salve em `public/img/`.
2. Acrescente uma entrada em `photos` com `src`, `alt`, `category`, `caption` e
   `ratio` (largura ÷ altura da foto — `3/2` para paisagem, `2/3` para retrato).

O `ratio` é o que dá o efeito masonry: cada foto ocupa a altura proporcional à
sua forma real. As entradas com `src: null` são espaços reservados, só para você
enxergar o layout — apague conforme for subindo as fotos de verdade.

## Antes de publicar

- [ ] Trocar o domínio em [`lib/site.ts`](lib/site.ts).
- [ ] Conferir e-mail, telefone e links de Instagram/YouTube em `band`.
- [ ] Substituir os espaços reservados da galeria por fotos reais.
- [ ] Trocar as capas geradas pela arte definitiva, se houver.

## Publicar

O site é 100% estático (nenhuma página precisa de servidor). Na Vercel:

```bash
npx vercel
```

Ou `npm run build` e suba a pasta gerada em qualquer hospedagem de sites estáticos.

## Detalhes técnicos

- **Player global**: fica em `components/player/`. O `PlayerProvider` guarda um
  único elemento `<audio>` no layout, então a música não para quando você troca
  de página. Suporta fila, aleatório, repetição, atalho de espaço, e os controles
  de mídia do sistema (tela de bloqueio e botões do fone).
- **SEO**: Open Graph, Twitter Card, `sitemap.xml`, `robots.txt` e JSON-LD de
  `MusicGroup`, `MusicAlbum` e `MusicEvent` — esse último faz o Google mostrar os
  próximos shows direto no resultado de busca.
- **Acessibilidade**: navegação por teclado no player e no lightbox, foco visível,
  `prefers-reduced-motion` respeitado, e todo texto em contraste alto.

## Camada de interação

O site tem movimento e som, e as duas coisas têm botão de ligar/desligar no
canto inferior direito. A preferência fica salva no navegador de quem visita.

| Efeito | Onde mora | O que faz |
| --- | --- | --- |
| Parallax do topo | `components/fx/useParallax.ts` | Publica `--mx` / `--my` (-1 a 1). A foto anda ao contrário do mouse, o letreiro de fundo anda junto e o texto quase não se mexe — é a diferença de velocidade que cria a profundidade. |
| Cursor próprio | `components/fx/CustomCursor.tsx` | Anel que segue o ponteiro com inércia e cresce mostrando um rótulo. O rótulo vem do atributo `data-cursor` do elemento. |
| Inclinação 3D | `components/fx/Tilt.tsx` | Cartões de álbum, integrantes e fotos inclinam seguindo o ponteiro e ganham um reflexo no ponto onde ele está. |
| Glow de faíscas | `components/fx/Glow.tsx` | Aura, halo e quatro faíscas orbitando nos botões, mais um anel que sai no clique. Portado do painel da Contourline. |
| Efeitos sonoros | `lib/sound.ts` | Nove sons sintetizados na hora pela Web Audio API — zero arquivo de áudio para baixar. |

### Como usar em algo novo

```tsx
// Cursor com rótulo
<button data-cursor="PLAY">…</button>

// Glow + anel de clique
const { ripple, burst } = useRipple();
<button className="smoke-glow relative" onClick={burst}>
  <Glow ripple={ripple} />
  …
</button>

// Som
const { play } = useFx();
play("success"); // hover, click, open, close, success, navigate, favorite, magic, drop
```

Pintar o glow com outra cor: `style={{ "--glow-rgb": "201 139 107" }}` (ou
`hexToRgbTriplet("#c98b6b")`, de `lib/color.ts`). É assim que cada álbum
acende com a própria cor.

O CSS desses efeitos fica em `app/globals.css`, dentro de `@layer components`
para que os utilitários do Tailwind continuem vencendo na cascata.

### Acessibilidade

Quem tem "reduzir movimento" ligado no sistema abre o site com tudo parado —
mas se clicar no botão de movimento, a escolha explícita vence. O som nunca
toca antes do primeiro clique, porque o navegador não permite, e pode ser
desligado de vez.
