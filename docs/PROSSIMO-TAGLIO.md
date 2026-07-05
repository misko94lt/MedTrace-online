# Prossimo taglio: src/lib/sync.js (ricetta completa, sessione 3 lug 2026)

Base attesa: APP_VERSION "2.83". Metodo: script node+acorn come i tagli precedenti (vedi commit e047d1f/3cda41d).

**Funzioni top-level da prendere** (regex): `^(supabase[A-Z]\w*|loadData|saveData|upsertInList|getSupa|getSupabaseClient|toSnakeRecord|toCamelRecord|toSnake|toCamel|mirrorToIdb|idbSet|idbGet|idbDel|idbOpen|storageUsage|getSupabaseConfig)$`

**Variabili top-level da prendere**: SUPA_URL, SUPA_KEY, _supa, _supabaseClient, _supabaseLibPromise, SUPABASE_CHUNK, SUPABASE_TABLES, STORAGE_KEY, OFFLINE_MODE, _storageWarnedPct, _quotaAlerted, _bootData, _bootDone

**Nodo noto (guardia let)**: `_bootData` (e verificare `_bootDone`) sono riassegnati fuori dal modulo → applicare il pattern setter già usato per `_instrumentsRegistry` in reports.js (commit 3cda41d): tenerli privati nel modulo, esportare `setBootData(v)`/`setBootDone(v)`, sostituire le assegnazioni in app.js (trovarle con `grep -n "_bootData *=\|_bootDone *=" src/app.js` escludendo i `let`).

Import del modulo: `__awaiter, __rest` da ./tslib.js. Bump: v2.84, sw medtrace-v3-9. Gate baseline eslint: "2 problems" (DEMO_SEED, falsi positivi noti).

Dopo questo taglio = plateau: si costruisce la scan-mode RFID come modulo nuovo, poi pagine e wizard con calma.
