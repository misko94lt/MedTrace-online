/* FUNC_TEMPLATES - 32 template di verifica funzionale (estratto verbatim da app.js, fase 1) */
export const FUNC_TEMPLATES = {
"bbraun_infusomat_space_tsc": {
label: "Pompa infusione B. Braun Infusomat Space — TSC", icon: "›", norm: "TSC PRID00001229 (M686_000871, v1TSC) / IEC 60601-2-24 / IEC 62353",
intervalMonths: 24,
requireAllItems: true,
sections: [
{ id: "ispezione", title: "T1 — Ispezione visiva e meccanica", note: "Procedura: a pompa spenta e scollegata dal paziente, controlla involucro, sportello, leva di chiusura, safety clamp e testa peristaltica integri; targhetta, n° serie e sigillo presenti; pulizia generale; batteria presente e fissata.\nGap safety clamp con spessimetri DIN 2275 (tolleranza T2): lo spessore 0,3 mm deve entrare senza forzare, lo 0,6 mm NON deve entrare.", items: [
{ id: "ifu", text: "Istruzioni d'uso disponibili; targhetta e n° serie presenti" },
{ id: "danni", text: "Nessun danno meccanico sull'Infusomat Space" },
{ id: "sigillo", text: "Sigillo presente e integro" },
{ id: "pulizia", text: "Apparecchio pulito" },
{ id: "batteria_pres", text: "Batteria presente e in sede" },
{ id: "sportello", text: "Sportello pompa, leva e safety clamp: integri e funzionanti" },
{ id: "peristaltica", text: "Testa peristaltica e meccanismo: integri" },
{ id: "etichette", text: "Etichette CE, n° serie, identificazione cespite: leggibili" },
{ id: "gap_ok", text: "Gap safety clamp 0,3–0,6 mm: conforme" },
], measures: [
{ id: "gap_clamp", name: "Gap safety clamp (spessimetro 0,3 entra senza forza, 0,6 NON entra)", unit: "mm", expected: "0,3–0,6 mm", value: "" },
] },
{ id: "autotest", title: "Accensione e autotest", note: "Procedura: accendi la pompa e osserva l'autotest — il display mostra 'Self test active', due toni acustici, i LED lampeggiano (giallo, rosso/verde, blu). Verifica batteria carica e lingua impostata corretta.", items: [
{ id: "selftest", text: "Self-test attivo, display regolare" },
{ id: "toni", text: "Due toni di segnale udibili" },
{ id: "led", text: "LED lampeggiano (giallo, rosso/verde, blu)" },
{ id: "batt_carica", text: "Batteria carica" },
{ id: "lingua", text: "Lingua impostata corretta" },
] },
{ id: "funzionale", title: "Prova funzionale (Final Inspection Sheet)", note: "Apparecchio non collegato al paziente.\nProcedura: apri lo sportello, inserisci una linea innescata, chiudi lo sportello; conferma la linea e nega il priming. Imposta 1,1 mL/h e avvia (LED verde, frecce da destra a sinistra). Eroga un bolo da 3 mL (BOL → OK). Chiudi la roller clamp: LED rosso + allarme occlusione; conferma l'allarme (OK), riapri la clamp e verifica la ripartenza.", items: [
{ id: "linea", text: "Sportello aperto, linea innescata inserita, sportello chiuso; linea confermata; priming negato" },
{ id: "eroga", text: "Erogazione a 1,1 mL/h: LED verde acceso, frecce da destra a sinistra" },
{ id: "bolo", text: "Bolo 3 mL erogato (BOL → OK gira correttamente); PCA bolus = LED verde" },
{ id: "occl_clamp", text: "Roller clamp chiusa: LED rosso acceso, allarme occlusione visualizzato" },
{ id: "conferma", text: "Allarme confermato (OK), roller clamp aperta, ripartenza regolare" },
] },
{ id: "t4_aria", title: "T4 — Sensore aria in linea", note: "Procedura: con la linea riempita d'acqua, leggi il segnale del sensore aria — atteso 1100–2250 mV (liquido presente). Introduci aria nel tratto del sensore: il valore deve scendere < 100 mV e deve scattare l'allarme aria.\nSe il valore è fuori scala, rileggi dopo 60 s.", items: [
{ id: "all_aria", text: "Allarme aria: presente e corretto" },
{ id: "aria_ok", text: "Valori sensore aria/acqua nei limiti: conforme" },
], measures: [
{ id: "aria_mv", name: "Valore aria", unit: "mV", expected: "< 100 mV", value: "" },
{ id: "acqua_mv", name: "Valore acqua", unit: "mV", expected: "1100–2250 mV", value: "" },
] },
{ id: "t5_pressione", title: "T5 — Pressione di occlusione (downstream)", note: "Procedura: collega un manometro a valle (downstream) con l'adattatore Luer Lock 6 mm.\n• Elettronica (250 mL/h, senza drop sensor): chiudi a valle per generare l'occlusione e leggi la pressione di intervento — Stadio 2 = 0,1–0,6 bar, Stadio 9 = 0,8–1,4 bar.\n• Meccanica: inserisci il service plug SP (disattiva il cut-off elettronico) e verifica la pressione generata dal sistema meccanico — Pmax 1,8–2,5 bar, Pmin > 1,5 bar.\n• Safety clamp: verifica la pressione minima di tenuta > 1,2 bar.\n• Upstream: verifica solo la presenza dell'allarme a monte (nessun valore).", items: [
{ id: "upstream", text: "Allarme upstream: presente (solo allarme, nessun valore)" },
{ id: "press_ok", text: "Pressioni di occlusione nei limiti (elettronica, meccanica, safety clamp): conforme" },
], measures: [
{ id: "el_st2", name: "Elettronica — Stadio 2 (250 mL/h, senza drop sensor)", unit: "bar", expected: "0,1–0,6 bar (1,5–8,7 psi)", value: "" },
{ id: "el_st9", name: "Elettronica — Stadio 9 (250 mL/h, senza drop sensor)", unit: "bar", expected: "0,8–1,4 bar (11–20 psi)", value: "" },
{ id: "mec_pmax", name: "Meccanica — Pmax (service plug SP inserito)", unit: "bar", expected: "1,8–2,5 bar (26–36 psi)", value: "" },
{ id: "mec_pmin", name: "Meccanica — Pmin (service plug SP inserito)", unit: "bar", expected: "> 1,5 bar (> 22 psi)", value: "" },
{ id: "clamp_pmin", name: "Safety clamp — Pmin", unit: "bar", expected: "> 1,2 bar (> 17 psi)", value: "" },
] },
{ id: "t6_drop", title: "T6 — Drop sensor (pass/fail)", note: "Procedura: con il drop sensor montato sulla camera di gocciolamento — simula un flusso libero/getto: l'allarme deve scattare immediatamente; simula un'occlusione (assenza di gocce): l'allarme deve scattare entro 5 s.", items: [
{ id: "drop_flusso", text: "Allarme flusso (getto): immediato" },
{ id: "drop_occl", text: "Allarme occlusione: entro 5 s" },
] },
{ id: "t7_portata", title: "T7 — Accuratezza di portata (tolleranza ±5%)", note: "Eseguire UNO dei due metodi (tempo o peso) e compilare la riga corrispondente.\n• METODO TEMPO: imposta 250 mL/h, VTBI ≥ 30 mL. Innesca la linea ed elimina l'aria. Avvia ed eroga in un cilindro graduato cronometrando il tempo per erogare 25 mL. Conforme: 5:42–6:18 (a 250 mL/h, 25 mL = 6 min teorici, ±5%).\n• METODO PESO (gravimetrico): imposta 250 mL/h. Tara il becher di raccolta sulla bilancia di precisione. Eroga per 12 min raccogliendo l'acqua → peso atteso 47,5–52,5 g (50 g teorici, ±5%); in alternativa 6 min → 23,75–26,25 g (1 mL d'acqua ≈ 1 g, usa acqua a temperatura nota).\nNessuna tolleranza sul bolo (solo prova funzionale). Il metodo matraccio B. Braun (livelli 1–7) è opzionale: vedi protocollo TSC.", items: [
{ id: "acc_ok", text: "Accuratezza di portata entro ±5% (metodo eseguito): conforme" }
], measures: [
{ id: "alt2_tempo", name: "Metodo tempo: 250 mL/h, VTBI ≥ 30 mL, cronometro su 25 mL", unit: "mm:ss", expected: "5:42–6:18 (±5%)", value: "" },
{ id: "alt3_peso", name: "Metodo peso: 250 mL/h, raccolta 12 min (o 6 min)", unit: "g", expected: "47,5–52,5 g (12 min) o 23,75–26,25 g (6 min)", value: "" },
{ id: "alt1_matraccio", name: "Metodo matraccio B. Braun (opzionale): 750 mL/h, VTBI 25 mL, livelli 1–7", unit: "%", expected: "−5% / +5%", value: "" },
] },
{ id: "batteria", title: "Batteria e piezo", note: "Procedura batteria: se la batteria ha più di 8 anni, esegui il battery check OPPURE sostituiscila (uno dei due è obbligatorio per superare).\nProcedura piezo: attiva il buzzer/tono alto e verifica che suoni per ≥ 3 min con frequenza costante, senza rallentare né affievolirsi.", items: [
{ id: "batt_check", text: "Battery check eseguito (se batteria > 8 anni)" },
{ id: "batt_sost", text: "— oppure — Batteria sostituita (se > 8 anni)" },
{ id: "piezo", text: "Piezo test: buzzer tono alto ≥ 3 min, frequenza costante, non rallenta/affievolisce" },
] },
{ id: "elettrica", title: "Sicurezza elettrica IEC 62353", note: "La dispersione paziente/apparecchio dell'Infusomat è causata SOLO dall'alimentatore. La sicurezza elettrica NON si misura sulla pompa: si verifica sull'alimentatore SP/SpaceStation con TSC separato (PRID00003912).", items: [
{ id: "el_psu", text: "Sicurezza elettrica eseguita sull'alimentatore SP/SpaceStation (TSC PRID00003912): conforme" },
{ id: "el_rif", text: "Riferimento rapporto sicurezza elettrica alimentatore registrato" },
] },
]
},
"audiometro": {
label: "Audiometro", icon: "›", norm: "IEC 60645-1:2017 / ISO 389 / ISO 8253",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "involucro", text: "Involucro, display, tastiera/encoder: integri e puliti" },
{ id: "cuffie", text: "Cuffie/auricolari e cavi: cuscinetti integri, nessun taglio" },
{ id: "osseo", text: "Vibratore osseo e archetto: integri" },
{ id: "risposta", text: "Pulsante risposta paziente: funzionante" },
{ id: "taratura", text: "Taratura periodica in corso di validità" },
{ id: "etichette", text: "Etichette CE, n° serie, identificazione cespite: leggibili" },
] },
{ id: "ambiente", title: "Condizioni ambientali", items: [
{ id: "cabina", text: "Cabina/ambiente silente: rumore di fondo accettabile per la prova" },
] },
{ id: "via_aerea", title: "Uscita via aerea (IEC 60645-1)", note: "Orecchio artificiale/accoppiatore (IEC 60318) + fonometro/calibratore. Frequenze standard 125–8000 Hz.", items: [
{ id: "accoppiatore", text: "Orecchio artificiale/accoppiatore collegato e calibrato" },
], measures: [
{ id: "lev_1000", name: "Livello 1000 Hz a 70 dB HL — letto", unit: "dB SPL", expected: "dipende dal trasduttore (RETSPL ISO 389) — registrare il trasduttore", value: "" },
{ id: "lev_250", name: "Errore di livello 250 Hz", unit: "dB", expected: "≤ ±3 dB (fino a 5000 Hz; IEC 60645-1)", value: "" },
{ id: "lev_4000", name: "Errore di livello 4000 Hz", unit: "dB", expected: "≤ ±3 dB (fino a 5000 Hz; IEC 60645-1)", value: "" },
{ id: "err_freq", name: "Errore di frequenza (max)", unit: "%", expected: "≤ ±1% del valore nominale", value: "" },
] },
{ id: "attenuatore", title: "Linearità attenuatore", note: "Con orecchio artificiale/accoppiatore (IEC 60318) + fonometro di precisione, variare l'attenuatore a gradini di 5 dB e verificare che ogni gradino dia la variazione attesa. Linearità ~1 dB/gradino, deviazione cumulativa ≤ ~3 dB.", note: "Riduci il livello a gradini di 5 dB e verifica che ogni gradino corrisponda a ~5 dB reali (linearità ~1 dB/gradino, ≤~3 dB cumulativi). Strumenti: orecchio artificiale/accoppiatore IEC 60318 + fonometro.", items: [
{ id: "lin_ok", text: "Linearità a passi di 5 dB su tutto il campo: regolare" },
], measures: [
{ id: "dev_cum", name: "Deviazione cumulativa attenuatore", unit: "dB", expected: "≤ ~3 dB sull'intero range (linearità ~1 dB/gradino)", value: "" },
] },
{ id: "via_ossea", title: "Via ossea e mascheramento", items: [
{ id: "osseo_ok", text: "Via ossea operativa su frequenze 250–4000 Hz" },
{ id: "mask_ok", text: "Rumore di mascheramento (narrow-band/white): presente e regolabile" },
] },
{ id: "canali", title: "Distorsione e canali", note: "Con orecchio artificiale + analizzatore di distorsione (o fonometro con analisi FFT), misurare la THD della cuffia a livello nominale: limite ≤ 2,5% (IEC 60645-1). Verificare che i due canali rispondano in modo identico.", note: "Misura la distorsione armonica (THD) della cuffia a livello elevato: ≤2,5% (IEC 60645-1). Verifica che i due canali rispondano in modo identico. Strumenti: accoppiatore IEC 60318 + analizzatore/fonometro.", items: [
{ id: "crosstalk", text: "Diafonia tra i canali: assente" },
{ id: "switch", text: "Commutazione del tono: senza transitori udibili" },
], measures: [
{ id: "thd", name: "Distorsione armonica (THD) cuffia", unit: "%", expected: "≤ 2,5% (IEC 60645-1)", value: "" },
] },
]
},
"spirometro": {
label: "Spirometro", icon: "›", norm: "ISO 26782 / ATS-ERS 2019",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "trasduttore", text: "Trasduttore di flusso (Fleisch/turbina/ultrasuoni): integro e pulito" },
{ id: "boccagli", text: "Boccagli e filtro antibatterico/antivirale: presenti, monouso disponibili" },
{ id: "tubi", text: "Tubi e raccordi: integri, senza perdite" },
{ id: "etichette", text: "Etichette CE, identificazione cespite, versione firmware: presenti" },
] },
{ id: "calibrazione", title: "Verifica di accuratezza (siringa 3 L)", note: "Siringa certificata 3 L, cicli a flussi 0,5–12 L/s (ATS/ERS). Errore tipico ammesso ±2,5% (ATS/ERS) / ±3,0% (ISO 26782).", items: [
{ id: "siringa", text: "Siringa di calibrazione 3 L collegata" },
], measures: [
{ id: "vol_3l", name: "Volume letto con siringa 3 L", unit: "L", expected: "3,00 L · accett. ±3,5% o 65 mL il maggiore (ATS/ERS 2019, siringa inclusa)", value: "" },
{ id: "err_pct", name: "Errore di volume", unit: "%", expected: "≤ ±2,5% (ATS/ERS)", value: "" },
] },
{ id: "linearita", title: "Linearità a flussi diversi", note: "Con siringa di calibrazione da 3 L eseguire iniezioni a flussi diversi (lento, medio, rapido) coprendo i profili ISO 26782. Errore ammesso ≤ ±2,5% su tutto il range di flusso.", note: "Esegui i cicli della siringa a flussi diversi (lento/medio/rapido, 0,5÷12 L/s — profili ATS/ERS): l'errore di volume deve restare ≤±2,5% a tutti i flussi. Strumenti: siringa di calibrazione certificata da 3 L.", items: [
{ id: "lin_ok", text: "Cicli a flusso basso/medio/alto eseguiti" },
], measures: [
{ id: "err_basso", name: "Errore a flusso basso", unit: "%", expected: "≤ ±2,5% (profili di flusso ISO 26782)", value: "" },
{ id: "err_alto", name: "Errore a flusso alto", unit: "%", expected: "≤ ±2,5% (profili di flusso ISO 26782)", value: "" },
] },
{ id: "tenuta", title: "Tenuta e ambiente", note: "Misurare temperatura ambiente (termometro), pressione barometrica (barometro) e umidità relativa (igrometro): servono per la correzione BTPS. Verificare l'assenza di perdite nel circuito (prova di tenuta con siringa).", items: [
{ id: "leak", text: "Leak test (siringa tappata): nessuna perdita" },
], measures: [
{ id: "temp", name: "Temperatura ambiente", unit: "°C", expected: "misurata (correzione BTPS)", value: "" },
{ id: "press", name: "Pressione barometrica", unit: "hPa", expected: "misurata", value: "" },
{ id: "ur", name: "Umidità relativa", unit: "%", expected: "misurata", value: "" },
] },
]
},
"frigoemoteca": {
label: "Frigoemoteca / frigo farmaci", icon: "›", norm: "MDR 2017/745 / D.M. 02-11-2015",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "struttura", text: "Struttura, guarnizioni porta, chiusura, illuminazione: integre" },
{ id: "ventilazione", text: "Ventilazione/condensatore: puliti" },
{ id: "registratore", text: "Termoregistratore (datalogger): presente e funzionante" },
{ id: "backup", text: "Batteria di backup / continuità: presente" },
{ id: "etichette", text: "Etichette CE, identificazione cespite: leggibili" },
] },
{ id: "temperatura", title: "Verifica temperatura", note: "Emocomponenti +2/+6 °C (set +4 ±2 °C, D.M. 02-11-2015). Confronto con termometro/datalogger di riferimento certificato (riferibilità ACCREDIA).", items: [
{ id: "rif", text: "Termometro/datalogger di riferimento certificato collegato" },
], measures: [
{ id: "t_display", name: "Temperatura a display", unit: "°C", expected: "+2 / +6 °C (set +4)", value: "" },
{ id: "t_rif", name: "Temperatura di riferimento", unit: "°C", expected: "+2 / +6 °C", value: "" },
{ id: "scarto", name: "Scarto display vs riferimento", unit: "°C", expected: "secondo procedura/costruttore", value: "" },
] },
{ id: "mappatura", title: "Mappatura termica camera", note: "Con più sonde calibrate (datalogger multicanale) negli angoli + centro, registrare per alcune ore a regime. Verificare il ΔT massimo tra i punti e che min/max restino nel range (+2/+6 °C per emocomponenti).", items: [
{ id: "punti", text: "Sonde posizionate (angoli + centro + sensore di controllo)" },
], measures: [
{ id: "dt_max", name: "ΔT massimo tra i punti", unit: "°C", expected: "secondo procedura/costruttore", value: "" },
{ id: "t_min", name: "Temperatura minima rilevata", unit: "°C", expected: "≥ +2 °C", value: "" },
{ id: "t_max", name: "Temperatura massima rilevata", unit: "°C", expected: "≤ +6 °C", value: "" },
] },
{ id: "allarmi", title: "Sistema di allarme", items: [
{ id: "alt", text: "Allarme alta temperatura: acustico + visivo, a soglia costruttore" },
{ id: "bassa", text: "Allarme bassa temperatura (anti-congelamento): attivo" },
{ id: "porta", text: "Allarme porta aperta: attivo" },
{ id: "rete", text: "Allarme mancanza rete con trasmissione remota (SMS/email/contatto): attivo" },
{ id: "sonda", text: "Allarme guasto sonda / batteria scarica: attivo" },
] },
{ id: "recupero", title: "Recupero e autonomia", items: [
{ id: "recupero_ok", text: "Tempo di recupero dopo apertura porta: accettabile" },
{ id: "autonomia", text: "Tenuta temperatura in mancanza rete (backup): verificata" },
] },
]
},
"bilancia": {
label: "Bilancia pesapersone / pesaneonati", icon: "›", norm: "Dir. 2014/31/UE (NAWI) / EN 45501 cl. III",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "pedana", text: "Pedana/seduta/culla: stabile, antiscivolo integro" },
{ id: "livella", text: "Piedini regolabili e livella (bolla): in piano" },
{ id: "display", text: "Display, tastiera, alimentazione: funzionanti" },
{ id: "sigilli", text: "Sigilli metrologici: integri" },
{ id: "marcatura", text: "Marcatura metrologica (M) e CE: presenti" },
] },
{ id: "zero", title: "Azzeramento e tara", items: [
{ id: "zero_ok", text: "Zero stabile e ritorno a zero corretto" },
{ id: "tara_ok", text: "Funzione tara: corretta" },
] },
{ id: "accuratezza", title: "Accuratezza con masse campione", note: "Masse campione certificate (classe M1 o superiore). EMT classe III secondo EN 45501: l'errore ammesso si esprime in divisioni di verifica 'e' (da targa) e dipende dal carico — ±0,5e fino a 500e, ±1e da 500e a 2000e, ±1,5e oltre 2000e; in servizio/verifica periodica i valori raddoppiano.", items: [
{ id: "masse", text: "Masse campione certificate utilizzate" },
], measures: [
{ id: "err_basso", name: "Errore a ~1/3 portata", unit: "g", expected: "entro EMT cl. III in servizio: ±1e (≤500e) / ±2e (500–2000e) / ±3e (>2000e)", value: "" },
{ id: "err_meta", name: "Errore a ~1/2 portata", unit: "g", expected: "entro EMT cl. III in servizio: ±1e (≤500e) / ±2e (500–2000e) / ±3e (>2000e)", value: "" },
{ id: "err_max", name: "Errore a portata massima", unit: "g", expected: "entro EMT cl. III in servizio: ±1e (≤500e) / ±2e (500–2000e) / ±3e (>2000e)", value: "" },
] },
{ id: "eccentricita", title: "Eccentricità e ripetibilità", note: "Con masse campione certificate (classe M1). Eccentricità: applicare ~1/3 della portata in posizioni diverse del piatto (centro + 4 quadranti), ogni lettura entro l'EMT del carico. Ripetibilità: pesare più volte lo stesso carico, la differenza tra letture deve restare entro l'EMT.", note: "Eccentricità: applica una massa (~1/3 della portata) al centro e poi nei 4 angoli del piatto; ogni lettura deve restare entro l'EMT del carico. Ripetibilità: pesa ≥3 volte la stessa massa rimuovendola tra le prove; la differenza max tra le letture deve essere ≤ EMT. Strumenti: masse campione certificate.", items: [
{ id: "ripeti", text: "Pesate ripetute con stessa massa: coerenti" },
], measures: [
{ id: "ecc", name: "Eccentricità (ΔMax tra posizioni)", unit: "g", expected: "ogni posizione entro l'EMT del carico applicato (cl. III)", value: "" },
{ id: "ripet", name: "Ripetibilità (differenza su più pesate stesso carico)", unit: "g", expected: "≤ valore assoluto dell'EMT del carico", value: "" },
{ id: "div", name: "Divisione (e) verificata", unit: "g", expected: "e come da targa (registrare e, non la risoluzione d)", value: "" },
] },
]
},
"concentratore_ossigeno": {
label: "Concentratore di ossigeno", icon: "›", norm: "ISO 80601-2-69:2020",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "involucro", text: "Involucro, ruote, cavo: integri" },
{ id: "filtri", text: "Filtri aria (grossolano/fine): puliti o sostituiti" },
{ id: "umidif", text: "Umidificatore, flussometro, tubi: integri, senza perdite" },
{ id: "ore", text: "Ore di funzionamento e identificazione cespite: registrate" },
] },
{ id: "prestazioni", title: "Prestazioni (ISO 80601-2-69)", note: "Misurare dopo riscaldamento (~10 min). Es. costruttore: 93% ±3% a 5 L/min; flusso 0,5–5 L/min; pressione uscita 5,5 ±0,25 psi (EverFlo). Valori esatti secondo costruttore. Strumento: analizzatore di ossigeno + flussimetro.", items: [
{ id: "analizz", text: "Analizzatore di ossigeno + misuratore di flusso collegati" },
], measures: [
{ id: "o2_5lpm", name: "Concentrazione O₂ a 5 L/min", unit: "%", expected: "≥ 90% (es. 93% ±3% costruttore)", limitMin: 90, invertPass: true, value: "" },
{ id: "flusso", name: "Flusso misurato (a impostato)", unit: "L/min", expected: "secondo costruttore", value: "" },
{ id: "press", name: "Pressione di uscita", unit: "psi", expected: "secondo costruttore (es. 5,5 ±0,25)", value: "" },
] },
{ id: "allarmi", title: "Sistema di allarme", items: [
{ id: "bassa_o2", text: "Allarme bassa concentrazione O₂ (OPI): attivo a soglia costruttore (es. 82%/70%)" },
{ id: "rete", text: "Allarme mancanza rete: attivo (entro ~30 s)" },
{ id: "flusso_basso", text: "Allarme basso flusso / flusso impedito: attivo" },
{ id: "selftest", text: "Self-test all'accensione (LED + allarme): eseguito" },
] },
]
},
"eeg": {
label: "Elettroencefalografo (EEG)", icon: "›", norm: "IEC 60601-2-26:2012",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "ampli", text: "Unità amplificatori/headbox: integra" },
{ id: "cavi", text: "Cavi paziente, elettrodi, cuffia/cap: integri e puliti" },
{ id: "connettori", text: "Connettori e isolamento cavi: integri" },
{ id: "terra", text: "Messa a terra / parte applicata (BF/CF): verificata" },
{ id: "etichette", text: "Etichette CE, identificazione cespite: leggibili" },
] },
{ id: "calibrazione", title: "Calibrazione (IEC 60601-2-26)", note: "Onda quadra ~50–100 µV (IFCN) o sinusoide standard: tutti i canali devono rispondere in modo identico (ampiezza/polarità). Strumento: generatore di segnale / calibratore EEG.", items: [
{ id: "onda_quadra", text: "Onda quadra: tutti i canali rispondono in modo uniforme" },
{ id: "polarita", text: "Polarità corretta su tutti i canali" },
], measures: [
{ id: "sensib", name: "Sensibilità verificata", unit: "µV/mm", expected: "secondo costruttore (tipico 5–10 µV/mm)", value: "" },
] },
{ id: "filtri", title: "Filtri e risposta in frequenza", items: [
{ id: "lff_hff", text: "Filtri passa-alto (LFF) e passa-basso (HFF): funzionanti" },
{ id: "notch", text: "Filtro notch 50 Hz: funzionante" },
] },
{ id: "impedenza", title: "Impedenza e rumore", items: [
{ id: "imp", text: "Misura impedenza elettrodi (kΩ): operativa" },
{ id: "rumore", text: "Rumore di fondo entro limite costruttore" },
{ id: "diafonia", text: "Diafonia tra canali: assente" },
] },
]
},
"dialisi": {
label: "Apparecchio per emodialisi", icon: "›", norm: "IEC 60601-2-16:2025",
sections: [
{ id: "ispezione", title: "Ispezione visiva e idraulica", items: [
{ id: "involucro", text: "Involucro, display e supporti: integri e puliti" },
{ id: "linee", text: "Linee/circuito idraulico e raccordi: integri, senza perdite" },
{ id: "pompe", text: "Pompe (sangue, eparina): rulli/alloggiamenti integri" },
{ id: "filtri", text: "Filtri e connettori dialisato: integri, puliti" },
{ id: "etichette", text: "Etichette CE, n° serie, parti applicate: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire la verifica di sicurezza elettrica (vedi template dedicato IEC 60601-1 / IEC 62353).", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: superati" },
{ id: "pompa_sangue", text: "Pompa sangue: rotazione regolare, portata regolabile" },
{ id: "uf", text: "Controllo ultrafiltrazione (UF): risponde all'impostazione" },
{ id: "risc", text: "Riscaldatore dialisato: raggiunge la temperatura impostata" },
{ id: "cond", text: "Preparazione/conducibilità dialisato: stabile in range" },
{ id: "deaer", text: "Deareazione/rimozione bolle: funzionante" },
] },
{ id: "allarmi", title: "Allarmi di sicurezza (IEC 60601-2-16)", note: "Simulare le condizioni e verificare l'intervento (acustico + visivo) di ciascun allarme critico: aria/microbolle in linea, perdita di sangue (blood leak), pressione transmembrana, conducibilità e temperatura del dialisato fuori range.", items: [
{ id: "all_aria", text: "Rilevatore aria/microbolle: arresta la pompa sangue e allarma" },
{ id: "all_blood", text: "Rilevatore perdita ematica (blood leak): allarma" },
{ id: "all_press", text: "Allarmi pressioni (arteriosa, venosa, TMP): intervengono ai limiti" },
{ id: "all_cond", text: "Allarme conducibilità fuori range: interviene" },
{ id: "all_temp", text: "Allarme temperatura dialisato fuori range: interviene" },
{ id: "all_alim", text: "Allarme mancanza alimentazione: interviene" },
], measures: [
{ id: "t_dial", name: "Temperatura dialisato vs set", unit: "°C", expected: "secondo costruttore (tipico ~37 °C)", value: "" },
{ id: "cond_dial", name: "Conducibilità dialisato", unit: "mS/cm", expected: "secondo costruttore", value: "" },
{ id: "q_sangue", name: "Portata pompa sangue (a impostazione di rif.)", unit: "ml/min", expected: "secondo costruttore", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "dataora", text: "Data/ora corrette; disinfezione/ciclo igienico eseguito" },
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"capnografo": {
label: "Capnografo / monitor gas respiratori", icon: "›", norm: "ISO 80601-2-55:2018+A1:2023",
sections: [
{ id: "ispezione", title: "Ispezione visiva", items: [
{ id: "involucro", text: "Involucro e display: integri e puliti" },
{ id: "linea", text: "Linea di campionamento e water-trap: integre, non occluse" },
{ id: "sensore", text: "Sensore/cella di misura: pulito, finestra ottica integra" },
{ id: "etichette", text: "Etichette CE, n° serie: leggibili" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: nessun errore" },
{ id: "zero", text: "Azzeramento (zeroing): eseguibile, completato" },
{ id: "riscald", text: "Riscaldamento/condizionamento sensore: completato" },
{ id: "forma", text: "Curva di capnografia: presente e stabile" },
] },
{ id: "prestazioni", title: "Accuratezza (ISO 80601-2-55) — con gas di taratura", note: "Verificare con miscela di gas certificata (es. CO2 nota). Compilare i limiti secondo ISO 80601-2-55 e/o le specifiche del costruttore. Per O2/N2O/agenti anestetici usare le rispettive miscele.", items: [
{ id: "gas", text: "Miscela di gas certificata collegata" },
], measures: [
{ id: "co2", name: "CO2 letta — miscela nota", unit: "mmHg / %", expected: "valore nominale ± tolleranza secondo ISO 80601-2-55/costruttore", value: "" },
{ id: "o2", name: "O2 letta (se previsto) — miscela nota", unit: "%", expected: "secondo costruttore (se presente modulo O₂)", value: "" },
] },
{ id: "allarmi", title: "Allarmi (IEC 60601-1-8)", items: [
{ id: "all_apnea", text: "Allarme apnea: interviene entro il tempo impostato" },
{ id: "all_co2", text: "Allarmi CO2 (etCO2/FiCO2) alta/bassa: intervengono" },
{ id: "all_fr", text: "Allarme frequenza respiratoria: interviene" },
{ id: "all_occl", text: "Allarme occlusione/linea: interviene" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"tavolo_operatorio": {
label: "Tavolo operatorio", icon: "›", norm: "IEC 60601-2-46:2016",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "struttura", text: "Struttura, colonna e piano: integri, nessun gioco anomalo" },
{ id: "sezioni", text: "Sezioni del piano e snodi: integri, fissaggi sicuri" },
{ id: "cuscini", text: "Cuscini/imbottiture: integri, puliti" },
{ id: "ruote", text: "Ruote e sistema di frenatura/ancoraggio: funzionanti" },
{ id: "comando", text: "Pulsantiera/telecomando e cavo: integri; batteria non gonfia" },
{ id: "etichette", text: "Etichette CE, n° serie, carico massimo: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire la verifica di sicurezza elettrica (vedi template dedicato).", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica eseguita, esito registrato" },
] },
{ id: "funz", title: "Movimenti e funzionalità", items: [
{ id: "altezza", text: "Salita/discesa altezza: fluida, su tutta la corsa" },
{ id: "trend", text: "Trendelenburg / anti-Trendelenburg: funzionanti" },
{ id: "lat", text: "Inclinazioni laterali (tilt): funzionanti" },
{ id: "dorso_gambe", text: "Sezioni dorso/gambe/testa: regolazioni funzionanti" },
{ id: "ritorno", text: "Ritorno a zero/livellamento (se previsto): funzionante" },
{ id: "tenuta", text: "Tenuta in posizione sotto carico: nessun cedimento" },
] },
{ id: "sicurezza", title: "Sicurezza", items: [
{ id: "emergenza", text: "Arresto di emergenza / blocco movimenti: funzionante" },
{ id: "backup", text: "Comando di emergenza/manuale (se previsto): funzionante" },
{ id: "stabilita", text: "Stabilità complessiva: nessun rischio di ribaltamento" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"culla_termica": {
label: "Culla termica / lettino di rianimazione (radiant warmer)", icon: "›", norm: "IEC 60601-2-21:2020+A1:2023",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "struttura", text: "Struttura, colonna e piano: integri, stabili" },
{ id: "riscaldatore", text: "Elemento riscaldante radiante: integro, griglia di protezione presente" },
{ id: "sonda", text: "Sonda cutanea: integra, cavo OK" },
{ id: "materasso", text: "Materasso e sponde: integri, puliti" },
{ id: "ruote", text: "Ruote e freni: funzionanti" },
{ id: "etichette", text: "Etichette CE, n° serie, parti applicate: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire la verifica di sicurezza elettrica (vedi template dedicato).", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità", items: [
{ id: "acc", text: "Accensione e autotest: nessun errore" },
{ id: "manuale", text: "Modo manuale (potenza riscaldatore): regolabile" },
{ id: "servo", text: "Modo servo-controllo cute: insegue la temperatura impostata" },
{ id: "sonda_ok", text: "Lettura sonda cutanea: plausibile e stabile" },
{ id: "luce_apgar", text: "Illuminazione e (se presente) timer Apgar: funzionanti" },
] },
{ id: "allarmi", title: "Allarmi (IEC 60601-2-21)", note: "Simulare le condizioni di allarme (sonda scollegata, temperatura fuori range) e verificare l'intervento acustico/visivo. Per la sonda cute (servo) confrontare con termometro di riferimento: deviazione ≤ ±0,3 °C.", items: [
{ id: "all_alta", text: "Allarme sovra-temperatura cute: interviene" },
{ id: "all_bassa", text: "Allarme sotto-temperatura cute: interviene" },
{ id: "all_sonda", text: "Allarme guasto/scollegamento sonda: interviene" },
{ id: "all_manuale", text: "Allarme periodico in modo manuale (controllo prolungato): presente" },
{ id: "all_alim", text: "Allarme mancanza alimentazione: interviene" },
], measures: [
{ id: "t_cute", name: "Temperatura cute (servo) vs set", unit: "°C", expected: "≤ ±0,3 °C (sonda cute, IEC 60601-2-21)", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"holter_ecg": {
label: "Holter ECG (registratore ambulatoriale)", icon: "›", norm: "IEC 60601-2-47:2012",
sections: [
{ id: "ispezione", title: "Ispezione visiva", items: [
{ id: "reg", text: "Registratore e display: integri e puliti" },
{ id: "cavo", text: "Cavo paziente ed elettrodi/clip: integri, isolamento OK" },
{ id: "batteria", text: "Vano batteria/contatti: puliti; batteria non gonfia" },
{ id: "etichette", text: "Etichette CE, n° serie, parti applicate (CF): leggibili" },
] },
{ id: "funz", title: "Funzionalità", items: [
{ id: "acc", text: "Accensione e avvio registrazione: corretti" },
{ id: "canali", text: "Canali/derivazioni: tutti acquisiti, no canali muti" },
{ id: "marker", text: "Tasto marcatore evento paziente: funzionante" },
{ id: "orologio", text: "Orologio interno: ora corretta" },
{ id: "scarico", text: "Scarico dati e software di analisi: funzionante" },
] },
{ id: "prestazioni", title: "Prestazioni (IEC 60601-2-47) — con simulatore ECG", note: "Verificare con simulatore ECG certificato. Compilare i limiti secondo IEC 60601-2-47 e/o le specifiche del costruttore.", items: [
{ id: "sim", text: "Simulatore ECG collegato" },
{ id: "morf", text: "Morfologia registrata: corretta su tutti i canali" },
], measures: [
{ id: "fc", name: "FC rilevata — simulatore (valore di rif.)", unit: "bpm", expected: "± 10% o ± 5 bpm (tipico)", value: "" },
] },
{ id: "batteria_sec", title: "Alimentazione", items: [
{ id: "auton", text: "Autonomia adeguata alla durata di registrazione prevista" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"riunito_odontoiatrico": {
label: "Riunito odontoiatrico", icon: "›", norm: "ISO 7494-1:2018 (+ IEC 60601-1)",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "poltrona", text: "Poltrona, bracci e snodi: integri, stabili" },
{ id: "manipoli", text: "Manipoli/turbine e cordoni: integri, raccordi a tenuta" },
{ id: "faretra", text: "Faretra/strumenti, siringa aria-acqua: integri" },
{ id: "lampada", text: "Lampada operatoria e snodo: integri, funzionanti" },
{ id: "idrico", text: "Gruppo idrico/aspirazione, bacinella: integri, scarichi liberi" },
{ id: "etichette", text: "Etichette CE, n° serie: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 60601-1 / IEC 62353)", note: "Eseguire la verifica di sicurezza elettrica (vedi template dedicato).", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica eseguita, esito registrato" },
] },
{ id: "poltrona_funz", title: "Poltrona e sicurezza movimenti", note: "ISO 7494-1 richiede un sistema di arresto delle funzioni (function stop) per le poltrone a movimento elettrico.", items: [
{ id: "movimenti", text: "Movimenti poltrona (salita/discesa, schienale): fluidi" },
{ id: "function_stop", text: "Sistema di arresto funzioni (function stop): arresta i movimenti pericolosi" },
{ id: "posizioni", text: "Posizioni memorizzate/ritorno (se previsti): funzionanti" },
] },
{ id: "strumenti", title: "Strumenti e servizi", items: [
{ id: "turbine", text: "Manipoli/turbine: rotazione, spray e raffreddamento corretti" },
{ id: "siringa", text: "Siringa aria/acqua: erogazione corretta" },
{ id: "aspirazione", text: "Aspirazione (chirurgica/saliva): potenza adeguata" },
{ id: "polimerizz", text: "Lampada polimerizzante (se integrata): funzionante" },
{ id: "riscaldatore", text: "Riscaldatore acqua/siringa (se presente): funzionante" },
] },
{ id: "igiene", title: "Impianto idrico e igiene", note: "ISO 7494-1: filtro solidi (≥ 2 mm); se presente, separatore amalgama conforme a ISO 11143.", items: [
{ id: "filtro", text: "Filtro solidi presente e pulito" },
{ id: "amalgama", text: "Separatore amalgama (se presente): funzionante" },
{ id: "decont", text: "Decontaminazione/flussaggio linee acqua: eseguito secondo protocollo" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"elettrocardiografo": {
label: "Elettrocardiografo (ECG diagnostico)", icon: "›", norm: "IEC 60601-2-25:2011",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "involucro", text: "Involucro, display e tastiera: integri e puliti" },
{ id: "cavo_paz", text: "Cavo paziente e derivazioni: isolamento integro, connettori OK" },
{ id: "elettrodi", text: "Elettrodi/pinze/ventose: puliti, molle e adesione funzionanti" },
{ id: "alim", text: "Alimentatore e cavo rete: integri; batteria (se presente) non gonfia" },
{ id: "stampante", text: "Stampante e carta: presenti, avanzamento regolare" },
{ id: "etichette", text: "Etichette CE, n° serie, parti applicate (tipo CF): leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire le prove di sicurezza elettrica secondo IEC 62353 (resistenza del conduttore di protezione e correnti di dispersione) con safety analyzer. Parti applicate ECG: tipo CF.", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: nessun messaggio di errore" },
{ id: "deriv", text: "Selezione derivazioni (I, II, III, aVR, aVL, aVF, V1-V6): tutte presenti" },
{ id: "vel", text: "Velocità carta selezionabile (25 / 50 mm/s)" },
{ id: "gain", text: "Sensibilità/guadagno selezionabile (5 / 10 / 20 mm/mV)" },
{ id: "filtri", text: "Filtri (rete 50 Hz, muscolare, deriva linea di base): attivabili" },
{ id: "lead_off", text: "Segnalazione elettrodo staccato (lead-off): funzionante" },
] },
{ id: "prestazioni", title: "Prestazioni (IEC 60601-2-25) — con simulatore ECG", note: "Verificare con simulatore ECG certificato. Compilare i limiti secondo IEC 60601-2-25 e/o le specifiche del costruttore (accuratezza di guadagno, base dei tempi, frequenza).", items: [
{ id: "sim", text: "Simulatore ECG collegato e impostato" },
{ id: "cal_1mv", text: "Impulso di taratura 1 mV: ampiezza corretta sul tracciato" },
{ id: "morf", text: "Morfologia su tutte le derivazioni: corretta, senza artefatti" },
], measures: [
{ id: "amp_cal", name: "Ampiezza impulso 1 mV a 10 mm/mV", unit: "mm", expected: "10 mm — tolleranza secondo IEC 60601-2-25 (tipico ±5%)", value: "" },
{ id: "fc_60", name: "FC visualizzata — simulatore 60 bpm", unit: "bpm", expected: "60 bpm ± 1 bpm (o ±5%)", value: "" },
{ id: "vel_carta", name: "Velocità carta misurata (impostata 25 mm/s)", unit: "mm/s", expected: "25 mm/s ± 5%", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "dataora", text: "Data/ora di sistema corrette" },
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma tecnico" },
] },
]
},
"sfigmomanometro": {
label: "Sfigmomanometro automatico (NIBP)", icon: "›", norm: "IEC 80601-2-30:2018",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "involucro", text: "Involucro e display: integri e puliti" },
{ id: "bracciali", text: "Bracciali e tubi: integri, senza tagli, raccordi a tenuta" },
{ id: "valvola", text: "Connettore bracciale e valvola: integri, innesto corretto" },
{ id: "alim", text: "Alimentatore/batteria: integri, batteria non gonfia" },
{ id: "etichette", text: "Etichette CE, n° serie, parte applicata: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Per i dispositivi alimentati da rete eseguire le prove IEC 62353 con safety analyzer.", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita (se da rete), esito registrato" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: nessun errore" },
{ id: "ciclo", text: "Ciclo di misura completo: gonfiaggio, sgonfiaggio graduale, lettura" },
{ id: "modi", text: "Modalità adulto/pediatrico/neonatale (se previste): selezionabili" },
{ id: "sgonfia", text: "Sgonfiaggio rapido di sicurezza (stop): funzionante" },
] },
{ id: "pressione", title: "Accuratezza pressione statica (IEC 80601-2-30) — con manometro di riferimento", note: "Collegare un manometro/simulatore NIBP certificato al posto del bracciale (volume di prova). La norma IEC 80601-2-30 richiede accuratezza dell'indicazione di pressione entro ±3 mmHg (o ±2% del valore, il maggiore).", items: [
{ id: "rif", text: "Manometro di riferimento / simulatore NIBP collegato" },
], measures: [
{ id: "p_50", name: "Pressione statica — riferimento 50 mmHg", unit: "mmHg", expected: "50 ±3 (47–53)", limitVal: 53, limitMin: 47, value: "" },
{ id: "p_150", name: "Pressione statica — riferimento 150 mmHg", unit: "mmHg", expected: "150 ±3 (147–153)", limitVal: 153, limitMin: 147, value: "" },
{ id: "p_250", name: "Pressione statica — riferimento 250 mmHg", unit: "mmHg", expected: "250 ±3 (247–253)", limitVal: 253, limitMin: 247, value: "" },
{ id: "tenuta", name: "Perdita pneumatica (caduta in 1 min a ~250 mmHg)", unit: "mmHg/min", expected: "secondo costruttore (tipico basso)", value: "" },
] },
{ id: "sicurezza", title: "Sicurezza e allarmi", note: "Verificare la sovrapressione massima e gli allarmi secondo IEC 60601-1-8.", items: [
{ id: "overpress", text: "Limite di sovrapressione (cut-off): interviene entro il massimo dichiarato" },
{ id: "all_err", text: "Allarmi/segnalazioni di errore (bracciale, movimento, fuori range): presenti" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "dataora", text: "Data/ora corrette" },
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"termometro_clinico": {
label: "Termometro clinico elettronico", icon: "›", norm: "ISO 80601-2-56:2017+A1:2018",
sections: [
{ id: "ispezione", title: "Ispezione visiva", items: [
{ id: "involucro", text: "Involucro, display e sonda: integri e puliti" },
{ id: "copri", text: "Copri-sonda (se usa-e-getta): disponibili, integri" },
{ id: "batteria", text: "Batteria/contatti: OK, batteria non gonfia" },
{ id: "etichette", text: "Etichette CE, n° serie: leggibili" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: nessun errore" },
{ id: "misura", text: "Ciclo di misura completo con segnale di fine misura" },
{ id: "modo", text: "Modalità (predittiva/diretta, sito di misura): selezionabili se previste" },
] },
{ id: "accuratezza", title: "Accuratezza (ISO 80601-2-56) — con bagno/simulatore di temperatura", note: "Verificare con bagno termostatico o simulatore certificato. Compilare i limiti secondo ISO 80601-2-56 e/o le specifiche del costruttore (errore massimo di laboratorio, tipicamente molto stretto nel range clinico ~35,5–42 °C).", items: [
{ id: "rif", text: "Riferimento di temperatura certificato pronto" },
], measures: [
{ id: "t_37", name: "Lettura — riferimento 37,0 °C", unit: "°C", expected: "37,0 °C ± 0,3 °C (ISO 80601-2-56)", value: "" },
{ id: "t_40", name: "Lettura — riferimento 40,0 °C", unit: "°C", expected: "40,0 °C ± 0,3 °C (ISO 80601-2-56)", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"incubatrice_neonatale": {
label: "Incubatrice neonatale", icon: "›", norm: "IEC 60601-2-19:2020+A1:2023",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "cupola", text: "Cupola/parete: integra, trasparente, guarnizioni a tenuta" },
{ id: "oblo", text: "Oblò e maniche di accesso: chiusura e tenuta corrette" },
{ id: "materasso", text: "Materasso e piano: puliti, integri, inclinazione funzionante" },
{ id: "ruote", text: "Carrello/ruote e freni: stabili e funzionanti" },
{ id: "umidif", text: "Vaschetta umidificazione (se presente): pulita, senza incrostazioni" },
{ id: "etichette", text: "Etichette CE, n° serie, parti applicate: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire le prove IEC 62353 con safety analyzer.", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: nessun errore" },
{ id: "modo", text: "Controllo temperatura aria / servo-cute (sonda paziente): funzionanti" },
{ id: "sonda", text: "Sonda cutanea: integra, lettura plausibile" },
{ id: "umid_set", text: "Regolazione umidità (se presente): risponde all'impostazione" },
{ id: "o2", text: "Controllo/monitor O2 (se presente): risponde, da verificare con analizzatore" },
] },
{ id: "temperatura", title: "Temperatura (IEC 60601-2-19) — con termometro di riferimento", note: "Verificare temperatura e uniformità con termometro/registratore certificato sul piano materasso. Compilare i limiti secondo IEC 60601-2-19 (deviazione, variabilità, uniformità) e/o le specifiche del costruttore.", items: [
{ id: "rif", text: "Termometro di riferimento posizionato sul materasso" },
{ id: "stabile", text: "Temperatura raggiunta e stabile prima della misura" },
], measures: [
{ id: "t_set", name: "Temperatura aria vs set-point", unit: "°C", expected: "≤ ±0,7 °C (accuratezza di controllo, IEC 60601-2-19)", value: "" },
{ id: "t_unif", name: "Uniformità sul materasso (max-min tra punti)", unit: "°C", expected: "≤ ±0,8 °C tra i punti (IEC 60601-2-19)", value: "" },
] },
{ id: "allarmi", title: "Allarmi (IEC 60601-1-8 / IEC 60601-2-19)", items: [
{ id: "all_alta", text: "Allarme sovra-temperatura: interviene" },
{ id: "all_sonda", text: "Allarme guasto/scollegamento sonda: interviene" },
{ id: "all_flusso", text: "Allarme guasto ventilazione/flusso aria: interviene" },
{ id: "all_alim", text: "Allarme mancanza alimentazione: interviene" },
{ id: "all_udibile", text: "Segnali acustici e visivi: presenti e percepibili" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "dataora", text: "Data/ora corrette" },
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"lampada_scialitica": {
label: "Lampada scialitica (operatoria)", icon: "›", norm: "IEC 60601-2-41:2021",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "cupola", text: "Cupola/corpo lampada: integro, pulito" },
{ id: "bracci", text: "Bracci e snodi: tenuta in posizione, movimenti fluidi, nessun cedimento" },
{ id: "maniglia", text: "Maniglia centrale (sterilizzabile/usa-e-getta): presente, fissaggio OK" },
{ id: "led", text: "LED/lampade: tutti funzionanti, nessun modulo spento" },
{ id: "etichette", text: "Etichette CE, n° serie: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire le prove IEC 62353 con safety analyzer (alimentazione e, se presente, gruppo di continuità).", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità", items: [
{ id: "acc", text: "Accensione/spegnimento: corretti" },
{ id: "dimmer", text: "Regolazione intensità (dimmer): tutti i livelli funzionanti" },
{ id: "fuoco", text: "Regolazione fuoco/diametro campo (se prevista): funzionante" },
{ id: "emergenza", text: "Alimentazione di emergenza/batteria (se presente): commutazione OK" },
{ id: "posiz", text: "Posizionamento e stabilità nelle varie angolazioni" },
] },
{ id: "prestazioni", title: "Prestazioni illuminotecniche (IEC 60601-2-41)", note: "Parametri come illuminamento centrale (Ec), diametro del campo, temperatura di colore e resa cromatica (Ra) si misurano con luxmetro/strumenti idonei. Compilare secondo IEC 60601-2-41 e/o le specifiche del costruttore — NON stimare a vista. Strumento: luxmetro.", items: [
{ id: "strum", text: "Strumento di misura (luxmetro) disponibile, se la misura è richiesta" },
], measures: [
{ id: "ec", name: "Illuminamento centrale Ec (se misurato)", unit: "lux", expected: "40 000–160 000 lux (range IEC 60601-2-41)", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"fototerapia_neonatale": {
label: "Lampada fototerapia neonatale", icon: "›", norm: "IEC 60601-2-50:2020+A1:2023",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "corpo", text: "Corpo lampada e supporto: integri, stabili" },
{ id: "led", text: "LED/tubi fototerapia: tutti funzionanti, nessuno annerito/spento" },
{ id: "schermo", text: "Schermo/diffusore: pulito, integro" },
{ id: "contaore", text: "Contaore lampada/sorgente: leggibile (durata residua)" },
{ id: "etichette", text: "Etichette CE, n° serie: leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire le prove IEC 62353 con safety analyzer.", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità", items: [
{ id: "acc", text: "Accensione/spegnimento e timer (se presente): corretti" },
{ id: "intensita", text: "Regolazione intensità (se prevista): funzionante" },
{ id: "distanza", text: "Regolazione altezza/distanza dal neonato: funzionante" },
] },
{ id: "prestazioni", title: "Irradianza (IEC 60601-2-50) — con radiometro", note: "L'irradianza spettrale efficace (banda ~400–500 nm) si misura SOLO con radiometro per fototerapia certificato, alla distanza d'uso. Compilare secondo IEC 60601-2-50 e/o le specifiche del costruttore — NON stimare a vista. Strumento: radiometro per fototerapia (banda ~400–500 nm).", items: [
{ id: "radiom", text: "Radiometro per fototerapia disponibile e tarato" },
], measures: [
{ id: "irr", name: "Irradianza alla distanza d'uso (se misurata)", unit: "µW/cm²/nm", expected: "secondo IEC 60601-2-50/costruttore", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato; ore lampada annotate" },
] },
]
},
"elettrostimolatore": {
label: "Elettrostimolatore / TENS", icon: "›", norm: "IEC 60601-2-10:2012+A1:2016+A2:2023",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "involucro", text: "Involucro, display e comandi: integri e puliti" },
{ id: "cavi", text: "Cavi paziente ed elettrodi: isolamento integro, connettori OK" },
{ id: "batteria", text: "Batteria/alimentatore: integri, batteria non gonfia" },
{ id: "etichette", text: "Etichette CE, n° serie, parti applicate (tipo BF/CF): leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Per i dispositivi alimentati da rete eseguire le prove IEC 62353. Le parti applicate degli stimolatori devono essere tipo BF o CF (IEC 60601-2-10).", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita (se da rete), esito registrato" },
] },
{ id: "funz", title: "Funzionalità di base", items: [
{ id: "acc", text: "Accensione e autotest: nessun errore" },
{ id: "prog", text: "Programmi/parametri (frequenza, durata impulso, ampiezza): selezionabili" },
{ id: "intens", text: "Regolazione intensità: graduale, parte da zero" },
{ id: "open_circ", text: "Rilevazione elettrodo staccato / circuito aperto: intensità si annulla" },
{ id: "timer", text: "Timer di trattamento: funzionante" },
] },
{ id: "prestazioni", title: "Uscita (IEC 60601-2-10) — con oscilloscopio/carico resistivo", note: "Misurare i parametri d'uscita su carico resistivo idoneo (es. 500 Ω) con oscilloscopio. Compilare secondo IEC 60601-2-10 e/o le specifiche del costruttore (corrente/tensione max, frequenza, durata impulso). N.B.: per uscite > 10 mA o 10 V valgono requisiti aggiuntivi della norma. Strumento: oscilloscopio + carico resistivo (~500 Ω).", items: [
{ id: "carico", text: "Carico resistivo e strumento di misura collegati" },
{ id: "forma", text: "Forma d'onda d'uscita: conforme alle specifiche costruttore" },
], measures: [
{ id: "i_out", name: "Corrente d'uscita su carico (a impostazione di rif.)", unit: "mA", expected: "secondo IEC 60601-2-10/costruttore", value: "" },
{ id: "freq", name: "Frequenza impulsi (a impostazione di rif.)", unit: "Hz", expected: "secondo costruttore", value: "" },
{ id: "width", name: "Durata impulso (a impostazione di rif.)", unit: "µs", expected: "secondo costruttore", value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "registro", text: "Registro manutenzioni aggiornato con data e firma" },
] },
]
},
"autoclave": {
label: "Autoclave / sterilizzatrice a vapore", icon: "›", norm: "EN 13060:2014+A1:2018",
sections: [
{ id: "ispezione", title: "Ispezione visiva e meccanica", items: [
{ id: "camera", text: "Camera e guarnizione portello: pulite, integre, tenuta corretta" },
{ id: "portello", text: "Chiusura/blocco portello: funzionante, sicurezza attiva" },
{ id: "acqua", text: "Serbatoi acqua pulita/usata: livelli e qualità acqua OK" },
{ id: "filtro", text: "Filtro/i e cestelli: puliti, integri" },
{ id: "etichette", text: "Etichette CE, n° serie, tipo cicli (B/N/S): leggibili" },
] },
{ id: "sicurezza_el", title: "Sicurezza elettrica (IEC 62353)", note: "Eseguire le prove IEC 62353 con safety analyzer.", items: [
{ id: "se_fatto", text: "Verifica di sicurezza elettrica IEC 62353 eseguita, esito registrato" },
] },
{ id: "funz", title: "Funzionalità e cicli", items: [
{ id: "acc", text: "Accensione e autotest: nessun allarme anomalo" },
{ id: "cicli", text: "Selezione cicli (134 °C, 121 °C, ecc.): avviabili e completati" },
{ id: "stampa", text: "Stampante/registrazione ciclo (data, parametri): funzionante" },
{ id: "sicurezze", text: "Sicurezze (sovrapressione, sovratemperatura, blocco portello): integre" },
] },
{ id: "test", title: "Test periodici (EN 13060)", note: "Test previsti per i piccoli sterilizzatori a vapore: vuoto/tenuta, penetrazione vapore. Per i cicli tipo B usare l'helix; il Bowie-Dick per i carichi porosi.", items: [
{ id: "vacuum", text: "Vacuum/leak test (tenuta del vuoto): superato" },
{ id: "bowie", text: "Bowie-Dick / Helix (penetrazione vapore): superato" },
{ id: "indicatori", text: "Indicatori chimici/biologici secondo protocollo: esito conforme" },
] },
{ id: "plateau", title: "Parametri di sterilizzazione (plateau) — con data-logger/registro ciclo", note: "Confrontare i valori del ciclo con i parametri standard di sterilizzazione a vapore saturo. Tipici: 134 °C con plateau ≥ 3 min (banda 134–137 °C); 121 °C con plateau ≥ 15 min (banda 121–124 °C). Verificare su stampa ciclo o data-logger calibrato.", items: [
{ id: "saturo", text: "Vapore saturo (relazione temperatura/pressione corretta)" },
], measures: [
{ id: "t_134", name: "Temperatura di plateau — ciclo 134 °C", unit: "°C", expected: "134–137 °C", limitVal: 137, limitMin: 134, value: "" },
{ id: "h_134", name: "Durata plateau — ciclo 134 °C", unit: "min", expected: "≥ 3 min", limitMin: 3, invertPass: true, value: "" },
{ id: "t_121", name: "Temperatura di plateau — ciclo 121 °C", unit: "°C", expected: "121–124 °C", limitVal: 124, limitMin: 121, value: "" },
{ id: "h_121", name: "Durata plateau — ciclo 121 °C", unit: "min", expected: "≥ 15 min", limitMin: 15, invertPass: true, value: "" },
] },
{ id: "doc", title: "Registro e documentazione", items: [
{ id: "dataora", text: "Data/ora di sistema corrette" },
{ id: "registro", text: "Registro manutenzioni e test periodici aggiornato con firma" },
] },
]
},
"pulsossimetro": {
label: "Pulsossimetro / SpO2 monitor", icon: "›", norm: "ISO 80601-2-61:2017",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "involucro", text: "Involucro/display: integro, privo di crepe o danni" },
{ id: "cavo_paz", text: "Cavo paziente e sensore: integri, isolamento OK" },
{ id: "sensore", text: "Sensore SpO2: clip/finger pulita, LED visibili e funzionanti" },
{ id: "alimentaz", text: "Cavo alimentazione / alimentatore: integro (se da rete)" },
{ id: "batteria", text: "Batteria interna (se presente): non gonfia, contatti puliti" },
{ id: "etichette", text: "Etichette CE, n° serie, classificazione: leggibili" },
]
},
{
id: "alimentazione", title: "Alimentazione e batteria",
note: "ISO 80601-2-61: i pulsossimetri portatili devono funzionare almeno 8 ore con batteria carica (manutenzione tipica).",
items: [
{ id: "acc_rete", text: "Accensione da rete: corretta, indicatori luminosi normali" },
{ id: "acc_batteria", text: "Accensione da batteria: corretta, indicatore stato carica visibile" },
{ id: "low_batt", text: "Allarme batteria scarica: attivo (test con tensione bassa o storia clinica)" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80% dopo ricarica completa", limitVal: 80, invertPass: true, value: "" },
{ id: "auton", name: "Autonomia (se misurata)", unit: "h", expected: "≥ 8 h (portatili)", limitMin: 8, invertPass: true, value: "" },
]
},
{
id: "accuratezza_spo2", title: "Accuratezza SpO2 (ISO 80601-2-61)",
note: "Verificare con simulatore SpO2 certificato (es. Fluke ProSim 8, Index 2 SpO2, Rigel UNI-SiM). Tolleranza tipica ±2% nel range 70-100%. Test su almeno 3 punti: 90%, 80%, 70%.",
items: [
{ id: "simulatore", text: "Simulatore SpO2 collegato e calibrato" },
{ id: "morf_pleth", text: "Forma d'onda pletismografica: presente e stabile sul display" },
],
measures: [
{ id: "spo2_97", name: "SpO2 simulato 97% — lettura", unit: "%", expected: "97 ±2 (95-99)", limitVal: 99, limitMin: 95, value: "" },
{ id: "spo2_90", name: "SpO2 simulato 90% — lettura", unit: "%", expected: "90 ±2 (88-92)", limitVal: 92, limitMin: 88, value: "" },
{ id: "spo2_80", name: "SpO2 simulato 80% — lettura", unit: "%", expected: "80 ±2 (78-82)", limitVal: 82, limitMin: 78, value: "" },
{ id: "spo2_70", name: "SpO2 simulato 70% — lettura", unit: "%", expected: "70 ±3 (67-73)", limitVal: 73, limitMin: 67, value: "" },
]
},
{
id: "accuratezza_fc", title: "Accuratezza frequenza cardiaca",
note: "Verificare con simulatore impostato a diverse frequenze. Tolleranza tipica ±2% o ±2 bpm (il valore maggiore).",
items: [
{ id: "fc_traccia", text: "Tracciato FC stabile, senza artefatti" },
],
measures: [
{ id: "fc_30", name: "FC simulato 30 bpm — lettura", unit: "bpm", expected: "30 ±2 (28-32)", limitVal: 32, limitMin: 28, value: "" },
{ id: "fc_60", name: "FC simulato 60 bpm — lettura", unit: "bpm", expected: "60 ±2 (58-62)", limitVal: 62, limitMin: 58, value: "" },
{ id: "fc_120", name: "FC simulato 120 bpm — lettura", unit: "bpm", expected: "120 ±3 (117-123)", limitVal: 123, limitMin: 117, value: "" },
{ id: "fc_200", name: "FC simulato 200 bpm — lettura", unit: "bpm", expected: "200 ±4 (196-204)", limitVal: 204, limitMin: 196, value: "" },
]
},
{
id: "allarmi", title: "Allarmi (IEC 60601-1-8)",
note: "Verificare attivazione allarmi acustici e visivi al superamento delle soglie impostate.",
items: [
{ id: "all_spo2_low", text: "Allarme SpO2 basso: si attiva entro 10s dal superamento soglia" },
{ id: "all_spo2_high", text: "Allarme SpO2 alto: si attiva entro 10s (se previsto)" },
{ id: "all_fc_low", text: "Allarme FC bassa: si attiva entro 10s" },
{ id: "all_fc_high", text: "Allarme FC alta: si attiva entro 10s" },
{ id: "all_sensore", text: "Allarme sensore scollegato/no segnale: si attiva entro 10s" },
{ id: "all_audio", text: "Segnale acustico udibile a 1m (>= 45 dB)" },
{ id: "all_visivo", text: "Segnale visivo (icona/LED): chiaramente visibile" },
{ id: "all_pausa", text: "Funzione pausa/silenziamento allarme: funzionante, ripristino automatico <= 120s" },
]
},
{
id: "perfusione", title: "Indice di perfusione (PI) - OPZIONALE",
note: "OPZIONALE - solo se il dispositivo riporta l'indice di perfusione (PI). Verifica del comportamento a basso segnale.",
items: [
{ id: "pi_basso", text: "Lettura PI bassa (< 1%): dispositivo riconosce condizione e segnala bassa perfusione" },
{ id: "pi_norm", text: "Lettura PI normale (3-10%): valore stabile su simulatore" },
]
},
{
id: "registro", title: "Registro e documentazione",
items: [
{ id: "data_ora", text: "Data/ora di sistema corrette" },
{ id: "memorizzazione", text: "Memorizzazione trend (se presente): funzionante" },
{ id: "trasferimento", text: "Trasferimento dati / interfaccia (USB/Bluetooth, se prevista): funzionante" },
{ id: "registro_aggiornato", text: "Registro manutenzioni aggiornato con data e firma tecnico" },
]
},
]
},
"defibrillatore": {
label: "Defibrillatore manuale", icon: "›", norm: "IEC 60601-2-4:2010+AMD1:2018",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri, nessun danno visibile" },
{ id: "involucro", text: "Involucro e display: privi di crepe, bruciature o danni meccanici" },
{ id: "piastre", text: "Palette/piastre manuali: superficie conduttiva integra, impugnatura isolata" },
{ id: "pad_adesivi", text: "Pad adesivi (se presenti): non scaduti, gel integro, connettori OK" },
{ id: "cavo_ecg", text: "Cavo ECG paziente e connettori: integrità isolamento, clip/elettrodi funzionanti" },
{ id: "stampante", text: "Stampante termica: carta presente, funzionante" },
{ id: "etichette", text: "Etichette di sicurezza, classe e numero serie: leggibili e presenti" },
]
},
{
id: "batteria", title: "Batteria e alimentazione", note: "Verificare la carica residua con l'indicatore del defibrillatore (o analizzatore di batteria): ≥ 80%. Controllare il funzionamento a rete e il passaggio automatico a batteria in caso di mancanza rete.",
items: [
{ id: "batt_scad", text: "Data scadenza batteria: non superata" },
{ id: "batt_carica", text: "Indicatore carica: livello adeguato per utilizzo" },
{ id: "batt_autotest", text: "Autotest batteria (se previsto dal costruttore): superato" },
{ id: "rete_ok", text: "Funzionamento da rete: corretto, indicatore carica attivo" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
]
},
{
id: "funz_base", title: "Funzionalità di base",
items: [
{ id: "accensione", text: "Accensione: nessun messaggio di errore o allarme anomalo" },
{ id: "display", text: "Display: leggibile, nessun pixel morto o artefatto" },
{ id: "sel_energia", text: "Selettore energia: funzionante a tutti i livelli (da minimo a massimo)" },
{ id: "puls_carica", text: "Tasto CARICA: funzionante, tempo carica entro specifiche costruttore" },
{ id: "puls_scarica", text: "Tasto SCARICA: funzionante (test su analizzatore/carico resistivo)" },
{ id: "beep_carica", text: "Segnale acustico carica completata: presente e udibile" },
{ id: "annullamento", text: "Annullamento carica (tasto o timeout): funzionante" },
]
},
{
id: "energia", title: "Energia erogata (IEC 60601-2-4 cl.201.12.4.101)",
note: "Misurare con analizzatore certificato su carico resistivo 50 Ω. Tolleranza ammessa: ±15% del valore selezionato oppure ±3 J (si applica il maggiore dei due). Eseguire anche a 25 Ω e 175 Ω se richiesto dal costruttore.",
items: [
{ id: "carico_50", text: "Analizzatore collegato: carico 50 Ω" },
{ id: "forma_onda", text: "Forma d'onda di scarica (bifasica/monofasica): conforme alle specifiche costruttore" },
],
measures: [
{ id: "e_low", name: "Energia — selezione minima", unit: "J", expected: "sel. ±15% o ±3J", value: "" },
{ id: "e_50j", name: "Energia — selezione 50 J", unit: "J", expected: "50 ±15% (42.5–57.5) o ±3J", limitVal: 57.5, limitMin: 42.5, value: "" },
{ id: "e_100j", name: "Energia — selezione 100 J", unit: "J", expected: "100 ±15% (85–115)", limitVal: 115, limitMin: 85, value: "" },
{ id: "e_150j", name: "Energia — selezione 150 J", unit: "J", expected: "150 ±15% (127.5–172.5)", limitVal: 172.5, limitMin: 127.5, value: "" },
{ id: "e_200j", name: "Energia — selezione 200 J", unit: "J", expected: "200 ±15% (170–230)", limitVal: 230, limitMin: 170, value: "" },
{ id: "e_max", name: "Energia — selezione massima", unit: "J", expected: "max ±15% o ±3J", value: "" },
{ id: "t_carica", name: "Tempo di carica a energia max", unit: "s", expected: "≤ 15 s (IEC 60601-2-4)", limitVal: 15, value: "" },
]
},
{
id: "sync", title: "Cardioversione sincronizzata (IEC 60601-2-4 cl.201.12.4.4)",
note: "Il ritardo tra picco R e inizio scarica deve essere < 60 ms (IEC 60601-2-4). Strumento: analizzatore di defibrillatori con simulatore ECG.",
items: [
{ id: "sync_attiva", text: "Modalità SYNC: attivabile, indicatore visivo presente" },
{ id: "sync_marker", text: "Marker di sincronismo sull'onda R del tracciato ECG: visibile" },
{ id: "sync_auto_off", text: "Disattivazione automatica SYNC dopo scarica: confermata" },
],
measures: [
{ id: "sync_delay", name: "Ritardo scarica dal picco R (sync delay)", unit: "ms", expected: "< 60 ms", limitVal: 60, value: "" },
]
},
{
id: "ecg_mon", title: "Monitoraggio ECG (IEC 60601-2-27)", note: "Con simulatore paziente ECG impostare 60 e 120 bpm e verificare la FC visualizzata (tolleranza ±1% o ±1 bpm). Controllare la qualità della traccia su tutte le derivazioni.", note: "Collega un simulatore ECG e verifica che la FC visualizzata corrisponda (±5% o ±1 bpm) e che la traccia sia pulita. Strumenti: simulatore ECG/paziente certificato.",
items: [
{ id: "ecg_tracciato", text: "Tracciato ECG su simulatore: morfologia corretta, no artefatti" },
{ id: "ecg_derivazioni", text: "Selezione derivazioni (I, II, III, aVR, aVL, aVF, V): funzionante" },
{ id: "ecg_allarmi", text: "Allarmi FC alta/bassa: attivazione nei range impostati" },
{ id: "ecg_vf", text: "Rilevazione FV (se previsto): segnale di allarme presente" },
],
measures: [
{ id: "fc_sim60", name: "FC visualizzata — simulatore a 60 bpm", unit: "bpm", expected: "60 ±1% o ±1 bpm", limitVal: 61, limitMin: 59, value: "" },
{ id: "fc_sim120", name: "FC visualizzata — simulatore a 120 bpm", unit: "bpm", expected: "120 ±1% o ±1 bpm", limitVal: 122, limitMin: 118, value: "" },
]
},
{
id: "pacing", title: "Pacing esterno transcutaneo (se presente)",
items: [
{ id: "pacing_attiva", text: "Modalità pacing: attivabile" },
{ id: "pacing_freq", text: "Frequenza pacing: selezionabile nel range indicato" },
{ id: "pacing_corrente", text: "Corrente stimolazione: selezionabile da min a max" },
{ id: "pacing_cattura", text: "Cattura ventricolare verificabile su simulatore ECG" },
{ id: "pacing_spike", text: "Spike di pacing visibile sul tracciato" },
]
},
]
},
"dae": {
label: "Defibrillatore Automatico Esterno", icon: "›", norm: "IEC 60601-2-4:2010+AMD1:2018 / L. 116/2021 + DM Salute 16/03/2023",
sections: [
{
id: "ispezione", title: "Ispezione visiva e stato operativo",
items: [
{ id: "contenitore", text: "Contenitore/zaino: integrità, chiusura funzionante" },
{ id: "segnalatore", text: "Segnalatore di pronto intervento (luce verde/LED): attivo" },
{ id: "involucro", text: "Involucro DAE: privo di danni, sporco o umidità" },
{ id: "display", text: "Display/segnalazioni vocali: funzionanti" },
{ id: "pad_adulti", text: "Pad adulti: non scaduti, confezionamento integro" },
{ id: "pad_pediatrici", text: "Pad pediatrici (se presenti): non scaduti, integri" },
{ id: "accessori", text: "Accessori kit (forbici, rasoio, guanti, garze): presenti e integri" },
]
},
{
id: "batteria", title: "Batteria (IEC 60601-2-4)", note: "Verificare data di scadenza e carica residua con l'indicatore del DAE (o analizzatore). Controllare il numero di scariche residue stimate e l'esito dell'autotest automatico (log di sistema).",
items: [
{ id: "batt_scad", text: "Data scadenza batteria: non superata" },
{ id: "batt_status", text: "Indicatore stato batteria: OK / pronto" },
{ id: "batt_autotest", text: "Autotest automatico superato (log di sistema)" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
{ id: "n_scariche", name: "Numero scariche residue stimate", unit: "n", expected: "≥ 100 scariche", limitVal: 100, invertPass: true, value: "" },
]
},
{
id: "funz_dae", title: "Verifica funzionale (con analizzatore/simulatore)",
note: "Usare simulatore ECG con pattern FV/TV. NON eseguire scarica su persona.",
items: [
{ id: "analisi_fv", text: "Analisi ritmo FV: DAE consiglia scarica correttamente" },
{ id: "analisi_rns", text: "Analisi ritmo sinusale normale: DAE NON consiglia scarica" },
{ id: "guida_vocale", text: "Guida vocale durante procedura: chiara e corretta" },
{ id: "segnale_cpr", text: "Segnale guida RCP post-scarica: presente (se previsto)" },
]
},
{
id: "energia_dae", title: "Verifica energia erogata",
note: "Misurare con analizzatore su carico 50 Ω. Tolleranza ±15% o ±3J.",
items: [
{ id: "scarica_ok", text: "Scarica su carico 50 Ω: eseguita correttamente" },
],
measures: [
{ id: "e_scarica1", name: "Energia 1ª scarica", unit: "J", expected: "secondo costruttore ±15%", value: "" },
{ id: "e_scarica2", name: "Energia 2ª scarica (se escalation)", unit: "J", expected: "secondo costruttore ±15%", value: "" },
]
},
{
id: "registro", title: "Registro e documentazione",
items: [
{ id: "log_ok", text: "Log eventi scaricato e verificato (nessun allarme anomalo)" },
{ id: "data_manut", text: "Data prossima manutenzione/scadenza aggiornata" },
{ id: "posizione", text: "Segnaletica posizione DAE: visibile e corretta" },
{ id: "registro_aggiornato", text: "Registro manutenzioni aggiornato" },
]
},
]
},
"aspiratore_chirurgico": {
label: "Aspiratore chirurgico / da secreti", icon: "›", norm: "ISO 10079-1:2022",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro, spina OK" },
{ id: "involucro", text: "Involucro e carrello (se presente): integrità strutturale" },
{ id: "tubazioni", text: "Tubazioni, raccordi e connettori: integri, senza cricche o occlusioni" },
{ id: "filtro_batt", text: "Filtro batterico: presente, non scaduto, non otturato" },
{ id: "filtro_idr", text: "Filtro idrofobico (protezione pompa): presente e integro" },
{ id: "contenitore", text: "Contenitore liquidi: integro, guarnizioni OK, sistema di smaltimento funzionante" },
{ id: "overflow", text: "Dispositivo di protezione overflow: presente e funzionante" },
{ id: "valvola_sic", text: "Valvola di sicurezza/limitatore di pressione: presente" },
]
},
{
id: "vuoto", title: "Verifica del vuoto (ISO 10079-1 cl.5.2)",
note: "Aspiratore chirurgico: vuoto max ≥ 80 kPa. Aspiratore da secreti: ≥ 60 kPa. Misurare a contenitore chiuso. Strumento: vacuometro / manometro di riferimento.",
items: [
{ id: "otturazione", text: "Occlusione dell'uscita paziente: corretta per test" },
],
measures: [
{ id: "vuoto_max", name: "Vuoto massimo (contenitore chiuso)", unit: "kPa", expected: "≥ 80 kPa (chirurgico) / ≥ 60 kPa (secreti)", limitVal: 80, invertPass: true, value: "" },
{ id: "t_vuoto", name: "Tempo raggiungimento vuoto max", unit: "s", expected: "< 20 s (chirurgico)", limitVal: 20, value: "" },
]
},
{
id: "portata", title: "Verifica portata (ISO 10079-1 cl.5.3)",
note: "Portata libera misurata a pressione atmosferica. Chirurgico: ≥ 25 L/min. Da secreti: ≥ 15 L/min. Strumento: flussimetro.",
measures: [
{ id: "portata_lib", name: "Portata libera (max, a 0 kPa)", unit: "L/min", expected: "≥ 25 L/min (chir.)", limitVal: 25, invertPass: true, value: "" },
{ id: "portata_50", name: "Portata a 50 kPa di depressione", unit: "L/min", expected: "≥ 15 L/min", limitVal: 15, invertPass: true, value: "" },
{ id: "regolazione", name: "Depressione regolabile (valore max impostato)", unit: "kPa", expected: "regolabile", value: "" },
]
},
{
id: "batteria_asp", title: "Batteria (se dispositivo portatile)", note: "Verificare la carica residua con l'indicatore del dispositivo. Per i portatili controllare l'autonomia dichiarata a vuoto massimo.",
items: [
{ id: "batt_scad", text: "Batteria: non scaduta, carica adeguata" },
{ id: "autonomia", text: "Autonomia su batteria: sufficiente per l'uso previsto" },
],
measures: [
{ id: "batt_perc", name: "Carica residua", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
]
},
]
},
"elettrobisturi": {
label: "Elettrobisturi / Unità HF chirurgica", icon: "›", norm: "IEC 60601-2-2:2017+A1:2023",
sections: [
{
id: "targa", title: "Dati di targa (dichiarati dal costruttore)",
note: "Trascrivi dalla targa dati / manuale i valori nominali, così le potenze misurate hanno un riferimento di confronto. Se mancano (es. apparecchi ≤50 W o targa illeggibile), lascia vuoto.",
items: [
{ id: "modello_targa", text: "Targa dati presente e leggibile" },
],
measures: [
{ id: "targa_p_mono", name: "Potenza max MONOPOLARE dichiarata", unit: "W", expected: "da targa/manuale", value: "" },
{ id: "targa_p_bip", name: "Potenza max BIPOLARE dichiarata", unit: "W", expected: "da targa/manuale", value: "" },
{ id: "targa_carico", name: "Carico nominale dichiarato", unit: "Ω", expected: "da targa/manuale (es. 300 Ω)", value: "" },
]
},
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integrità isolamento" },
{ id: "involucro", text: "Involucro: privo di danni, ventilazione libera" },
{ id: "cavi_att", text: "Cavi elettrodi attivi (monopolare/bipolare): isolamento integro, connettori OK" },
{ id: "elettrodo_n", text: "Elettrodo neutro (piastra): integrità, connettore, cavo" },
{ id: "pedale", text: "Pedale di comando (se presente): funzionante, cavo integro" },
{ id: "etichette", text: "Etichette potenza, avvertenze e classe: leggibili" },
]
},
{
id: "funz_hf", title: "Verifica funzionale",
items: [
{ id: "accensione", text: "Accensione: nessun allarme anomalo" },
{ id: "display", text: "Display potenza e modalità: corretto" },
{ id: "sel_modo", text: "Selezione modalità (CUT/COAG/BLEND): funzionante" },
{ id: "attivazione", text: "Attivazione manuale e pedale: funzionanti" },
{ id: "allarme_en", text: "Monitoraggio qualità contatto elettrodo neutro (CQM) e allarme disconnessione: attivi (IEC 60601-2-2)" },
]
},
{
id: "potenza", title: "Potenza erogata — MONOPOLARE (IEC 60601-2-2 cl.201.12.4.101)",
note: "Analizzatore HF certificato. Ogni modo al SUO carico resistivo, attivando a potenza massima (o ai gradini dichiarati). Carico tipico CUT ~300 Ω, COAG ~500 Ω (verifica i valori sul manuale del costruttore). Tolleranza ±20% della potenza nominale.",
items: [
{ id: "carico_cut", text: "CUT: carico resistivo impostato (~300 Ω, vedi manuale)" },
{ id: "carico_coag", text: "COAG: carico resistivo impostato (~500 Ω, vedi manuale)" },
],
measures: [
{ id: "p_cut_low", name: "Potenza CUT — selezione bassa (es. 30W) @ ~300 Ω", unit: "W", expected: "30 ±20% (24–36 W)", limitVal: 36, limitMin: 24, value: "" },
{ id: "p_cut_med", name: "Potenza CUT — selezione media (es. 60W) @ ~300 Ω", unit: "W", expected: "60 ±20% (48–72 W)", limitVal: 72, limitMin: 48, value: "" },
{ id: "p_cut_high", name: "Potenza CUT — selezione alta (es. 100W) @ ~300 Ω", unit: "W", expected: "100 ±20% (80–120 W)", limitVal: 120, limitMin: 80, value: "" },
{ id: "p_coag_low", name: "Potenza COAG — selezione bassa @ ~500 Ω", unit: "W", expected: "secondo costruttore ±20%", value: "" },
{ id: "p_coag_high", name: "Potenza COAG — selezione alta @ ~500 Ω", unit: "W", expected: "secondo costruttore ±20%", value: "" },
]
},
{
id: "potenza_bip", title: "Potenza erogata — BIPOLARE (se presente)",
note: "Uscita bipolare al suo carico dedicato (~100 Ω tipico; alcuni strumenti usano 50–200 Ω — vedi manuale). Se il bipolare ha sia COAG sia CUT, compila entrambi; molti generatori hanno solo COAG bipolare. Strumento: analizzatore di elettrochirurgia (carico RF + wattmetro).",
items: [
{ id: "carico_bip", text: "BIPOLARE: carico resistivo dedicato impostato (~100 Ω, vedi manuale)" },
],
measures: [
{ id: "p_bip_coag", name: "Potenza BIPOLARE COAG @ ~100 Ω", unit: "W", expected: "secondo costruttore ±20%", value: "" },
{ id: "p_bip_cut", name: "Potenza BIPOLARE CUT @ ~100 Ω (se presente)", unit: "W", expected: "secondo costruttore ±20%", value: "" },
]
},
{
id: "hf_leak", title: "Corrente di dispersione HF (IEC 60601-2-2 cl.201.8.4.101)",
note: "Misura la corrente HF verso terra da OGNI terminale d'uscita (attivo e neutro), separatamente, attivando a POTENZA MASSIMA. L'analizzatore applica un carico ~200 Ω. La maggior parte delle letture deve stare sotto i 150 mA.",
items: [
{ id: "hf_setup", text: "Carico ~200 Ω verso terra su ciascun terminale; attivazione a potenza massima" },
],
measures: [
{ id: "i_hf_mono_act", name: "Dispersione HF — monopolare, terminale ATTIVO @ Pmax", unit: "mA", expected: "< 150 mA", limitVal: 150, value: "" },
{ id: "i_hf_mono_neu", name: "Dispersione HF — monopolare, elettrodo NEUTRO @ Pmax", unit: "mA", expected: "< 150 mA", limitVal: 150, value: "" },
{ id: "i_hf_bip", name: "Dispersione HF — bipolare (se presente) @ Pmax", unit: "mA", expected: "< 150 mA", limitVal: 150, value: "" },
]
},
{
id: "uscite_extra", title: "Uscite aggiuntive e accessori speciali (opzionale)",
note: "Compila SOLO se il generatore ha più di una presa monopolare o uscite proprietarie (es. vessel sealing / LigaSure di Covidien-Medtronic, ablazione). Verifica ogni uscita extra come le altre: potenza al suo carico + dispersione HF. Se l'apparecchio non le ha, lascia tutto vuoto: questa sezione non comparirà sul verbale. Strumento: analizzatore di elettrochirurgia.",
items: [
{ id: "uscite_n", text: "Numero e tipo di uscite verificate corrisponde alla targa/manuale" },
],
measures: [
{ id: "extra1_desc_p", name: "Uscita extra 1 — potenza misurata (indica presa e modo nelle note)", unit: "W", expected: "secondo costruttore ±20%", value: "" },
{ id: "extra1_hf", name: "Uscita extra 1 — dispersione HF @ Pmax", unit: "mA", expected: "< 150 mA", limitVal: 150, value: "" },
{ id: "extra2_desc_p", name: "Uscita extra 2 — potenza misurata (indica presa e modo nelle note)", unit: "W", expected: "secondo costruttore ±20%", value: "" },
{ id: "extra2_hf", name: "Uscita extra 2 — dispersione HF @ Pmax", unit: "mA", expected: "< 150 mA", limitVal: 150, value: "" },
]
},
]
},
"monitor_multipar": {
label: "Monitor multiparametrico", icon: "›", norm: "IEC 60601-2-27/30/49 · ISO 80601-2-61",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro" },
{ id: "involucro", text: "Involucro e schermo: privi di danni, schermo leggibile" },
{ id: "cavi_paz", text: "Cavi paziente (ECG, SpO2, NIBP, temperatura): integrità e connettori" },
{ id: "manicotti", text: "Manicotti NIBP: integrità, assenza perdite d'aria" },
{ id: "sensori", text: "Sensori SpO2 e temperatura: condizioni operative OK" },
]
},
{
id: "ecg_mon", title: "ECG (IEC 60601-2-27)",
note: "Collega un simulatore paziente ECG, imposta FC note (es. 60 e 120 bpm) e verifica la FC visualizzata: tolleranza ±1% o ±1 bpm. Controlla che la traccia sia pulita su tutte le derivazioni.",
items: [
{ id: "tracciato", text: "Tracciato ECG con simulatore: morfologia corretta, assenza artefatti" },
{ id: "derivazioni", text: "Selezione derivazioni: tutte funzionanti (almeno I, II, III)" },
{ id: "allarmi_fc", text: "Allarmi FC alta/bassa: attivazione nei limiti impostati" },
{ id: "st_analisi", text: "Analisi del tratto ST (se presente): visualizzazione corretta" },
],
measures: [
{ id: "fc_30", name: "FC — simulatore 30 bpm", unit: "bpm", expected: "30 ±1 bpm", limitVal: 31, limitMin: 29, value: "" },
{ id: "fc_60", name: "FC — simulatore 60 bpm", unit: "bpm", expected: "60 ±1 bpm", limitVal: 61, limitMin: 59, value: "" },
{ id: "fc_120", name: "FC — simulatore 120 bpm", unit: "bpm", expected: "120 ±1 bpm", limitVal: 121, limitMin: 119, value: "" },
{ id: "fc_200", name: "FC — simulatore 200 bpm", unit: "bpm", expected: "200 ±1% o ±1 bpm", limitVal: 202, limitMin: 198, value: "" },
]
},
{
id: "spo2", title: "SpO₂ (ISO 80601-2-61)",
note: "Collega un simulatore SpO₂ e verifica la lettura a punti fissi (es. 90%, 80%, 70%), tolleranza ±2–3%. Il dato ±3% ARMS su 70–100% è la specifica del costruttore (media statistica) e non si ricalcola in verifica periodica.",
items: [
{ id: "spo2_display", text: "Visualizzazione SpO2 e curva pletismografica: corretta" },
{ id: "spo2_allarmi", text: "Allarmi SpO2 bassa: attivazione corretta" },
],
measures: [
{ id: "spo2_98", name: "SpO2 — simulatore 98%", unit: "%", expected: "98 ±3% (95–100)", limitVal: 100, limitMin: 95, value: "" },
{ id: "spo2_90", name: "SpO2 — simulatore 90%", unit: "%", expected: "90 ±3% (87–93)", limitVal: 93, limitMin: 87, value: "" },
{ id: "spo2_80", name: "SpO2 — simulatore 80%", unit: "%", expected: "80 ±3% (77–83)", limitVal: 83, limitMin: 77, value: "" },
{ id: "fc_spo2", name: "FC da SpO2 — simulatore 60 bpm", unit: "bpm", expected: "60 ±3 bpm", limitVal: 63, limitMin: 57, value: "" },
]
},
{
id: "nibp", title: "NIBP — PA non invasiva (IEC 60601-2-30)",
note: "In verifica periodica si controlla la pressione STATICA: collega un simulatore NIBP (o un manometro di riferimento) e confronta il valore letto, tolleranza ±3 mmHg. L'accuratezza clinica (errore medio ≤5 mmHg, SD ≤8 mmHg, IEC 60601-2-30 / ISO 81060-2) è validata dal costruttore e non si ripete sul campo.",
items: [
{ id: "gonfiaggio", text: "Gonfiaggio e sgonfiaggio automatico: corretto" },
{ id: "allarmi_pa", text: "Allarmi PA alta/bassa: attivazione corretta" },
{ id: "modalita", text: "Modalità manuale, automatica e STAT: funzionanti" },
],
measures: [
{ id: "pa_sis_120", name: "PA sistolica — riferimento 120 mmHg", unit: "mmHg", expected: "120 ±5 mmHg (115–125)", limitVal: 125, limitMin: 115, value: "" },
{ id: "pa_dias_80", name: "PA diastolica — riferimento 80 mmHg", unit: "mmHg", expected: "80 ±5 mmHg (75–85)", limitVal: 85, limitMin: 75, value: "" },
{ id: "pa_map_93", name: "PA media (MAP) — riferimento 93 mmHg", unit: "mmHg", expected: "93 ±5 mmHg", limitVal: 98, limitMin: 88, value: "" },
]
},
{
id: "temp", title: "Temperatura (IEC 60601-2-56)",
note: "Accuratezza richiesta: ±0.3°C nel range clinico 35–42°C. Strumento: simulatore di temperatura (resistenza di precisione).",
measures: [
{ id: "temp_37", name: "Temperatura — riferimento 37.0°C", unit: "°C", expected: "37.0 ±0.3°C (36.7–37.3)", limitVal: 37.3, limitMin: 36.7, value: "" },
{ id: "temp_39", name: "Temperatura — riferimento 39.0°C", unit: "°C", expected: "39.0 ±0.3°C (38.7–39.3)", limitVal: 39.3, limitMin: 38.7, value: "" },
]
},
{
id: "allarmi_mon", title: "Sistema allarmi (IEC 60601-1-8)",
note: "IEC 60601-1-8 impone che tutti gli allarmi di priorità alta siano visivi E acustici.",
items: [
{ id: "allarme_vis", text: "Allarmi alta priorità: segnalazione visiva (lampeggio rosso) presente" },
{ id: "allarme_ac", text: "Allarmi alta priorità: segnalazione acustica presente e udibile" },
{ id: "allarme_sil", text: "Silenziamento allarmi: funzionante con ripristino automatico" },
{ id: "allarme_tecn", text: "Allarmi tecnici (guasto tecnico, batteria scarica): attivazione corretta" },
]
},
{
id: "etco2", title: "etCO₂ (ISO 80601-2-55) — se presente", note: "Con miscela di gas di riferimento a concentrazione nota (es. 5% CO₂ ≈ 38 mmHg) verificare la lettura etCO₂ (±2 mmHg o ±8%) e la frequenza respiratoria da capnografia (±1 atto/min). Attendere il warm-up del modulo.", note: "Eroga una miscela di CO₂ nota (o usa il simulatore di gas) e verifica la lettura etCO₂ (±2 mmHg o ±8%) e la frequenza respiratoria. Strumenti: miscela/simulatore di CO₂ certificato.",
measures: [
{ id: "etco2_val", name: "etCO2 — gas di riferimento (es. 38 mmHg)", unit: "mmHg", expected: "±2 mmHg o ±8%", value: "" },
{ id: "fr_etco2", name: "FR da capnografia", unit: "atti/min", expected: "±1 atto/min", value: "" },
]
},
]
},
"ventilatore": {
label: "Ventilatore polmonare (terapia intensiva)", icon: "›", norm: "ISO 80601-2-12:2023",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri" },
{ id: "involucro", text: "Involucro: privo di danni, ventilazione libera" },
{ id: "circuito", text: "Circuito paziente: integrità tubi, raccordi, valvole espiratoria/inspiratoria" },
{ id: "filtri", text: "Filtri (antibatterico, HMEF): presenti e non scaduti" },
{ id: "sensori_fl", name: "Sensori di flusso e pressione: puliti, non otturati" },
{ id: "umidif", text: "Umidificatore (se presente): livello acqua corretto, integro" },
{ id: "polmone_test", text: "Polmone test per calibrazione: disponibile" },
{ id: "o2_supply", text: "Alimentazione O2 e aria compressa: pressione corretta (3.5–6 bar)" },
]
},
{
id: "calibrazione", title: "Calibrazione e autotest",
items: [
{ id: "autotest", text: "Autotest all'accensione: superato senza errori" },
{ id: "calib_fluido", text: "Calibrazione sensori di flusso: eseguita secondo costruttore" },
{ id: "test_tenuta", text: "Test tenuta circuito (leak test): perdita entro specifiche costruttore" },
{ id: "calib_o2", text: "Calibrazione cella O2 (se applicabile): eseguita" },
]
},
{
id: "parametri", title: "Verifica accuratezza parametri erogati (ISO 80601-2-12 cl.201.12.4)",
note: "ISO 80601-2-12: VT ±10% o ±10 mL; FR ±1 atto/min; PEEP ±2 cmH2O; FiO2 ±3%; Ppeak ±4% o ±2 cmH2O. Strumento: analizzatore di gas/flusso respiratori + polmone di prova.",
items: [
{ id: "connessione", text: "Ventilatore connesso al polmone test" },
],
measures: [
{ id: "vt_500", name: "Volume corrente erogato (impostato 500 mL)", unit: "mL", expected: "500 ±(4 mL+15%) → 421–579", limitVal: 579, limitMin: 421, value: "" },
{ id: "fr_15", name: "Frequenza respiratoria (impostata 15 a/min)", unit: "atti/min", expected: "15 ±1 (14–16)", limitVal: 16, limitMin: 14, value: "" },
{ id: "peep_5", name: "PEEP (impostata 5 cmH2O)", unit: "cmH2O", expected: "5 ±2 (3–7)", limitVal: 7, limitMin: 3, value: "" },
{ id: "peep_10", name: "PEEP (impostata 10 cmH2O)", unit: "cmH2O", expected: "10 ±2 (8–12)", limitVal: 12, limitMin: 8, value: "" },
{ id: "fio2_40", name: "FiO2 (impostata 40%)", unit: "%", expected: "40 ±3% (37–43)", limitVal: 43, limitMin: 37, value: "" },
{ id: "fio2_100", name: "FiO2 (impostata 100%)", unit: "%", expected: "100 ±3% (97–100)", limitVal: 100, limitMin: 97, value: "" },
{ id: "ppeak", name: "Pressione di picco inspiratoria", unit: "cmH2O", expected: "±4% o ±2 cmH2O del valore misurato", value: "" },
]
},
{
id: "allarmi_vent", title: "Allarmi (ISO 80601-2-12 + IEC 60601-1-8)",
note: "Allarmi obbligatori per ventilatori TI: disconnessione, alta pressione, apnea, alimentazione gas, O2.",
items: [
{ id: "alarm_disc", text: "Allarme DISCONNESSIONE paziente: attivazione < 15 s" },
{ id: "alarm_press", text: "Allarme ALTA PRESSIONE: attivazione al superamento del limite impostato" },
{ id: "alarm_apnea", text: "Allarme APNEA: attivazione entro il tempo impostato (default 20 s)" },
{ id: "alarm_o2", text: "Allarme MANCANZA O2/ARIA: attivazione corretta" },
{ id: "alarm_power", text: "Allarme MANCANZA ALIMENTAZIONE elettrica: attivazione" },
{ id: "batt_vent", text: "Autonomia su batteria interna: sufficiente (≥ 30 min o secondo costruttore)" },
{ id: "alarm_fio2", text: "Allarme FiO2 bassa/alta: attivazione corretta (se presente)" },
]
},
]
},
"pompa_infusionale": {
label: "Pompa infusionale / siringa elettrica", icon: "›", norm: "IEC 60601-2-24:2012",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro" },
{ id: "involucro", text: "Involucro: privo di danni, slot siringa/sacca funzionante" },
{ id: "display", text: "Display e tastiera: leggibili e funzionanti" },
{ id: "porta_set", text: "Porta set infusionale / sede siringa: pulizia, usura meccanismo" },
{ id: "sensori", text: "Sensori aria in linea e occlusione: presenti e attivi" },
]
},
{
id: "accuratezza", title: "Accuratezza portata (IEC 60601-2-24 cl.201.12.4.101)",
note: "IEC 60601-2-24: errore portata ≤ ±5% dopo periodo di stabilizzazione (almeno 1h a portata nominale). Misurare con metodo gravimetrico o contagocce calibrato.",
items: [
{ id: "stabilizz", text: "Periodo di stabilizzazione ≥ 1 ora prima della misurazione" },
{ id: "metodo_grav", text: "Metodo di misura: gravimetrico (bilancia ±0.01 g) o contagocce calibrato" },
],
measures: [
{ id: "q_5", name: "Portata — impostata 5 mL/h", unit: "mL/h", expected: "5 ±5% (4.75–5.25)", limitVal: 5.25, limitMin: 4.75, value: "" },
{ id: "q_25", name: "Portata — impostata 25 mL/h", unit: "mL/h", expected: "25 ±5% (23.75–26.25)", limitVal: 26.25, limitMin: 23.75, value: "" },
{ id: "q_100", name: "Portata — impostata 100 mL/h", unit: "mL/h", expected: "100 ±5% (95–105)", limitVal: 105, limitMin: 95, value: "" },
{ id: "q_kvo", name: "Portata KVO (Keep Vein Open)", unit: "mL/h", expected: "1–5 mL/h (secondo costruttore)", value: "" },
]
},
{
id: "allarmi_pompa", title: "Allarmi (IEC 60601-2-24 + IEC 60601-1-8)",
items: [
{ id: "alarm_occ", text: "Allarme OCCLUSIONE a valle: attivazione entro pressione specificata dal costruttore" },
{ id: "alarm_aria", text: "Allarme ARIA IN LINEA: attivazione con bolla ≥ 50 µL (se presente sensore)" },
{ id: "alarm_fine", text: "Allarme FINE INFUSIONE / SIRINGA QUASI VUOTA: attivazione corretta" },
{ id: "alarm_batt", text: "Allarme BATTERIA SCARICA: attivazione con preavviso adeguato" },
{ id: "alarm_porta", text: "Allarme PORTA APERTA / SIRINGA RIMOSSA: attivazione immediata" },
]
},
{
id: "batteria_pompa", title: "Batteria", note: "Verificare la carica residua con l'indicatore della pompa. Controllare l'autonomia su batteria a flusso nominale (≥ 4 h tipico) e il passaggio automatico a batteria in mancanza rete.",
items: [
{ id: "batt_scad", text: "Batteria: non scaduta" },
],
measures: [
{ id: "batt_perc", name: "Carica residua", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
{ id: "autonomia_h", name: "Autonomia su batteria", unit: "h", expected: "≥ 4 h (o secondo costruttore)", limitVal: 4, invertPass: true, value: "" },
]
},
]
},
"ecografo": {
label: "Ecografo", icon: "›", norm: "IEC 60601-2-37:2024",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro" },
{ id: "involucro", text: "Carrello/console: integrità strutturale, stabilità" },
{ id: "sonde", text: "Sonde: nessuna cricca, scheggia o delaminazione del trasduttore" },
{ id: "cavi_sonde", text: "Cavi sonde: isolamento integro, connettori puliti e funzionanti" },
{ id: "monitor", text: "Monitor: nessun pixel morto, luminosità adeguata" },
{ id: "gel", text: "Gel ecografico: disponibile e adeguato" },
]
},
{
id: "funz_eco", title: "Verifica funzionale",
note: "Usare fantoccio ecografico (phantom) per verifica accuratezza. Se non disponibile, documentare verifica su soggetto/mano.",
items: [
{ id: "accensione", text: "Accensione: nessun errore, autotest OK" },
{ id: "b_mode", text: "Modalità B-mode: immagine acquisita, risoluzione adeguata" },
{ id: "m_mode", text: "Modalità M-mode (se presente): tracciato tempo/movimento corretto" },
{ id: "doppler_col", text: "Color Doppler (se presente): flusso visualizzato correttamente" },
{ id: "doppler_pw", text: "PW/CW Doppler (se presente): spettro Doppler corretto" },
{ id: "misure", text: "Misure caliper (distanza/area): funzionanti" },
{ id: "stampa_arch", text: "Stampa/archiviazione immagini: funzionante" },
{ id: "selezione_sonde", text: "Selezione sonde (se multiple): tutte riconosciute" },
]
},
{
id: "phantom", title: "Verifica con fantoccio (phantom test)",
note: "Se disponibile fantoccio calibrato, verificare risoluzione assiale/laterale e accuratezza distanze.",
measures: [
{ id: "dist_10mm", name: "Distanza misurata — target 10 mm", unit: "mm", expected: "10 ±1 mm (±10%)", limitVal: 11, limitMin: 9, value: "" },
{ id: "dist_50mm", name: "Distanza misurata — target 50 mm", unit: "mm", expected: "50 ±5 mm (±10%)", limitVal: 55, limitMin: 45, value: "" },
{ id: "profondita", name: "Profondità massima immagine", unit: "cm", expected: "secondo costruttore", value: "" },
]
},
]
},
"letto_elettrico": {
label: "Letto elettrico / barella motorizzata", icon: "›", norm: "IEC 60601-2-52:2009+A1:2015",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri, nessun danno" },
{ id: "struttura", text: "Struttura, sponde e materasso: integrità, nessun spigolo tagliente" },
{ id: "intrappolamento", text: "Zone di intrappolamento / dimensioni sponde conformi (IEC 60601-2-52)" },
{ id: "freni", text: "Freni ruote: funzionanti su tutti i punti di frenatura" },
{ id: "comandi", text: "Comandi paziente e infermiere: tutti funzionanti, etichettati" },
{ id: "cavo_comandi", text: "Cavo telecomando: integro, connettore OK" },
{ id: "fine_corsa", text: "Fine corsa meccanici e elettrici: presenti e funzionanti" },
{ id: "giunti", text: "Giunti, snodi e meccanismi di articolazione: lubrificati, nessun gioco anomalo" },
]
},
{
id: "movimenti", title: "Verifica movimenti (IEC 60601-2-38 cl.201.15)",
note: "Verificare assenza di movimenti inattesi, vibrazioni, rumori anomali. Velocità massima limitata da norma. Strumento: metro / goniometro per altezze e angoli.",
items: [
{ id: "schienale_su", text: "Alzata schienale: movimento fluido, senza scatti, fine corsa funzionante" },
{ id: "schienale_giu", text: "Abbassamento schienale: corretto" },
{ id: "trendelenburg", text: "Trendelenburg (se presente): movimento fluido, fine corsa OK" },
{ id: "antitrendel", text: "Anti-Trendelenburg (se presente): corretto" },
{ id: "alzata_letto", text: "Alzata/abbassamento altezza letto: fluido, nessun bloccaggio" },
{ id: "sponde_el", text: "Sponde elettriche (se presenti): alzata/abbassamento corretti" },
{ id: "posizione_card", text: "Posizione cardiaca/sedia (se presente): funzionante" },
{ id: "posizione_prone", text: "Posizione prona (se presente): corretta" },
],
measures: [
{ id: "altezza_min", name: "Altezza minima dal suolo", unit: "cm", expected: "≤ 40 cm (accessibilità)", value: "" },
{ id: "altezza_max", name: "Altezza massima dal suolo", unit: "cm", expected: "secondo costruttore", value: "" },
{ id: "angolo_schienale", name: "Angolo massimo schienale", unit: "°", expected: "≥ 75°", limitVal: 75, invertPass: true, value: "" },
]
},
{
id: "sicurezza_letto", title: "Sicurezza e carichi",
items: [
{ id: "carico_max", text: "Carico massimo: etichetta presente e leggibile" },
{ id: "arresto_emerg", text: "Tasto di arresto emergenza (se presente): funzionante" },
{ id: "sovraccarico", text: "Protezione da sovraccarico: attiva" },
{ id: "cpe", text: "Sistema CPR/RCP (tasto emergenza schienale piatto): funzionante e raggiungibile" },
{ id: "intrappolamento", text: "Zone di intrappolamento (sponde/struttura): conformi, nessun varco pericoloso (IEC 60601-2-52)" },
]
},
]
},
"generico": {
label: "Apparecchio generico", icon: "›", norm: "IEC 60601-1:2005+A1:2012+A2:2020",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri" },
{ id: "involucro", text: "Involucro: privo di danni meccanici visibili" },
{ id: "acc", text: "Accessori e cavi paziente: integrità isolamento e connettori" },
{ id: "etichette", text: "Etichette identificazione, classe, tensione: presenti e leggibili" },
{ id: "ventilazione", text: "Aperture di ventilazione: libere, non ostruite" },
]
},
{
id: "funz_gen", title: "Verifica funzionale generale",
items: [
{ id: "accensione", text: "Accensione regolare: nessun messaggio di errore" },
{ id: "autotest", text: "Autotest (se previsto): superato" },
{ id: "funzione_1", text: "Funzione principale 1: operativa e conforme alle specifiche" },
{ id: "funzione_2", text: "Funzione principale 2: operativa" },
{ id: "allarmi", text: "Sistema allarmi: funzionante (visivo e acustico)" },
{ id: "display", text: "Display e interfaccia: leggibili e funzionanti" },
]
},
{
id: "misure_gen", title: "Misure (compilare secondo tipo apparecchio)", note: "Sezione generica: specificare le misure pertinenti al tipo di apparecchio, indicando per ciascuna lo strumento di riferimento usato e il limite secondo norma o manuale del costruttore.",
measures: [
{ id: "misura_1", name: "Misura 1 (specificare)", unit: "", expected: "secondo costruttore", value: "" },
{ id: "misura_2", name: "Misura 2 (specificare)", unit: "", expected: "secondo costruttore", value: "" },
{ id: "misura_3", name: "Misura 3 (specificare)", unit: "", expected: "secondo costruttore", value: "" },
]
},
]
},
};

