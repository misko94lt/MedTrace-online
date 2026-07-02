# MedTrace v3.0 — Migrazione Vite (Fase 0: lift & shift)

**Data: 2 luglio 2026.** app.js è **byte-identico** a prima (v2.74): è cambiato solo *come* viene impacchettato e servito.

## Cosa è cambiato

| Prima | Dopo |
|---|---|
| `app.js` nella root, caricato come script classico | `src/app.js` (identico), caricato via `src/main.js` |
| React/ReactDOM/supabase-js dai CDN | Bundlati da npm — **supabase-js bloccato alla 2.110.0** (prima era "@2" flottante: un loro aggiornamento poteva cambiare la prod da solo) |
| Nessuna build | `vite build` → `dist/` (1,3 MB → ~350 KB trasferiti gzip) |
| `sw.js` nella root | `public/sw.js`, aggiornato ai nuovi percorsi (`CACHE_VERSION: medtrace-v3-0`) |
| `_redirects` | Rimosso (era una convenzione Netlify: su Vercel non ha mai fatto nulla) |

Nuovi file: `package.json` + `package-lock.json`, `vite.config.js` (nomi file stabili, niente hash), `vercel.json` (dice a Vercel: framework Vite, build `npm run build`, output `dist`), `src/main.js`, `test/`.

## Verifiche già fatte in sandbox
- ✅ Build Vite riuscita; `APP_VERSION "2.74"` presente nel bundle
- ✅ **Boot check strict-mode**: tutte le ~15.400 righe top-level eseguite come modulo ES senza errori (`node test/boot_check.js`)
- ✅ FUNC_TEMPLATES: 32 template, 152 misure, 0 sezioni senza nota, 0 limiti non numerici (`node test/validate.cjs`)
- ⚠️ I 3 wizard non sono testabili unitariamente finché restano annidati nel monolite → test rinviato alla Fase 1
- ⚠️ **Nessun test in browser vero qui** (la sandbox non ne ha): si fa sul Preview di Vercel, checklist sotto

## Come pubblicare (dal PC Windows, ~15 min, una tantum)

1. Installa Git da git-scm.com (Node serve solo se vorrai il dev server locale).
2. ```
   git clone https://github.com/misko94lt/MedTrace-online
   cd MedTrace-online
   ```
3. Cancella **tutto il contenuto TRANNE la cartella `.git`**, poi scompatta qui dentro lo zip `medtrace-vite.zip`.
4. ```
   git checkout -b vite
   git add -A
   git commit -m "v3.0 - migrazione Vite (lift & shift, app.js invariato)"
   git push -u origin vite
   ```
5. Su GitHub apri la **Pull Request** del branch `vite` → Vercel commenta con un **Preview URL**.
   - ⚠️ Se oggi deployi con drag&drop e il progetto Vercel NON è collegato al repo: collegalo prima (Vercel → progetto → Settings → Git). Il `vercel.json` incluso imposta già build e output giusti.
6. **Checklist sul Preview** (non su prod): login · aprire un wizard Func, uno IEC (flag "installato permanentemente"), uno PPM · scaricare un PDF · sync Supabase · modalità aereo + ricarica (offline PWA) · installazione PWA su telefono.
7. Se tutto ok → **Merge** su main = va in produzione.

## Rollback
Vercel → Deployments → **Instant Rollback** sul deploy precedente (oppure revert del merge su GitHub). Il vecchio deploy resta lì, intoccato.

## D'ora in poi
- La versione dell'app resta `APP_VERSION` in `src/app.js`; a ogni release **bump anche `CACHE_VERSION`** in `public/sw.js` (come facevi già).
- Test rapidi: `npm test` (validate) e `node test/boot_check.js`.
- Dev locale quando servirà (RFID): `npm install` poi `npm run dev`.
