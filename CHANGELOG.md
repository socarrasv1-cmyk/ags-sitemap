# Changelog

## v1.0.0 (2026-11-24)
- Initial canonical release of `@ags/seo-sitemap`.
- `ContentRecord` & `SitemapType` schema (`src/schema.ts`).
- `lastmodFor(page, now)` with `contentUpdatedAt -> max(section editedAt) -> firstPublishedAt` precedence, omit-on-empty, `BAD_LASTMOD`, and `FUTURE_LASTMOD` guards (`src/lastmod.ts`).
- `buildSitemaps(domain, records, now)` per-type XML generator (`src/generate.ts`).
- Signed `CHECKSUMS.src.txt` and release `CHECKSUMS.txt` manifest for verify-before-extract vendoring.
