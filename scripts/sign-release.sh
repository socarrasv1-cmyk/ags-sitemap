#!/usr/bin/env bash
# ags-sitemap/scripts/sign-release.sh — run by CI on every v* tag
set -euo pipefail
TAG="${GITHUB_REF_NAME:-$(git describe --tags --exact-match 2>/dev/null || echo HEAD)}"
bun test || { echo "Tests must pass before signing"; exit 1; }

# 1) Archive src/ from a CLEAN git tree (never dirty working tree)
git archive --format=tar.gz -o "pkg.tgz" "${TAG}" "src/"
echo "  src/ tree archived at ${TAG}"

# 2) Per-file checksums (goes inside the release + extracted into vendored CHECKSUMS)
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
tar -xzf pkg.tgz -C "$TMP"
( cd "$TMP/src" && find . -type f -name '*.ts' | sort \
  | xargs sha256sum | sed 's|\./||' ) > CHECKSUMS.src.txt

# 3) Tarball-level hash (trust anchor verified before extraction)
{ echo "$(sha256sum pkg.tgz | cut -d' ' -f1)  pkg.tgz"; } > CHECKSUMS.txt
echo "Signed ${TAG}: $(cat CHECKSUMS.txt)"
