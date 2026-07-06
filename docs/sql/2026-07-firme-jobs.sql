-- v2.93: firme sugli interventi (jobs). Idempotente: eseguibile più volte senza danni.
-- Da eseguire nel SQL Editor di Supabase PRIMA di usare le firme sui job
-- (il sync passa tutte le colonne: senza queste due, l'upsert dei job fallirebbe).
alter table jobs add column if not exists technician_signature text;
alter table jobs add column if not exists department_signature text;
