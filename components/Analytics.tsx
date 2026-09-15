import Script from "next/script";
import { config } from "@/lib/data";

/**
 * Google Analytics 4.
 *
 * Só entra na página quando há um código preenchido. Sem essa guarda o
 * site carregaria um script do Google em toda visita sem medir nada — e
 * passaria a instalar cookie de terceiro à toa, o que muda o que o site
 * precisa avisar para quem visita.
 *
 * O código fica no conteúdo, não aqui: quem cria a conta do Analytics é
 * quem cuida da banda, e trocar isso não pode exigir mexer em código.
 */
export default function Analytics() {
  const id = config.googleAnalyticsId?.trim();
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
