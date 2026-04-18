# What's in it?

**Verstehe jedes GitHub-Projekt in Sekunden.**  
Füge einfach einen GitHub-Link ein und erhalte sofort eine klare Einordnung:  
- Was das Projekt wirklich bringt
- Für wen es sinnvoll ist
- Wie du direkt startest

Ohne lange Doku-Suche, ohne Rätselraten.

---

## Warum dieses Tool?

Open Source ist stark – aber oft unübersichtlich.  
**What's in it?** macht aus komplexen Repositories eine schnelle, verständliche Entscheidungshilfe.

Ideal, wenn du:
- ein neues Tool bewerten willst,
- Zeit sparen möchtest,
- schneller vom "klingt interessant" zu "nutze ich" kommen willst.

---

## Installation (lokal)

Du brauchst nur Node.js (ab Version 20.9.0) und einen API-Key für Gemini.

1. Projekt herunterladen
```bash
git clone <REPO_URL>
cd <repo-ordner>
```

2. Abhängigkeiten installieren
```bash
npm install
```

3. Umgebungsdatei anlegen
```bash
touch .env.local
```

4. In `.env.local` eintragen
```env
GEMINI_API_KEY=dein_api_key
```

5. App starten
```bash
npm run dev
```

Danach im Browser öffnen: `http://localhost:3000`

---

## Architektur & Workflows (Visualisierung)

```mermaid
flowchart LR
  A[Startseite\nGitHub-URL eingeben] --> B[Server Action\nURL wird geparst]
  B --> C[/analyse/[owner]/[repo]]

  C --> D[Analyse-Seite lädt]
  D --> E[GitHub-Metadaten abrufen]
  D --> F[README abrufen]
  D --> G[Cache prüfen 24h]

  G -->|Treffer| H[Analyse aus Cache]
  G -->|Kein Treffer| I[LLM-Aufruf mit Repo-Daten]
  E --> I
  F --> I

  I --> J[JSON validieren & parsen]
  J --> K[Analyse im Cache speichern]
  K --> L[Ergebnis-UI mit Nutzen, Kategorie, Install, Prompts]
  H --> L

  M[POST /api/analyze] --> G
```

### Kurz erklärt
- Die URL-Eingabe leitet direkt zur Analyse-Seite weiter.
- Dort werden GitHub-Daten und Analyse parallel vorbereitet.
- Ein 24h-Cache vermeidet doppelte KI-Kosten und macht Folgeaufrufe schneller.
- Ergebnisse erscheinen als klare Handlungsempfehlung statt roher Repository-Daten.

---

## Produktversprechen

**What's in it?** hilft dir, Open Source nicht nur zu *finden*, sondern schnell zu *verstehen* und sicher einzusetzen.  
Weniger Suchzeit. Mehr Umsetzungszeit.
