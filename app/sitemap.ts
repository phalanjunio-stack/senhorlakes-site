import type { MetadataRoute } from "next";
import { albums } from "@/lib/data";
import { siteUrl } from "@/lib/site";

/* Exigido pela exportação estática. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, priority: 1 },
    { url: `${siteUrl}/albuns`, lastModified: now, priority: 0.8 },
    { url: `${siteUrl}/historias`, lastModified: now, priority: 0.7 },
    { url: `${siteUrl}/galeria`, lastModified: now, priority: 0.6 },
    ...albums.map((album) => ({
      url: `${siteUrl}/albuns/${album.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