/* — mappe e lookup template (spostati con il taglio verifiche, v2.90) — */
import { CND_TO_TPL } from "./cnd.js";
export const FUNC_TEMPLATE_MAP = [
{ keys: ["audiometro", "audiometria", "audiometer"], id: "audiometro" },
{ keys: ["spirometro", "spirometria", "spirometer"], id: "spirometro" },
{ keys: ["frigoemoteca", "frigoemoteche", "emoteca", "frigo emoteca", "frigorifero emocomponenti", "frigo farmaci", "frigo emazie"], id: "frigoemoteca" },
{ keys: ["bilancia", "pesapersone", "pesa persone", "pesaneonati", "pesa neonati"], id: "bilancia" },
{ keys: ["concentratore di ossigeno", "concentratore ossigeno", "concentratore o2", "oxygen concentrator"], id: "concentratore_ossigeno" },
{ keys: ["elettroencefalografo", "encefalografo", "elettroencefalografia", "eeg"], id: "eeg" },
{ keys: ["pulsossimetro", "pulsossimetria", "saturimetro", "spo2", "ossimetro", "pulse ox"], id: "pulsossimetro" },
{ keys: ["defibrillatore manuale", "defib manual", "cardioversore"], id: "defibrillatore" },
{ keys: ["dae", "aed", "defibrillatore automatico", "defibrillatore semiautomatico"], id: "dae" },
{ keys: ["aspiratore chirurgico", "aspiratore mucosità", "aspiratore secreti", "aspiratore"], id: "aspiratore_chirurgico" },
{ keys: ["elettrobisturi", "bisturi elettrico", "hf chirurgico", "chirurgia hf"], id: "elettrobisturi" },
{ keys: ["monitor multipar", "monitor paziente", "multiparametrico", "bedside monitor"], id: "monitor_multipar" },
{ keys: ["ventilatore", "respiratore", "polmonare"], id: "ventilatore" },
{ keys: ["pompa infus", "siringa infus", "infusore", "syringe pump"], id: "pompa_infusionale" },
{ keys: ["infusomat space", "infusomat"], id: "bbraun_infusomat_space_tsc" },
{ keys: ["ecografo", "ecografia", "ultrasound"], id: "ecografo" },
{ keys: ["letto elettr", "barella motor"], id: "letto_elettrico" },
];
export function cndToTemplate(cnd) { if (!cnd) return ""; var best = "", bl = 0; for (var i = 0; i < CND_TO_TPL.length; i++) { var p = CND_TO_TPL[i][0]; if (String(cnd).indexOf(p) === 0 && p.length > bl) { best = CND_TO_TPL[i][1]; bl = p.length; } } return best; }
export function guessTemplate(assetName) {
if (!assetName)
return "generico";
const n = assetName.toLowerCase();
for (const { keys, id } of FUNC_TEMPLATE_MAP) {
if (keys.some(k => n.includes(k)))
return id;
}
return "generico";
}
