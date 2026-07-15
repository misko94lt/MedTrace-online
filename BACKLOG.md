# MedTrace — Backlog consolidato (da tutti gli audit)

> Aggiornato: 13/07/2026 sera (v3.42 in produzione). Fonti: [A] Audit "AI-looking → Linear/Notion" 01/07 · [B] Benchmark 5 assi (data model, UX, IEC, GDPR, RFID) 01/07 · [C] Audit portale clienti 01/07 · [D] Deep research UX desktop+mobile 12/07 · [E] Audit visivo screenshot 12/07 · [F] Audit numerico design system 12/07 · [G] Dizionario IEC IT→EN 10/07.
> Stati: ✅ fatto · 🔧 in corso · ⬜ da fare · 🧊 deferito (decisione presa) · ❓ da spuntare contro il report originale.

## 1. i18n — inglese (fonte G) — IL CANTIERE APERTO
- ✅ Infrastruttura `__t()` + selettore lingua (login + impostazioni) — v3.10-3.13
- ✅ Lotti: base/portale/rfid · jobs/fatturazione · settings/dashboard/strumenti · assets/PPM — ~900 voci
- ✅ **Verifiche** (197 trad. IEC verbatim) + tutorial SVG nel wizard + tutorial tradotti (57) — v3.31-3.33
- ✅ **Main** (giro 8: 650 punti, ~400 trad.) + gruppi/onboarding + rifinitura stringhe costruite + caccia globale (149) — v3.34-3.40
- ✅ Terminologia owner: **Jobs** (44 voci), **EST**, **PPM** (menu+titolo) — v3.38-3.42
- ⬜ **Guida** (113 blocchi lunghi, trattare come documento) — L — sessione dedicata
- ⬜ **PDF/report** (~81) + design lingua-per-cliente: campo `language` su anagrafica cliente, `tFor(lang)` nel generatore (lingua del destinatario, non della UI), report ASL restano IT — M — PROSSIMO
- ⬜ Template tecnici (~319, mappa dedicata) — M — per ultimi
- ⬜ Privacy/Terms EN: traduzione tecnica + **revisione legale esterna** — S + esterno

## 2. Design system — seconda passata coi numeri (fonte A+F)
Prima passata fatta (v3.19: font 31→23, radius 18→10, no 900). Target finali [A]:
- ⬜ Type scale a **5-7 taglie** (base 14, tabular numbers per i dati) — M
- ⬜ Radius su scala **4/6/8** (+pill) — S
- ⬜ Griglia spacing **8px** (oggi 118 pattern) — M
- ⬜ **Icon set Lucide** unificato al posto delle SVG artigianali sparse — M
- ⬜ Colori: 133 hex hardcoded → token semantici (incl. opacità); palette near-neutral, un accent parsimonioso — M
- ⬜ Bordi 1px/hairline al posto delle ombre residue; niente "card soup" — S
- ✅ Emoji eliminate (v3.21+3.23) · ✅ peso 900 eliminato

## 3. UX mobile (fonte D+E) — quasi chiuso
- ✅ Menu raggruppato · bottom nav 5 voci · dashboard exception-first · settings accordion · light default · header unificato · camera ghost · barre a dieta con ⋯ · sticker su card · X role-based · vista compatta ovunque
- ⬜ ZIP verifiche nel menu ⋯ — S
- ⬜ Monospace solo sui codici (via da contatori/date) — S

## 4. UX desktop (fonte D) — SESSIONE AL PC
- ⬜ Tabelle ordinabili + azioni bulk su tutte le liste (oggi solo alcune) — M
- ⬜ Dettagli: modale → pagina/pannello laterale (two-pane) — M
- ⬜ Audit colori light mode con screenshot chiari — S

## 5. Robustezza / architettura
- ✅ Sync: chunk a budget byte 200KB + retry (v3.27+3.30)
- ✅ Auto-pull primo avvio autenticato (v3.25)
- ⬜ **Firme → Supabase Storage** (URL nel record): sync 10× più leggeri, chiude il problema payload — M — pre-lancio
- ⬜ Gate: `components_check` per componenti dentro modali (gap TecniciManager) — S/M
- 🧊 Audit trail tamper-evidente + label "CEI 62-148" sui template 62353 — solo se target ASUGI/ASL (decisione mercato in autunno)

## 6. Portale clienti (repo Portale-clienti) (fonte C)
- ⬜ **Test RLS** prima dei clienti reali — S — SICUREZZA, priorità alta
- ⬜ Rewire componenti (bottoni/badge/tab/input inline → pattern MedTrace) — M — rimasto in sospeso dal 01/07
- ❓ Checklist funzionalità+UX del report [C] da spuntare voce per voce — sessione dedicata
- ⬜ i18n portale (dopo l'app) — M
- ❓ GDPR/WCAG del portale (dal report [C]) — da spuntare

## 7. Legale / compliance (fonte B)
- ❓ Privacy policy art.13, DPA art.28, Termini B2B, qualificazione cloud ACN: **spunta sistematica mai fatta** contro il report [B] — sessione dedicata (con eventuale supporto legale)
- ✅ Completezza documentale IEC 62353 (misure, limiti, metodi, periodicità, firma) — chiusa nei mesi scorsi
- ❓ RFID/ETSI EN 302 208 (banda, on-metal, EMI, pulizia tag): raccomandazioni [B] da rileggere quando arriva il Chainway R6

## 8. Landing + demo (repo Medtrace-landing, medtrace-demo)
- ⬜ Screenshot nuovi (dashboard, KPI, manutenzione, verifica, lista, scheda, portale + kpi.jpg, manutenzione.jpg) — **dopo** fine restyling+i18n, in light — S (foto di Luca)
- ⬜ Refresh demo alla UI nuova — S
- ✅ Contenuti landing: dual-audience, trilingue, prezzi — fatti a giugno

## Ordine proposto
1→ finire i18n app (lotti 1) · 2→ design system passata due [A] · 3→ sessione desktop [D] · 4→ firme Storage + RLS portale · 5→ spunte ❓ (portale [C], legale [B]) in sessioni dedicate coi report aperti · 6→ landing/demo a vetrina pronta.
