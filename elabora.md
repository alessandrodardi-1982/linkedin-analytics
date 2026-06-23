# Istruzioni elaborazione settimanale LinkedIn

Esegui questi passi in ordine. Conferma ogni passo completato prima di procedere al successivo.

---

## PASSO 1 — Verifica file in input

Controlla se esiste almeno un file `.xlsx` nella cartella `input\`.
- Se non ci sono file: avvisa l'utente e fermati.
- Se ci sono più file: elenca quali sono e chiedi quale elaborare (o elaborali tutti in sequenza).

---

## PASSO 2 — Leggi il piano editoriale

Leggi il file `linkedin_post_schedule.md` nella cartella principale del progetto.
Estrai e memorizza:
- Logica editoriale: tipo post (A/B), giorno, orario target, obiettivo
- Calendario: tutti i post con data, tipo, contenuto, stato (pubblicato / programmato)
- Performance dichiarate nel file: impressioni, reazioni, click
- Regole di pubblicazione: orari, hashtag, regola link nel commento

Questo piano verrà incrociato con i dati reali nel Passo 4h.

---

## PASSO 3 — Leggi il file XLSX

Leggi tutti i fogli del file XLSX trovato in `input\`:
- `SCOPERTA` → impressioni totali, utenti raggiunti, periodo date
- `INTERESSE` → serie giornaliera (data, impressioni, interazioni)
- `POST PRINCIPALI` → lista post (URL, data pubblicazione, interazioni, impressioni)
- `FOLLOWER` → follower totali alla data, serie giornaliera nuovi follower
- `DATI DEMOGRAFICI` → tutti i record per categoria (Azienda, Località, Dimensioni, Anzianità, Qualifica, Settore)

Estrai e memorizza tutti questi dati come strutture dati.

---

## PASSO 4 — Aggiorna lo storico

Leggi il file `storico\storico.json` (se non esiste, crealo come array vuoto `[]`).

Costruisci una nuova entry con:
```json
{
  "data_elaborazione": "YYYY-MM-DD",
  "periodo_start": "YYYY-MM-DD",
  "periodo_end": "YYYY-MM-DD",
  "impressioni_totali": 0,
  "utenti_raggiunti": 0,
  "follower_totali": 0,
  "nuovi_follower_periodo": 0,
  "tasso_engagement": 0.0,
  "post": [
    {
      "url": "",
      "data": "YYYY-MM-DD",
      "titolo_breve": "",
      "interazioni": 0,
      "impressioni": 0
    }
  ],
  "demografici": {
    "localita": [],
    "settori": [],
    "anzianita": [],
    "dimensioni_azienda": []
  }
}
```

**Gestione sovrapposizioni — regola fondamentale:**
Lo storico lavora a livello di singola data (giorno), non di periodo intero.

Per ogni data presente nel nuovo XLSX:
- Se la data esiste già nello storico → sovrascrivila con i nuovi valori (i dati LinkedIn crescono nel tempo, i più recenti sono sempre più accurati)
- Se la data è nuova → aggiungila

Non chiedere conferma per le sovrascritture: è il comportamento atteso ad ogni elaborazione settimanale.

Salva il risultato aggiornato in `storico\storico.json`.

---

## PASSO 5 — Genera la dashboard HTML

Crea il file `output\dashboard.html` completo, con tutto inline (CSS + JS).

La dashboard deve contenere queste sezioni nell'ordine:

### 4a. Header
- Titolo: "LinkedIn Analytics — Alessandro Dardi"
- Sottotitolo con periodo analizzato e data ultimo aggiornamento

### 4b. KPI cards (riga in alto)
- Impressioni totali del periodo
- Utenti raggiunti
- Follower totali (alla data)
- Post attivi con interazioni
- Tasso di engagement (interazioni / impressioni × 100, arrotondato a 2 decimali)

### 4c. Grafico — Andamento giornaliero
- Grafico combinato: barre per impressioni + linea per interazioni
- Asse X: date (solo quelle con dati > 0, o tutte se il range è corto)
- Usa Chart.js

### 4d. Post principali
- Lista ordinata per impressioni decrescenti
- Per ogni post: data, numero progressivo (Post A, B, C...), barra proporzionale, impressioni e interazioni
- Mostra al massimo i top 5

### 4e. Follower
- Grafico a barre: nuovi follower giornalieri (dal primo giorno con dati > 0)
- Totale follower evidenziato

### 4f. Dati demografici
- Due colonne: Settori principali (barre orizzontali) | Località (barre orizzontali)
- Grafico a ciambella per Anzianità follower

### 4g. Storico — Evoluzione nel tempo con filtri

La dashboard mostra tutto lo storico accumulato. In cima alla pagina, prima di qualsiasi sezione, inserire una barra filtri sempre visibile con:

- **Periodo**: 7 giorni | 14 giorni | 28 giorni | 90 giorni | 365 giorni | Tutto lo storico
- **Tipo post**: Tutti | Solo Post A | Solo Post B

I range del filtro Periodo corrispondono esattamente a quelli dell'interfaccia LinkedIn, così puoi confrontare direttamente i dati della piattaforma con la tua dashboard senza conversioni.

I filtri agiscono dinamicamente su tutte le sezioni: grafico giornaliero, lista post, grafico follower, KPI cards (ricalcolate sul periodo filtrato).

Il grafico storico mostra la curva completa di impressioni e follower nel tempo, con marcatori verticali in corrispondenza delle date di pubblicazione dei post.

### 5h. Analisi strategica — Dati reali vs Piano editoriale

Questa è la sezione più importante. Incrociare i dati XLSX con `linkedin_post_schedule.md` e produrre un'analisi concreta su questi punti:

**1. Performance per tipo di post (A vs B)**
- Confronta impressioni e interazioni medie dei Post A (articolo/dato esterno) vs Post B (progetto/esperienza)
- Quale tipo performa meglio sui tuoi dati reali?

**2. Rispetto degli orari e impatto**
- Il post dell'8/6 è uscito di domenica alle 22:01 (fuori regola). Che impatto ha avuto rispetto ai post pubblicati nel giorno/orario corretto?
- Valuta se i dati confermano che martedì/giovedì 08:00–09:30 è l'orario ottimale

**3. Contenuto che funziona**
- Quale topic/angolazione ha generato più impressioni? (ops+digital, strumenti, ML, dati di mercato)
- Esiste correlazione tra tipo di contenuto e acquisizione follower?

**4. Gap tra piano e realtà**
- Ci sono post programmati ma non pubblicati nel periodo analizzato?
- Ci sono scostamenti tra le performance dichiarate nel piano e quelle reali nell'XLSX?

**5. Azioni consigliate**
- Massimo 5 azioni specifiche e concrete, basate solo su quello che emerge dai dati
- Esempio corretto: "Il post dell'8/6 (domenica 22:01) ha comunque generato 1.152 impressioni — valuta se il contenuto biografico funziona indipendentemente dall'orario"
- Esempio sbagliato: "Pubblica contenuti di qualità" (generico, inutile)

Stile: diretto, critico se necessario, senza edulcorare i dati negativi.

---

## PASSO 6 — Sposta il file elaborato

Rinomina e sposta il file da `input\` a `elaborati\` con prefisso data:
- Formato: `YYYY-MM-DD_nomefile-originale.xlsx`
- Esempio: `2026-06-23_AnalisiAggregate_Alessandro_Dardi.xlsx`

---

## PASSO 7 — Report finale

Stampa un riepilogo a schermo:
- ✅ File elaborato: [nome file]
- ✅ Storico aggiornato: [N] periodi totali
- ✅ Dashboard generata: output\dashboard.html
- 📊 Periodo: [start] → [end]
- 👁 Impressioni: [N] | 👤 Utenti raggiunti: [N] | 👥 Follower: [N]

---

## PASSO 8 — Pubblica su GitHub Pages

Esegui questi comandi in sequenza dalla cartella del progetto:

```
git add output/dashboard.html
git commit -m "Dashboard aggiornata — [data elaborazione]"
git push
```

Dove [data elaborazione] è la data odierna in formato YYYY-MM-DD.

Dopo il push comunica:
- ✅ Dashboard pubblicata online
- 🔗 https://alessandrodardi-1982.github.io/linkedin-analytics/

Se il push fallisce per errori di autenticazione o connessione: avvisa l'utente e suggerisci di eseguire manualmente i tre comandi da CMD.
