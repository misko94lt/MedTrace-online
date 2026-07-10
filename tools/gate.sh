#!/usr/bin/env bash
# Gate MedTrace — unica via di verifica. set -euo pipefail: nessun fallimento mascherato.
set -euo pipefail
cd "$(dirname "$0")/.."
for f in src/app.js src/lib/*.js src/components/*.js src/constants/*.js; do node --check "$f"; done
echo "GATE syntax OK"
# eslint esce 1 con la baseline attesa (2 errors DEMO_SEED): tolleriamo SOLO qui, decide il contenuto
ESL=$(npx eslint src/ 2>&1 | tail -2 | head -1 || true)
if [[ "$ESL" != *"2 problems (2 errors, 0 warnings)"* ]]; then echo "GATE ESLINT FAIL: baseline cambiata → $ESL"; npx eslint src/ 2>&1 | tail -8; exit 1; fi
echo "GATE eslint baseline OK (2 problems attesi: DEMO_SEED)"
node test/boot_check.js
node test/render_check.js
node test/wizard_check.js
node test/pdf_check.js
node test/validate.cjs
npm run build 2>&1 | tail -1
echo "GATE COMPLETO: TUTTO VERDE"
