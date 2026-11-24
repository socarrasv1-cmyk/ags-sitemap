import type { ContentRecord, SitemapType } from "./schema";
import { lastmodFor } from "./lastmod";

export function buildSitemaps(
  domain: string,
  records: ContentRecord[],
  now: Date,
): Record<string, string> {
  const live = records.filter(
    (r) => r.indexable && r.url.startsWith(`https://${domain}/`),
  );
  const byType = new Map<SitemapType, ContentRecord[]>();
  for (const r of live) {
    byType.set(r.type, [...(byType.get(r.type) ?? []), r]);
  }

  const files: Record<string, string> = {};
  for (const [type, pages] of byType) {
    files[`sitemap-${type}.xml`] =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `${pages
        .map((p) => {
          const lm = lastmodFor(p, now);
          return `  <url>\n    <loc>${p.url}</loc>${lm ? `\n    <lastmod>${lm}</lastmod>` : ""}\n  </url>`;
        })
        .join("\n")}\n` +
      `</urlset>\n`;
  }

  files["sitemap.xml"] =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${[...byType.keys()]
      .map(
        (t) =>
          `  <sitemap>\n    <loc>https://${domain}/sitemap-${t}.xml</loc>\n  </sitemap>`,
      )
      .join("\n")}\n` +
    `</sitemapindex>\n`;

  return files;
}
