# Site do Senhor Lakes

Next.js 16 + Tailwind 4. Player de álbuns no estilo YouTube Music, galeria masonry
com lightbox, agenda, vídeos do YouTube e páginas estáticas (rápidas e indexáveis).

## Rodar

```bash
npm run dev
```

Abre em http://localhost:3000.

## Painel de administração

**https://app.pagescms.org** — entre com a conta do GitHub e escolha este
repositório. Não precisa instalar nada nem mexer em código.

O painel tem sete seções: agenda de shows, galeria de fotos, vídeos, álbuns,
músicas, integrantes e contato. Fotos são enviadas arrastando para o campo.

Quando você salva, o painel faz um commit aqui; o GitHub Actions reconstrói o
site e publica sozinho. Leva cerca de dois minutos até aparecer no ar.

Os formulários são descritos em [`.pages.yml`](.pages.yml) — mexer nesse arquivo
muda os campos que aparecem no painel.

## Onde mexer no conteúdo sem o painel

O conteúdo fica em **[`content/`](content)**, em arquivos JSON. Editar
direto ali funciona igual — o painel só é uma forma mais confortável.

| O que mudar | Arquivo |
| --- | --- |
| E-mail, WhatsApp, Instagram, YouTube | `content/banda.json` |
| Integrantes | `content/integrantes.json` |
| Músicas | `content/faixas.json` |
| Álbuns e playlists | `content/albuns.json` |
| Shows | `content/shows.json` |
| Vídeos | `content/videos.json` |
| Fotos da galeria | `content/fotos.json` |

[`lib/data.ts`](lib/data.ts) lê esses arquivos, dá tipo a eles e guarda as
funções de apoio. Só mexa nele para mudar as regras, não o conteúdo.

### Adicionar um show

No painel, seção **Agenda de shows**. Data, cidade e local são obrigatórios; o
link de detalhes é opcional.

Shows que já passaram somem da home **na próxima vez que o site for
reconstruído** — e não sozinhos no navegador de quem visita. Como qualquer
alteração no painel reconstrói o site, na prática eles somem quando você mexer
em qualquer coisa. Se ficar muito tempo sem mexer, um show vencido pode
continuar aparecendo.

### Adicionar fotos

No painel, seção **Galeria de fotos**. Arraste a imagem para o campo Foto — ela
sobe para `public/img` sozinha.

O campo **Formato da foto** é o que dá o efeito de mosaico: cada foto ocupa a
altura proporcional à forma real dela. Escolher errado deixa a imagem
espremida ou esticada no lugar dela na grade.

As entradas sem foto são espaços reservados, só para enxergar o layout. Apague
conforme for subindo as fotos de verdade.

### Adicionar um vídeo

No painel, seção **Vídeos**. Abra o vídeo no YouTube e copie só o trecho depois
de `watch?v=` — em `youtube.com/watch?v=dQw4w9WgXcQ`, o código é `dQw4w9WgXcQ`.

O player do YouTube só carrega depois que a pessoa clica na miniatura — isso
mantém a página leve e sem rastreadores para quem não assiste.

### Adicionar uma música

Esta é a única que ainda precisa de um passo fora do painel: **o arquivo MP3
tem que ser enviado para `public/audio/`** pelo GitHub, porque o painel só sobe
imagens.

1. No GitHub, entre em `public/audio` e arraste o MP3 para lá.
2. No painel, seção **Músicas**, adicione uma entrada com o código, o título, a
   duração em segundos e o caminho do arquivo (`/audio/nome.mp3`).
3. Na seção **Álbuns**, cite o código da música na lista de faixas.

Para descobrir a duração: `ffprobe -v quiet -show_format public/audio/arquivo.mp3`.
Ou veja no seu player e converta — 3:55 são 235 segundos.

### Criar um álbum

No painel, seção **Álbuns e playlists**. A mesma música pode aparecer em vários
álbuns — é assim que as playlists funcionam.

Sem capa, o site desenha uma automaticamente a partir da cor que você escolher.
Para usar a arte real, arraste a imagem quadrada para o campo Capa.

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

## Publicado

**https://phalanjunio-stack.github.io/senhorlakes-site/**

Fica no branch `gh-pages` do repositório. Para atualizar depois de mexer
no site:

```bash
NEXT_PUBLIC_BASE_PATH=/senhorlakes-site NEXT_PUBLIC_SITE_URL=https://phalanjunio-stack.github.io/senhorlakes-site npm run build
```

No **Git Bash do Windows** esse comando falha: ele traduz `/senhorlakes-site`
para um caminho do Windows e o build reclama que o basePath não começa com
`/`. Use o PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/senhorlakes-site"; $env:NEXT_PUBLIC_SITE_URL = "https://phalanjunio-stack.github.io/senhorlakes-site"; npm run build
```

Depois publique o conteúdo de `out/` no branch `gh-pages`. **Crie um arquivo
vazio `out/.nojekyll` antes de publicar** — sem ele o GitHub Pages ignora a
pasta `_next/`, e o site sobe sem CSS nem JavaScript.

Para o deploy virar automático a cada push, rode uma vez:

```bash
gh auth refresh -s workflow
```

e mova `.deploy/pages.yml.txt` para `.github/workflows/pages.yml`. O
token atual não tem permissão para criar workflows, por isso o arquivo
está guardado fora dessa pasta.

### Quando houver domínio próprio

Troque `siteUrl` em `lib/site.ts`, aponte o domínio para o GitHub Pages
e apague o `NEXT_PUBLIC_BASE_PATH` — na raiz de um domínio o site não
precisa de prefixo.
