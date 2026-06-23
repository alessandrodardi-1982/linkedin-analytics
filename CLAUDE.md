# Progetto: Analisi LinkedIn — Alessandro Dardi

## Lingua e tono
- Rispondi sempre in italiano
- Tono professionale e diretto
- Nei commenti del codice usa l'italiano

## Struttura cartelle
- Input file: `input\` (XLSX esportati da LinkedIn)
- File elaborati: `elaborati\` (spostati dopo il processing)
- Storico dati: `storico\` (file JSON cumulativi)
- Output: `output\dashboard.html`

## Regole sui file
- Non sovrascrivere mai file in `elaborati\` senza conferma
- Lo storico JSON si accumula — non cancellare dati precedenti
- La dashboard HTML si rigenera completamente ad ogni run
- Dopo l'elaborazione sposta il file da `input\` a `elaborati\` rinominandolo con prefisso data: `YYYY-MM-DD_nomefile.xlsx`

## Formato dati LinkedIn
Gli XLSX esportati da LinkedIn hanno questi fogli:
- `SCOPERTA`: impressioni totali e utenti raggiunti nel periodo
- `INTERESSE`: serie giornaliera di impressioni e interazioni
- `POST PRINCIPALI`: lista post con URL, data, interazioni, impressioni
- `FOLLOWER`: follower totali + nuovi follower giornalieri
- `DATI DEMOGRAFICI`: aziende, località, dimensioni azienda, anzianità, qualifica, settore

## Storico
- Salva i dati aggregati di ogni elaborazione in `storico\storico.json`
- Ogni entry ha: data_elaborazione, periodo_start, periodo_end, impressioni_totali, utenti_raggiunti, follower_totali, nuovi_follower_periodo, post (lista), demografici
- Non duplicare periodi già presenti nello storico

## Piano editoriale
- Il file `linkedin_post_schedule.md` nella cartella del progetto contiene il piano editoriale aggiornato
- Leggilo sempre durante l'elaborazione — è parte integrante dell'analisi
- Contiene: logica editoriale (Post A / Post B), calendario completo, performance pubblicati, regole di pubblicazione
- Usalo per incrociare i dati reali (XLSX) con la strategia pianificata e identificare scostamenti

## Output dashboard
- File: `output\dashboard.html`
- HTML singolo file, auto-contenuto (CSS e JS inline)
- Sfondo scuro (#1a1a2e o simile), stile professionale
- Grafici con Chart.js (CDN)
- Sezioni: KPI summary, andamento giornaliero, post principali, follower, demografici, storico, analisi e suggerimenti
- La sezione "Analisi e suggerimenti" deve essere generata da Claude con osservazioni reali sui dati
