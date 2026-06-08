// PHASE-1 (Master Plan) — Content Authority pages as structured, testable data
// (DATA-005 style). Human-authored, accurate German content (no AI-slop, OUT/RISK
// per PRD). Rendered server-side as static HTML for SEO/GEO (SCOPE-001, NFR-007).

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface AuthorityFaq {
  question: string;
  answer: string;
}

export interface AuthorityPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: ContentSection[];
  faq: AuthorityFaq[];
  related: { label: string; href: string }[];
}

export const WHATS_IN_IT_PAGE: AuthorityPage = {
  slug: "what-is-whats-in-it",
  title: "Was ist „What's in it?“ — GitHub-Repositories und Git verständlich",
  description:
    "What's in it? erklärt GitHub-Repositories in Sekunden: Kategorie, Nutzen, Installation, Risiken und fertige KI-Prompts — kostenlos, ohne Account, auf Deutsch.",
  intro:
    "„What's in it?“ ist ein kostenloser, deutschsprachiger Dienst, der dir hilft, GitHub-Repositories schnell zu verstehen und Git sowie GitHub von Grund auf zu lernen. Statt dich durch lange README-Dateien, Issues und Konfigurationsdateien zu arbeiten, bekommst du in Sekunden eine strukturierte Einschätzung: Was macht das Projekt, wofür ist es gut, wie installierst du es, worauf solltest du achten — und welche Befehle du direkt in deine KI-Tools wie Claude oder Cursor kopieren kannst. Dieser Artikel erklärt, was der Dienst genau tut, wie er technisch funktioniert, für wen er gedacht ist und wo seine bewussten Grenzen liegen. Er richtet sich ausdrücklich auch an Menschen, die noch nie aktiv mit GitHub gearbeitet haben und einen verständlichen, vertrauenswürdigen Einstieg ohne Vorwissen suchen.",
  sections: [
    {
      heading: "Das Problem, das wir lösen",
      paragraphs: [
        "Die meisten öffentlichen GitHub-Repositories sind für Einsteiger schwer einzuschätzen. Man sieht eine README, viele Dateien, vielleicht ein paar Tausend Sterne — aber die entscheidenden Fragen bleiben offen: Was genau macht dieses Projekt? Ist es aktiv und vertrauenswürdig? Wie installiere ich es? Welche Befehle brauche ich? Und ist es überhaupt das richtige Werkzeug für mein Vorhaben?",
        "Erfahrene Entwickler beantworten diese Fragen routiniert, indem sie README, Commit-Historie, offene Issues, Lizenz und Projektstruktur überfliegen. Für Selbstlernende, Gründer, Studierende oder nicht-technische Entscheider kostet genau das viel Zeit und Unsicherheit. „What's in it?“ nimmt dir diese erste, mühsame Bewertung ab und übersetzt sie in klare, deutschsprachige Sprache.",
        "Gleichzeitig fehlt vielen Menschen eine verständliche, praxisnahe Erklärung von Git und GitHub selbst. Genau dafür gibt es zusätzlich einen strukturierten Wissens-Hub mit Befehlen, Workflows und Shortcuts zum direkten Kopieren.",
      ],
    },
    {
      heading: "Wie die Repository-Analyse funktioniert",
      paragraphs: [
        "Wenn du eine GitHub-URL oder eine Eingabe der Form owner/repo eingibst, normalisiert das System die Eingabe zunächst zu einem eindeutigen, kleingeschriebenen Schlüssel. Anschließend prüft es einen persistenten Cache: Wurde dieses Repository schon einmal analysiert, bekommst du die gespeicherte Analyse sofort — ohne dass erneut ein KI-Modell aufgerufen wird.",
        "Nur wenn noch keine Analyse existiert (ein sogenannter Cache-Miss), läuft die eigentliche Erstellung an. Davor stehen mehrere Schutzmechanismen: eine Begrenzung der Anfragen pro Nutzer, ein einfacher Bot-Schutz und eine Sperre pro Repository, die sicherstellt, dass selbst bei vielen gleichzeitigen Anfragen für dasselbe Projekt höchstens ein einziger KI-Aufruf entsteht. Das hält die Kosten niedrig und den Dienst kostenlos.",
        "Für die Analyse selbst liest das System öffentliche GitHub-Metadaten und einen Auszug der README. Diese Informationen gehen serverseitig an ein KI-Modell (Google Gemini, angebunden über das OpenRouter-Gateway). Das Modell liefert ausschließlich strukturiertes JSON zurück, das streng validiert wird. Harte Fakten wie Sterne, Forks, Lizenz und der Klon-Befehl stammen direkt aus den GitHub-Daten und werden nie dem Modell überlassen — so vermeiden wir erfundene Zahlen.",
      ],
    },
    {
      heading: "Was du in einer Analyse bekommst",
      paragraphs: [
        "Jede Analyse ist in klar getrennte, getippte Abschnitte gegliedert, die als normale Textbausteine dargestellt werden — niemals als rohes HTML aus dem Modell. Das ist eine bewusste Sicherheitsentscheidung gegen Cross-Site-Scripting.",
      ],
      list: [
        "Eine Einordnung in eine Kategorie (z. B. Framework, CLI, Library, Agent) und den Kern-Nutzen in einem Satz.",
        "Eine einsteigerfreundliche Zusammenfassung und eine kompakte technische Einordnung.",
        "Einen Qualitäts-Score über Aktivität, Dokumentation, Installations-Klarheit, Community, Sicherheit und Wartung.",
        "Ehrliche Hinweise (Concerns) mit Stufen low/medium/high und konkreten Prüf-Tipps.",
        "Installationsbefehle für npm, pnpm, yarn, pip, Docker oder manuell — plus den korrekten Klon-Befehl.",
        "Drei fertige deutsche KI-Prompts, die du direkt in Claude oder Cursor einfügen kannst.",
        "Eine kurze FAQ zum Projekt.",
      ],
    },
    {
      heading: "Der Git- und GitHub-Wissens-Hub",
      paragraphs: [
        "Neben der Analyse bietet „What's in it?“ einen strukturierten Wissens-Hub unter /github. Statt einer chaotischen Stichwort-Wolke sind die Themen nach Kategorien geordnet: Grundlagen, tägliche Befehle, Branches und Merging, Remote und Synchronisieren, Fehler beheben, Repository-Verwaltung, Sicherheit, GitHub CLI, Automatisierung mit Actions und Veröffentlichen.",
        "Jeder Eintrag erklärt ein Konzept zuerst einfach (ab etwa 16 Jahren verständlich), dann im Detail, nennt typische Einsatzfälle, Risiken und häufige Fehler — und enthält Befehle zum direkten Kopieren. Gefährliche Befehle wie git reset --hard oder git rebase bekommen ein deutliches Risiko-Etikett. Praktische „Ich will …“-Workflows führen dich Schritt für Schritt durch typische Aufgaben wie ein Projekt hochladen, committen, pushen und pullen oder einen Merge-Konflikt lösen.",
      ],
    },
    {
      heading: "Repository-Entdeckung ohne KI-Kosten",
      paragraphs: [
        "Auf der Startseite findest du drei Entdeckungs-Bereiche: Daily Top 3, Weekly Top 10 und Interesting Growth Repositories (Niche Finds, Top 5). Diese Listen entstehen ausschließlich aus GitHub-Metadaten und einer deterministischen Bewertung — es wird dafür kein KI-Modell aufgerufen.",
        "Wichtig ist uns Ehrlichkeit: Die Niche Finds bevorzugen bewusst hochwertige, funktionale Projekte im Wachstumsbereich und schließen sehr große Stern-Giganten (über 50.000 Sterne) bewusst aus. Solange für eine Liste noch keine echten Daten vorliegen, zeigen wir entweder eine klar als Beispiel markierte Auswahl oder einen ehrlichen Hinweis — niemals erfundene Ranglisten, die wie echte Daten aussehen.",
      ],
    },
    {
      heading: "Kostenlos, ohne Account, datensparsam",
      paragraphs: [
        "„What's in it?“ ist bewusst frei zugänglich: keine Accounts, keine Abos, keine Paywall. Finanziert wird der Dienst über dezente, klar gekennzeichnete Werbung, die niemals neben Kopier- oder Aktions-Buttons platziert wird.",
        "Wir analysieren ausschließlich öffentliche Daten und speichern keine Nutzerprofile. Für den Schutz vor Missbrauch und zur Kostenkontrolle speichern wir technische Ereignisse nur als nicht umkehrbare Hash-Werte — die rohe IP-Adresse wird niemals gespeichert.",
      ],
    },
    {
      heading: "Warum Cache-first mehr ist als Kostenkontrolle",
      paragraphs: [
        "Das Prinzip „erst den Cache prüfen, dann erst ein KI-Modell aufrufen“ ist die wichtigste Architekturentscheidung des Dienstes. Es hat drei Vorteile auf einmal: Es hält die Betriebskosten so niedrig, dass der Dienst dauerhaft kostenlos bleiben kann; es macht wiederholte Aufrufe blitzschnell, weil eine gespeicherte Analyse ohne Wartezeit ausgeliefert wird; und es schont Ressourcen, weil keine unnötige Rechenleistung für bereits beantwortete Fragen verbraucht wird.",
        "Damit dieses Prinzip auch unter Last hält, sorgt eine Sperre pro Repository dafür, dass nicht zwei gleichzeitige Anfragen für dasselbe Projekt zwei KI-Aufrufe auslösen. Selbst wenn zehn Personen im selben Moment dasselbe Repository analysieren, entsteht höchstens ein einziger kostenpflichtiger Aufruf — alle anderen erhalten anschließend das gespeicherte Ergebnis. Statische Inhalte wie der Wissens-Hub und die Entdeckungs-Listen rufen grundsätzlich nie ein KI-Modell auf.",
        "Diese klare Trennung zwischen teuren und kostenlosen Pfaden ist bewusst so gebaut und durch automatische Tests abgesichert, damit sich nicht versehentlich KI-Aufrufe in Bereiche einschleichen, die ohne sie auskommen müssen.",
      ],
    },
    {
      heading: "Vertrauen, Transparenz und ehrliche Grenzen",
      paragraphs: [
        "Vertrauen entsteht durch Transparenz. Deshalb trennen wir strikt zwischen Fakten und Einschätzung: Zahlen wie Sterne, Forks oder die Lizenz stammen direkt von GitHub und werden nie von der KI erfunden. Die qualitative Bewertung dagegen ist eine Einschätzung, die Fehler enthalten kann — und genau so kennzeichnen wir sie.",
        "Auch bei den Entdeckungs-Listen verzichten wir bewusst auf geschönte oder erfundene Ranglisten. Liegen noch keine echten Daten vor, sagen wir das offen, statt eine vermeintlich fertige Top-Liste vorzutäuschen. Werbung wird klar als solche gekennzeichnet und niemals direkt neben Kopier- oder Aktions-Schaltflächen platziert, damit keine versehentlichen Klicks entstehen.",
        "Diese Haltung ist nicht nur eine Frage des Anstands, sondern auch der Grundstein für nachhaltige Sichtbarkeit in Suchmaschinen und KI-Antwortsystemen: Inhalte, die ehrlich, strukturiert und nachvollziehbar sind, werden eher zitiert und empfohlen.",
      ],
    },
    {
      heading: "So nutzt du den Dienst am besten",
      paragraphs: [
        "Für eine Repository-Analyse gibst du oben einfach eine GitHub-URL oder die Kurzform owner/repo ein und bestätigst. Du landest auf einer Ergebnisseite, die du teilen und erneut aufrufen kannst — beim zweiten Aufruf kommt sie sofort aus dem Cache.",
        "Gibst du stattdessen einen normalen Begriff ein, etwa „git push“ oder „ssh“, erkennt das System, dass du kein Repository meinst, und leitet dich in die Wissenssuche. Dort findest du passende Befehle, Workflows und Erklärungen — auch über Synonyme, sodass du nicht den exakten Fachbegriff kennen musst.",
        "Wenn du ganz am Anfang stehst, lohnt sich der Einstieg über die Grundlagen-Artikel: Sie erklären Git und GitHub Schritt für Schritt und verlinken von dort auf die konkreten Befehle, die du im Alltag brauchst.",
      ],
    },
    {
      heading: "Was uns von einfachen GitHub-Tools unterscheidet",
      paragraphs: [
        "Es gibt viele Werkzeuge, die GitHub-Statistiken anzeigen oder Sterne über die Zeit visualisieren. „What's in it?“ verfolgt einen anderen Anspruch: Wir verbinden eine verständliche, deutschsprachige Erklärung mit konkretem Handlungswissen. Du erfährst nicht nur, dass ein Projekt populär ist, sondern was es für dich bedeutet, wie du es einsetzt und worauf du achten musst.",
        "Diese Kombination aus Analyse, strukturiertem Lernmaterial und ehrlicher Entdeckung ist bewusst auf Menschen zugeschnitten, die GitHub noch nicht in- und auswendig kennen. Wir erklären Fachbegriffe statt sie vorauszusetzen, kennzeichnen riskante Befehle und liefern fertige Prompts, mit denen du die Erkenntnisse sofort in deinen eigenen KI-Tools weiterverwenden kannst. So wird aus einer reinen Daten-Anzeige ein echtes Verständnis — und genau das spart dir im Alltag die meiste Zeit.",
      ],
    },
    {
      heading: "Für wen ist das gedacht — und wo sind die Grenzen?",
      paragraphs: [
        "Der Dienst richtet sich an deutschsprachige GitHub-Einsteiger ab etwa 16 Jahren, Selbstlernende, Gründer, Studierende und Entwickler, die ein unbekanntes Repository schnell einordnen wollen. Er ersetzt keine vollständige Sicherheits- oder Code-Prüfung.",
        "Die Analyse wird von einem KI-Modell erzeugt und kann Fehler enthalten. Sicherheitskritische Aussagen, Lizenzfragen oder Produktionsentscheidungen solltest du immer an der Quelle gegenprüfen. Private Repositories werden bewusst nicht unterstützt, um Auth- und Datenschutz-Komplexität zu vermeiden.",
      ],
    },
  ],
  faq: [
    { question: "Kostet die Nutzung etwas?", answer: "Nein. Der Dienst ist kostenlos, ohne Account und ohne Paywall und finanziert sich über dezente Werbung." },
    { question: "Werden meine Daten gespeichert?", answer: "Es gibt keine Nutzerprofile. Für Missbrauchsschutz speichern wir nur Hash-Werte, niemals deine rohe IP-Adresse." },
    { question: "Wie aktuell ist eine Analyse?", answer: "Analysen werden zwischengespeichert, damit dasselbe Repository nicht unnötig mehrfach erzeugt wird. Sie spiegeln den Stand der letzten Erstellung wider." },
    { question: "Kann ich private Repositories analysieren?", answer: "Nein, im aktuellen Stand nur öffentliche Repositories — bewusst, um Auth- und Datenschutzrisiken zu vermeiden." },
  ],
  related: [
    { label: "Was ist GitHub?", href: "/what-is-github" },
    { label: "Git & GitHub Wissen", href: "/github" },
    { label: "Shortcuts & Workflows", href: "/github/shortcuts" },
  ],
};

