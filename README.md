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


---

## Deployment auf Railway

1. Repository zu Railway verbinden ("Deploy from GitHub").
2. Unter **Variables** mindestens diese Werte setzen:
   - `GEMINI_API_KEY` (Pflicht)
   - `GITHUB_TOKEN` (empfohlen, um GitHub-Rate-Limits zu vermeiden)
3. Railway nutzt automatisch `railway.json` im Repo.
4. Nach dem Deploy ist der Healthcheck unter `/api/health` erreichbar.

### Warum dieses Setup production-ready ist
- Start via `npm run start` (`next start`) — kanonischer, voll unterstützter Railway-Startbefehl.
- `railway.json` definiert Startkommando + Healthcheck explizit.
- Mit `GITHUB_TOKEN` sind GitHub-API-Limits deutlich seltener ein Problem.

## Improvement mit bestem Aufwand/Impact-Verhältnis

**Empfehlung:** Optionalen `GITHUB_TOKEN` im Backend nutzen (bereits umgesetzt).

**Warum hoher Impact bei wenig Aufwand:**
- Aufwand: nur wenige Zeilen Header-Logik.
- Impact: deutlich weniger `403`/Rate-Limit-Fehler bei steigender Nutzung.
- Kein Breaking Change: lokal funktioniert es weiter auch ohne Token.

---

## Troubleshooting: `git pull`/`git push` Konflikt (non-fast-forward)

Wenn du eine Ausgabe wie im Screenshot siehst (`Merge-Konflikt`, `Konnte ... nicht anwenden`, danach `push rejected (non-fast-forward)`), dann war ein Rebase/Merge lokal nicht sauber abgeschlossen **und** der Remote-Branch war weiter als dein lokaler Stand.

### Schneller Fix (sicherer Ablauf)

1. Abgebrochenen Rebase aufräumen:
```bash
git rebase --abort
```

2. Sicherstellen, dass du auf `main` bist:
```bash
git checkout main
```

3. Neuesten Stand holen:
```bash
git fetch origin
```

4. Remote-Stand strikt übernehmen (nur wenn `main` keine lokalen Commits behalten muss):
```bash
git reset --hard origin/main
```

5. Danach normal weiterarbeiten:
```bash
git checkout -b <neuer-branch>
# Änderungen machen
git add .
git commit -m "..."
git push -u origin <neuer-branch>
```

### Falls du **lokale Commits behalten** willst

Statt `reset --hard`:
```bash
git pull --rebase origin main
# Konflikte lösen
git add <dateien>
git rebase --continue
```

Bei erneutem Konflikt in `next.config.ts` oder `src/app/layout.tsx`:
- Konfliktmarker (`<<<<<<<`, `=======`, `>>>>>>>`) entfernen,
- gewünschte Kombination beider Änderungen übernehmen,
- Datei speichern und mit `git add` markieren,
- mit `git rebase --continue` fortsetzen.
