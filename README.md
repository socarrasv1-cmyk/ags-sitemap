# @ags/seo-sitemap (`socarrasv1-cmyk/ags-sitemap`)

Canonical single source of truth for truthful per-route `<lastmod>` computation and `FUTURE_LASTMOD` / `BAD_LASTMOD` guards across the 4-site AI Growth Systems network:

- `aiseowebsitedesign.com` (`socarrasv1-cmyk/intelligent-muse`)
- `seoservices.business` (`socarrasv1-cmyk/seoservices-business`)
- `websitedesign.business` (`socarrasv1-cmyk/web-design-dream-studio`)
- `aimarketingagency.services` (`socarrasv1-cmyk/aimarketingagencyservices`)

## Never Edit Vendored Copies

Each site vendors a read-only copy into `src/lib/seo-sitemap/` verified by SHA-256 `CHECKSUMS`.

To ship a change:
1. Edit files in `src/` in this repository and run `bun test`.
2. Regenerate `CHECKSUMS.src.txt` via `bash scripts/sign-release.sh`.
3. Commit, tag `vX.Y.Z`, and publish the GitHub Release with `CHECKSUMS.txt`.
4. Bump `AGS_SITEMAP_REF` in each consumer site and run `bash scripts/sync-sitemap-pkg.sh`.
