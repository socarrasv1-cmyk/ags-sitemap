#!/usr/bin/env bash
set -euo pipefail
( cd src && sha256sum generate.ts index.ts lastmod.ts schema.ts > ../CHECKSUMS.src.txt )
echo "Generated CHECKSUMS.src.txt:"
cat CHECKSUMS.src.txt