export const WHAT_IS_GITHUB_PAGE: AuthorityPage = {
  slug: "what-is-github",
  title: "Was ist GitHub? Einfach erklärt — Git, Repositories, Pull Requests & mehr",
  description:
    "GitHub verständlich erklärt: der Unterschied zu Git, Repositories, Commits, Branches, Pull Requests, Issues, Actions und Sicherheit — auf Deutsch, ab 16 Jahren.",
  intro:
    "GitHub ist die weltweit größte Plattform, um Software-Code zu speichern, gemeinsam daran zu arbeiten und ihn zu veröffentlichen. Wer programmieren lernt, Open-Source nutzt oder im Team entwickelt, kommt an GitHub kaum vorbei. Dieser Artikel erklärt verständlich, was GitHub ist, wie es sich von Git unterscheidet und welche Bausteine — Repositories, Commits, Branches, Pull Requests, Issues, Actions und Sicherheitsfunktionen — du kennen solltest, um produktiv zu werden.",
  sections: [
    {
      heading: "Git und GitHub sind nicht dasselbe",
      paragraphs: [
        "Git ist ein Werkzeug auf deinem Rechner, das jede Version deines Codes speichert — ein sogenanntes verteiltes Versionskontrollsystem. Es funktioniert auch komplett offline und gehört keinem einzelnen Unternehmen.",
        "GitHub dagegen ist eine Online-Plattform, die Git-Repositories hostet und um Funktionen für Zusammenarbeit erweitert: Pull Requests, Issues, Code-Review, Automatisierung und Veröffentlichung. Kurz gesagt: Git ist die Technik, GitHub ist der Ort, an dem dein Projekt online liegt und an dem andere mitarbeiten können. Es gibt Alternativen wie GitLab oder Bitbucket, die ähnlich funktionieren.",
      ],
    },
    {
      heading: "Das Repository: das Herzstück",
      paragraphs: [
        "Ein Repository (kurz „Repo“) ist ein Projektordner samt vollständiger Versionsgeschichte. Es enthält deinen Code, eine README zur Erklärung, optional eine Lizenz, Konfigurationsdateien und die komplette Historie aller Änderungen.",
        "Repositories können öffentlich (für alle sichtbar) oder privat (nur für berechtigte Personen) sein. Öffentliche Repositories sind die Grundlage von Open-Source: Jeder kann den Code ansehen, lernen, Fehler melden und Verbesserungen vorschlagen. Wichtig: Veröffentlichst du ein Repo, wird die gesamte Historie mit veröffentlicht — versehentlich committete Passwörter bleiben also sichtbar, selbst wenn du sie später löschst.",
      ],
    },
    {
      heading: "Commits und Branches",
      paragraphs: [
        "Ein Commit ist ein gespeicherter Stand deiner Arbeit mit einer kurzen Beschreibung. Commits sind unveränderlich und über Prüfsummen verkettet — so entsteht eine nachvollziehbare Historie, zu der du jederzeit zurückkehren kannst.",
        "Ein Branch (Zweig) ist eine parallele Arbeitslinie. Auf einem eigenen Feature-Branch kannst du etwas Neues ausprobieren, ohne den stabilen Hauptstand (meist „main“) zu gefährden. Ist das Feature fertig, wird der Branch per Merge oder Pull Request wieder in main integriert. So arbeiten auch große Teams gleichzeitig an einem Projekt, ohne sich gegenseitig zu blockieren.",
      ],
    },
    {
      heading: "Pull Requests: Änderungen vorschlagen und prüfen",
      paragraphs: [
        "Ein Pull Request (PR) ist die strukturierte Bitte: „Bitte übernehmt meine Änderungen.“ Er bündelt die Commits eines Branches und macht sie für andere sichtbar, kommentierbar und prüfbar.",
        "Pull Requests sind der Standard-Workflow der Zusammenarbeit auf GitHub. Reviewer können Zeile für Zeile Feedback geben, automatische Tests können laufen, und erst nach Freigabe wird gemergt. Auch zu fremden Open-Source-Projekten trägst du typischerweise über einen Fork und einen Pull Request bei.",
      ],
    },
    {
      heading: "Issues, Actions und Releases",
      paragraphs: [
        "Issues sind Tickets für Aufgaben, Fehlerberichte oder Ideen. Sie machen die Arbeit an einem Projekt transparent und durchsuchbar und lassen sich mit Labels, Meilensteinen und Pull Requests verknüpfen.",
        "GitHub Actions ist die eingebaute Automatisierung (CI/CD). In YAML-Dateien beschreibst du Abläufe, die bei bestimmten Ereignissen automatisch laufen — zum Beispiel Tests bei jedem Push oder ein Deployment beim Erstellen eines Release. Releases wiederum bündeln einen bestimmten Stand als versionierte, herunterladbare Veröffentlichung.",
      ],
    },
    {
      heading: "Sicherheit und Zusammenarbeit",
      paragraphs: [
        "GitHub bietet zahlreiche Sicherheitsfunktionen: Dependabot warnt vor verwundbaren Abhängigkeiten und schlägt Updates vor, Secret Scanning erkennt versehentlich veröffentlichte Zugangsdaten, und Branch-Protection-Regeln können erzwingen, dass nichts ungeprüft in main landet.",
        "Für die Authentifizierung nutzt du entweder SSH-Schlüssel oder Personal Access Tokens statt eines Passworts. Organisationen bündeln mehrere Repositories und Mitglieder mit fein einstellbaren Rechten — die Grundlage für Teams und Unternehmen.",
      ],
    },
    {
      heading: "Forks und Beiträge zu Open Source",
      paragraphs: [
        "Ein Fork ist eine eigene Kopie eines fremden Repositories unter deinem GitHub-Konto. Forks sind die Grundlage, um zu Projekten beizutragen, bei denen du keine direkten Schreibrechte hast: Du forkst das Original, klonst deinen Fork, arbeitest auf einem Branch und schlägst deine Änderungen per Pull Request an das Originalprojekt vor.",
        "Damit dein Fork nicht veraltet, fügst du das Originalprojekt als zweite Remote namens „upstream“ hinzu und holst regelmäßig dessen Änderungen. So bleibst du auf dem aktuellen Stand und vermeidest große, schwer auflösbare Konflikte beim Einreichen deines Beitrags. Open-Source lebt von genau diesem Kreislauf aus Forken, Verbessern und Zurückgeben.",
      ],
    },
    {
      heading: "Tags, Releases und Versionierung",
      paragraphs: [
        "Ein Tag markiert einen bestimmten Punkt in der Historie, typischerweise eine Version wie v1.2.0. Aus einem Tag erstellt GitHub ein Release: eine versionierte, herunterladbare Veröffentlichung mit Beschreibung, Änderungsprotokoll und optionalen Dateien.",
        "Viele Projekte folgen der semantischen Versionierung (Semantic Versioning) nach dem Schema MAJOR.MINOR.PATCH: Die MAJOR-Zahl steigt bei inkompatiblen Änderungen, MINOR bei neuen, abwärtskompatiblen Funktionen und PATCH bei Fehlerbehebungen. Wer Abhängigkeiten nutzt, kann an diesen Zahlen ablesen, wie riskant ein Update ist.",
      ],
    },
    {
      heading: "Markdown, README und Dokumentation",
      paragraphs: [
        "GitHub stellt Texte in Markdown dar, einer einfachen Auszeichnungssprache für Überschriften, Listen, Links, Bilder und Code-Blöcke. Die README im Projektwurzelverzeichnis ist die wichtigste Datei für den ersten Eindruck: Sie erklärt, was das Projekt tut, wie man es installiert und nutzt.",
        "Größere Projekte ergänzen ein Wiki, einen Ordner mit weiterführender Dokumentation oder eine eigene Doku-Website. Eine gute Dokumentation ist oft das entscheidende Qualitätsmerkmal — ein technisch starkes Projekt ohne verständliche README bleibt für viele Menschen unbenutzbar.",
      ],
    },
    {
      heading: "Browser, GitHub Desktop und die Kommandozeile",
      paragraphs: [
        "Du kannst GitHub auf drei Wegen nutzen. Im Browser liest und bearbeitest du Dateien, prüfst Pull Requests und verwaltest Issues — ideal zum Einstieg und für kleine Änderungen. GitHub Desktop ist eine grafische App, die Git-Aktionen wie Commit, Push und Pull mit Klicks statt Befehlen erledigt.",
        "Wer schneller und flexibler arbeiten will, nutzt die Kommandozeile: Git für die Versionskontrolle und zusätzlich die GitHub CLI (das Programm „gh“), mit der sich Repositories, Pull Requests und Issues direkt aus dem Terminal steuern lassen. Alle drei Wege greifen auf dieselben Daten zu — du kannst je nach Aufgabe wechseln.",
      ],
    },
    {
      heading: "Häufige Anfängerfehler",
      paragraphs: [
        "Einige Stolperfallen begegnen fast allen Einsteigern. Sehr verbreitet ist das versehentliche Veröffentlichen von Zugangsdaten: Eine einmal committete .env-Datei oder ein Schlüssel bleiben in der Historie, selbst wenn man sie später löscht — deshalb gehört eine .gitignore zu den ersten Schritten in jedem Projekt.",
        "Ebenso häufig ist das direkte Arbeiten auf dem main-Branch statt auf Feature-Branches, das Pushen ohne vorheriges Pullen (was zu abgelehnten Pushes führt) und das Verwenden von git reset --hard, das ungespeicherte Arbeit unwiderruflich löscht. Wer diese Muster kennt, vermeidet die meisten frustrierenden Momente — und genau dafür gibt es unseren Wissens-Hub mit Risiko-Hinweisen.",
      ],
    },
    {
      heading: "GitHub Pages und Projekt-Hosting",
      paragraphs: [
        "Mit GitHub Pages kannst du aus einem Repository direkt eine statische Website veröffentlichen — ohne eigenen Server. Das ist ideal für Projekt-Dokumentationen, Portfolios oder Landingpages: Du legst die HTML-, CSS- und JavaScript-Dateien (oder die Ausgabe eines Generators) ins Repository, aktivierst Pages in den Einstellungen und erhältst eine öffentliche URL.",
        "Viele Open-Source-Projekte nutzen Pages, um ihre Dokumentation gepflegt und versioniert neben dem Code zu halten. In Kombination mit GitHub Actions lässt sich die Seite bei jeder Änderung automatisch neu bauen und veröffentlichen — ein einfacher, kostenloser Weg, Inhalte aktuell zu halten.",
      ],
    },
    {
      heading: "Stars, Watching und Entdeckung",
      paragraphs: [
        "Ein Stern (Star) ist ein Lesezeichen und zugleich ein Signal: Er zeigt, dass jemand ein Projekt interessant oder nützlich findet. Viele Sterne deuten auf Bekanntheit hin, sind aber kein Garant für Qualität oder Aktualität — ein populäres Projekt kann veraltet sein, ein kleines dafür hervorragend gepflegt.",
        "Mit „Watching“ abonnierst du Benachrichtigungen zu einem Repository, etwa zu neuen Issues oder Releases. Über die Explore-Seite, Topics und Trending-Listen lassen sich neue Projekte entdecken. Genau hier setzt auch „What's in it?“ an: Unsere Entdeckungs-Listen bewerten Projekte bewusst nicht allein nach Sternen, sondern auch nach Funktionalität und Wachstum, damit hochwertige kleinere Projekte sichtbar werden.",
        "Beim Bewerten eines unbekannten Repositories lohnt sich der Blick über die Sternzahl hinaus: Wann wurde zuletzt committet, gibt es offene und beantwortete Issues, existiert eine Lizenz und eine verständliche README? Diese Signale sagen mehr über die Gesundheit eines Projekts aus als eine große Zahl allein.",
      ],
    },
    {
      heading: "GitHub für Teams und Organisationen",
      paragraphs: [
        "Organisationen bündeln mehrere Repositories und Mitglieder unter einem gemeinsamen Dach. Über Teams und fein abgestufte Rechte steuerst du, wer lesen, schreiben oder verwalten darf. Das ist die Grundlage dafür, dass Unternehmen und größere Open-Source-Communities geordnet zusammenarbeiten können.",
        "Funktionen wie geschützte Branches, erforderliche Reviews, Statuschecks vor dem Merge und Vorlagen für Issues und Pull Requests sorgen für einheitliche, nachvollziehbare Abläufe. So lässt sich sicherstellen, dass nichts Ungeprüftes in den Hauptstand gelangt und dass alle Beteiligten denselben Qualitätsregeln folgen — unabhängig davon, wie groß das Team ist.",
      ],
    },
    {
      heading: "Deine ersten Schritte",
      paragraphs: [
        "Der typische Einstieg sieht so aus: ein kostenloses GitHub-Konto erstellen, Git lokal installieren, ein Repository anlegen oder klonen, Änderungen committen und mit push/pull synchronisieren. Für die ersten praktischen Befehle findest du in unserem Wissens-Hub fertige Workflows zum Kopieren.",
        "Wenn du ein konkretes Projekt verstehen willst, kannst du es direkt analysieren lassen — dann erklärt dir „What's in it?“ in Sekunden, was es ist, wie du es installierst und worauf du achten solltest.",
      ],
    },
  ],
  faq: [
    { question: "Ist GitHub kostenlos?", answer: "Ja, für öffentliche und in großem Umfang auch für private Repositories ist GitHub kostenlos nutzbar; kostenpflichtige Pläne bieten zusätzliche Team- und Sicherheitsfunktionen." },
    { question: "Brauche ich GitHub, um Git zu nutzen?", answer: "Nein. Git funktioniert eigenständig auf deinem Rechner. GitHub ist eine Plattform darüber für Hosting und Zusammenarbeit." },
    { question: "Was ist der Unterschied zwischen Fork und Clone?", answer: "Ein Clone lädt ein Repo auf deinen Rechner. Ein Fork erstellt eine eigene Kopie unter deinem GitHub-Konto, von der aus du Beiträge per Pull Request vorschlägst." },
    { question: "Sind meine öffentlichen Repos wirklich für alle sichtbar?", answer: "Ja. Öffentliche Repositories inklusive ihrer gesamten Historie sind für jeden einsehbar — veröffentliche niemals Passwörter oder Schlüssel." },
  ],
  related: [
    { label: "Was ist „What's in it?“", href: "/what-is-whats-in-it" },
    { label: "Git & GitHub Wissen", href: "/github" },
    { label: "Pull Request erklärt", href: "/github/pull-request" },
  ],
};

export const AUTHORITY_PAGES: AuthorityPage[] = [WHATS_IN_IT_PAGE, WHAT_IS_GITHUB_PAGE];

export function getAuthorityPage(slug: string): AuthorityPage | undefined {
  return AUTHORITY_PAGES.find((p) => p.slug === slug);
}

export function authorityWordCount(p: AuthorityPage): number {
  const parts: string[] = [p.intro];
  for (const s of p.sections) {
    parts.push(s.heading, ...s.paragraphs, ...(s.list ?? []));
  }
  for (const f of p.faq) parts.push(f.question, f.answer);
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}
