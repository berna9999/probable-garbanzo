# Restaurant Template · Next.js + Tailwind

Template one-page per ristoranti, interamente guidato dai dati: **ogni testo, immagine, colore e link
vive in `src/config/restaurant.json`**. Per un nuovo cliente si duplica il progetto, si modifica il JSON
e si fa il deploy.

## Avvio

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build di produzione
npm run typecheck  # verifica TypeScript
```

Richiede Node.js 18.18 o superiore (consigliato 20+).

## Struttura

```
src/
├─ config/
│  ├─ restaurant.json   ← TUTTI i contenuti del sito
│  └─ themes.ts         ← preset di colori (elegante, osteria, notte)
├─ types/restaurant.ts  ← schema tipizzato del JSON
├─ lib/
│  ├─ config.ts         ← accesso tipizzato al JSON
│  ├─ theme.ts          ← JSON → variabili CSS (colori, font, raggio)
│  ├─ fonts.ts          ← font disponibili (next/font, self-hosted)
│  ├─ sections.ts       ← visibilità sezioni e voci della navbar
│  ├─ booking.ts        ← provider di prenotazione → link
│  ├─ seo.ts            ← metadata, OpenGraph, JSON-LD schema.org/Restaurant
│  └─ format.ts         ← prezzi, date, segnaposto {{...}}
├─ components/
│  ├─ Navbar · Hero · About · MenuSection · Experiences · Reviews · Contact · Footer
│  ├─ MenuTabs · BookingForm · HeroSlides · LegalPage
│  └─ ui/ (CoverImage, Reveal, SectionHeading, ButtonLink, Stars, HoursList, Icon)
└─ app/
   ├─ layout.tsx        ← metadata SEO, tema, navbar, footer, JSON-LD
   ├─ page.tsx          ← home: rende le sezioni nell'ordine di layout.order
   ├─ privacy/ · cookie-policy/ · not-found.tsx
   └─ sitemap.ts · robots.ts
```

## Personalizzare un sito

| Cosa                     | Dove nel JSON                                   |
|--------------------------|-------------------------------------------------|
| Nome, payoff, logo       | `general`                                       |
| SEO e anteprime social   | `meta` (imposta sempre `siteUrl` col dominio reale) |
| Look & feel              | `theme.preset`, `theme.colors`, `theme.fonts`, `theme.radius` |
| Ordine delle sezioni     | `layout.order`                                  |
| Contatti e mappa         | `contact`                                       |
| Orari                    | `hours.days`                                    |
| Prenotazioni             | `booking`                                       |
| Testi dell'interfaccia   | `labels` (utile anche per siti in altre lingue) |
| Privacy e cookie policy  | `legal` (i segnaposto `{{companyName}}`, `{{email}}`, ecc. vengono compilati in automatico) |

### Tema

- `theme.preset`: `"elegante"` (costiero, sabbia e verde mare), `"osteria"` (terracotta e carta),
  `"notte"` (fine dining scuro).
- `theme.colors`: override puntuali in esadecimale, es. `{ "primary": "#7A1F2B" }`.
- `theme.fonts.heading`: `cormorant` | `playfair` | `fraunces`; `theme.fonts.body`: `inter` | `lato`.

I colori diventano variabili CSS su `<html>` e Tailwind le legge (`bg-primary`, `text-accent/80`, …),
quindi tutto il sito cambia aspetto senza toccare i componenti. Per aggiungere un preset basta una voce
in `src/config/themes.ts`; per un nuovo font, una riga in `src/lib/fonts.ts`.

### Sezioni opzionali

Ogni sezione ha `enabled`. Se è `false`, **o se è vuota** (es. `experiences.items: []`), non viene
renderizzata e sparisce anche dalla navbar e dal footer.

### Prenotazioni (`booking.provider`)

| Valore         | Comportamento                                                        |
|----------------|----------------------------------------------------------------------|
| `covermanager` / `thefork` / `custom` | apre `booking.url` in una nuova scheda          |
| `whatsapp`     | apre la chat con `contact.whatsapp` e `booking.whatsappMessage`      |
| `phone`        | link `tel:`                                                          |
| `email`        | link `mailto:`                                                       |
| `form`         | modulo nella sezione Contatti che invia la richiesta via WhatsApp o email (`formChannel`) |

Tutti i pulsanti con `"action": "booking"` (hero, esperienze) usano automaticamente il provider scelto.

### Menu

- `price`: un numero viene formattato nella valuta di `menu.currency`; una stringa è mostrata così com'è
  (es. `"Calice € 8 · Bottiglia € 34"`).
- `allergens`: numeri della legenda UE in `menu.allergens`.
- `tags`: chiavi definite in `menu.tags` (specialità, vegano, senza glutine…), personalizzabili.

### Immagini

Gli URL possono puntare a qualsiasi CDN HTTPS o a file in `public/` (es. `/images/sala.jpg`).
Se un'immagine manca o non si carica compare un placeholder nei colori del tema. In produzione conviene
limitare `images.remotePatterns` in `next.config.mjs` agli host realmente usati.

## Deploy su Vercel

Il progetto usa Next.js App Router: Vercel lo rileva automaticamente. Non servono un file `vercel.json`, un comando di build personalizzato o variabili d'ambiente.

### Prima di pubblicare

Il file `src/config/restaurant.json` contiene i dati dimostrativi di Salicornia. Prima di una pubblicazione pubblica, sostituisci almeno:

- nome, testi, foto e menu;
- telefono, email, WhatsApp, indirizzo, orari e link social;
- recensioni e dati societari (inclusa la partita IVA);
- `meta.siteUrl` con l'URL effettivo del sito;
- testi di privacy e cookie policy, da verificare per il ristorante reale.

Il modulo di prenotazione attuale prepara una richiesta e apre WhatsApp o il programma email del visitatore; non salva le richieste su un database. Verifica anche che `booking.formChannel` e i recapiti siano corretti.

### Opzione A — Pubblicare collegando GitHub (consigliata)

1. Crea un repository vuoto su GitHub. Non aggiungere README, licenza o `.gitignore` se hai già questi file nella cartella.
2. Apri PowerShell nella cartella del progetto ed esegui, sostituendo l'indirizzo con quello del tuo repository:

   ```powershell
   git init -b main
   git add .
   git commit -m "Primo deploy del sito"
   git remote add origin https://github.com/UTENTE/NOME-REPOSITORY.git
   git push -u origin main
   ```

   Se Git chiede di configurare il nome e l'email, imposta quelli che usi per i commit GitHub con `git config --global user.name "Il tuo nome"` e `git config --global user.email "la-tua-email"`.
3. Accedi a [vercel.com](https://vercel.com), scegli **Add New → Project** e importa il repository GitHub. Se richiesto, autorizza Vercel ad accedere al repository.
4. Lascia le impostazioni rilevate automaticamente: framework **Next.js**, cartella radice `./`, build e output predefiniti. Non aggiungere variabili d'ambiente per questa versione.
5. Premi **Deploy**. Al termine Vercel mostra l'indirizzo del sito.
6. Copia l'indirizzo assegnato da Vercel in `meta.siteUrl` in `src/config/restaurant.json`, salva e invia le modifiche a GitHub. Vercel creerà automaticamente una nuova versione del sito.
7. Per usare un dominio personalizzato, apri il progetto Vercel, vai in **Settings → Domains**, aggiungi il dominio e segui le istruzioni DNS mostrate. Poi aggiorna `meta.siteUrl` con il dominio `https://` definitivo e invia di nuovo la modifica.

Dopo il collegamento, ogni push sul ramo di produzione pubblica un nuovo deploy; i push sugli altri rami generano anteprime.

### Opzione B — Pubblicare senza GitHub, dal terminale

1. Installa Node.js e npm sul computer, poi apri un terminale nella cartella del progetto.
2. Installa le dipendenze e verifica che il sito compili:

   ```bash
   npm ci
   npm run typecheck
   npm run build
   ```
3. Installa e avvia la CLI di Vercel:

   ```bash
   npm install --global vercel
   vercel login
   vercel
   ```

   Segui le domande per collegare o creare il progetto Vercel; lascia le impostazioni Next.js predefinite.
4. Quando l'anteprima è corretta, pubblica in produzione con:

   ```bash
   vercel --prod
   ```

   Puoi ripetere `vercel --prod` dopo ogni modifica. Per deploy automatici a ogni push, collega invece il repository Git a Vercel seguendo l'opzione A.

## Note legali

Il sito usa solo cookie tecnici, ma la mappa Google Maps incorporata può impostare cookie di terze
parti: se il cliente lo richiede, disattiva la mappa (`contactSection.showMap: false`) oppure aggiungi
un banner di consenso prima di caricarla. I testi legali di esempio vanno verificati dal consulente del
cliente.
