// PHASE-2 (Master Plan) — Blog & troubleshooting hub (DATA-006). Human-authored,
// accurate German long-form (>=1200 words each), static SSG, no AI-slop / no
// placeholders. Reuses the AuthorityPage rendering shape.
import type { AuthorityPage } from "./authority";

export type BlogCategory = "troubleshooting" | "grundlagen" | "workflows" | "automation";

export interface BlogArticle extends AuthorityPage {
  category: BlogCategory;
  publishedAt: string; // ISO date
  readingMinutes: number;
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  troubleshooting: "Fehler beheben",
  grundlagen: "Grundlagen",
  workflows: "Workflows",
  automation: "Automatisierung",
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "merge-konflikt-loesen",
    category: "troubleshooting",
    publishedAt: "2026-06-07",
    readingMinutes: 7,
    title: "Merge-Konflikt lösen: der ruhige Schritt-für-Schritt-Leitfaden",
    description:
      "Merge-Konflikte in Git verstehen und sicher auflösen: Was die Marker bedeuten, wie du Stelle für Stelle entscheidest, und wie du einen Merge im Notfall abbrichst.",
    intro:
      "Kaum etwas verunsichert beim Einstieg in Git so sehr wie die Meldung „CONFLICT“. Dabei ist ein Merge-Konflikt nichts Schlimmes, sondern eine ehrliche Rückfrage von Git: Zwei Änderungen betreffen dieselbe Stelle, und das Werkzeug möchte von dir wissen, welche gelten soll. In diesem Leitfaden lernst du in Ruhe, warum Konflikte entstehen, wie du die Markierungen liest, wie du Stelle für Stelle entscheidest und wie du jederzeit sicher zurück auf festen Boden kommst. Du brauchst dafür kein tiefes Vorwissen — nur das Verständnis, dass deine bereits gespeicherten Commits zu keinem Zeitpunkt verloren gehen und dass jeder Schritt umkehrbar ist. Mit dieser Sicherheit im Rücken verlieren Konflikte schnell ihren Schrecken.",
    sections: [
      {
        heading: "Warum Merge-Konflikte überhaupt entstehen",
        paragraphs: [
          "Git führt Änderungen automatisch zusammen, solange sie unterschiedliche Stellen betreffen. Ein Konflikt entsteht nur, wenn zwei Branches dieselbe Zeile unterschiedlich ändern oder wenn eine Seite eine Datei löscht, die die andere bearbeitet hat. Git kann dann nicht selbst entscheiden, welche Version richtig ist, ohne möglicherweise Arbeit zu zerstören.",
          "Konflikte treten typischerweise bei drei Aktionen auf: beim Zusammenführen zweier Branches mit git merge, beim Holen von Änderungen mit git pull (das intern ein merge ausführt) und beim Umsetzen von Commits mit git rebase. In allen Fällen ist das Vorgehen ähnlich — du löst die markierten Stellen auf und schließt die Aktion ab.",
          "Wichtig ist die richtige Haltung: Ein Konflikt bedeutet nicht, dass etwas kaputt ist. Deine Commits sind sicher. Git wartet nur auf deine Entscheidung und gibt dir alle Werkzeuge, um sie zu treffen.",
        ],
      },
      {
        heading: "Die Konfliktmarker richtig lesen",
        paragraphs: [
          "Bei einem Konflikt schreibt Git spezielle Markierungen in die betroffene Datei. Der Bereich zwischen <<<<<<< HEAD und ======= zeigt deine aktuelle Version, der Bereich zwischen ======= und >>>>>>> die Version aus dem anderen Branch. Dazwischen liegt also nicht „falscher“ Code, sondern zwei gültige Alternativen.",
          "Deine Aufgabe ist es, pro Konfliktblock zu entscheiden: Behalte ich meine Version, die andere, eine Kombination aus beiden — oder schreibe ich etwas Neues? Danach entfernst du alle drei Markerzeilen vollständig, sodass nur noch der gewünschte, lauffähige Code übrig bleibt.",
        ],
        list: [
          "<<<<<<< HEAD — Beginn deiner aktuellen Version.",
          "======= — Trennlinie zwischen den beiden Versionen.",
          ">>>>>>> branch-name — Ende der hereinkommenden Version.",
          "Alle drei Zeilen müssen nach dem Auflösen entfernt sein.",
        ],
      },
      {
        heading: "Schritt für Schritt zur Auflösung",
        paragraphs: [
          "Verschaffe dir zuerst mit git status einen Überblick: Git listet alle Dateien mit Konflikten unter „Unmerged paths“. Öffne diese Dateien nacheinander in deinem Editor und arbeite jeden Konfliktblock durch. Moderne Editoren wie VS Code zeigen dir Schaltflächen wie „Accept Current“, „Accept Incoming“ oder „Accept Both“ — im Hintergrund passiert genau das Beschriebene.",
          "Wenn eine Datei vollständig aufgelöst ist und keine Marker mehr enthält, meldest du sie mit git add <datei> als erledigt. Sind alle Konflikte gelöst, schließt du den Merge mit git commit ab (bei einem Rebase mit git rebase --continue). Git schlägt dabei meist schon eine sinnvolle Commit-Nachricht vor.",
          "Nimm dir die Zeit, jede Stelle wirklich zu verstehen, statt blind eine Seite zu übernehmen. Ein schnell „weggeklickter“ Konflikt ist die häufigste Ursache dafür, dass später Funktionen fehlen oder doppelt vorhanden sind.",
        ],
      },
      {
        heading: "Der sichere Notausgang",
        paragraphs: [
          "Wenn du unsicher wirst oder feststellst, dass du den Konflikt gerade nicht sauber lösen kannst, musst du nichts riskieren. Mit git merge --abort bringst du das Repository exakt in den Zustand vor dem Merge zurück. Bei einem Rebase leistet git rebase --abort dasselbe.",
          "Dieser Notausgang ist enorm beruhigend: Du kannst jeden Merge gefahrlos beginnen, hineinschauen und ihn wieder abbrechen, wenn dir die Lage zu komplex erscheint. Danach kannst du dir mehr Kontext holen, mit Kolleginnen sprechen oder den Branch zuerst auf den neuesten Stand bringen.",
        ],
      },
      {
        heading: "Konflikte von vornherein seltener machen",
        paragraphs: [
          "Die beste Konfliktlösung ist, große Konflikte gar nicht erst entstehen zu lassen. Das gelingt mit ein paar Gewohnheiten: Hole regelmäßig die neuesten Änderungen in deinen Feature-Branch, statt ihn wochenlang isoliert zu lassen. Halte Branches und Pull Requests klein und thematisch fokussiert. Und stimme dich im Team ab, wenn mehrere Personen an denselben Dateien arbeiten.",
          "Auch saubere, kleine Commits helfen: Je klarer eine Änderung umrissen ist, desto leichter lässt sich ein Konflikt verstehen und auflösen. Wer diese Routinen verinnerlicht, erlebt Konflikte bald nur noch als kurze, beherrschbare Zwischenschritte.",
        ],
      },
      {
        heading: "Werkzeuge, die das Auflösen erleichtern",
        paragraphs: [
          "Du musst Konflikte nicht im nackten Texteditor lösen. Moderne Editoren wie VS Code zeigen die beiden Versionen nebeneinander und bieten Schaltflächen, um die aktuelle, die hereinkommende oder beide Versionen zu übernehmen. Das reduziert Tippfehler und das Risiko, eine Markerzeile zu vergessen.",
          "Zusätzlich kannst du ein grafisches Merge-Tool über git mergetool einbinden. Für einen schnellen Überblick hilft git diff während des Konflikts, und git log --merge zeigt dir genau die Commits, die zum Konflikt beigetragen haben. Wer die Ursache versteht, trifft die bessere Entscheidung.",
          "Welches Werkzeug du auch nutzt: Das Prinzip bleibt identisch. Am Ende muss die Datei frei von Markern und lauffähig sein, dann folgt git add und der Abschluss der Aktion.",
        ],
      },
      {
        heading: "Konflikte bei pull und rebase",
        paragraphs: [
          "Bei git pull entsteht ein Konflikt, weil pull intern fetch und merge kombiniert. Die Auflösung ist identisch zum normalen Merge. Viele Teams bevorzugen git pull --rebase, weil es eine geradlinigere Historie erzeugt — dann tauchen Konflikte allerdings pro umgesetztem Commit auf, nicht gesammelt.",
          "Beim Rebase löst du jeden Konflikt, machst git add und setzt mit git rebase --continue fort, bis alle Commits umgesetzt sind. Das fühlt sich anfangs kleinteiliger an, ist aber gut beherrschbar. Wichtig: Rebase niemals auf bereits geteilten Branches anwenden, da es die Historie umschreibt.",
        ],
      },
      {
        heading: "Ein kurz durchgespieltes Beispiel",
        paragraphs: [
          "Stell dir vor, du und eine Kollegin ändert beide die Überschrift in einer README. Beim Mergen meldet Git einen Konflikt in genau dieser Zeile. Du öffnest die Datei, siehst deine Variante über und ihre Variante unter der Trennlinie und entscheidest dich für eine kombinierte Formulierung.",
          "Du entfernst die drei Markerzeilen, speicherst, prüfst mit git status, dass keine weiteren Konflikte offen sind, und meldest die Datei mit git add README.md. Ein abschließendes git commit beendet den Merge. Was zuerst bedrohlich wirkte, war am Ende eine bewusste Entscheidung in einer einzigen Zeile — genau das ist der Normalfall.",
        ],
      },
      {
        heading: "Wenn der Konflikt zu groß wirkt",
        paragraphs: [
          "Manchmal ist ein Konflikt so umfangreich, dass eine saubere Auflösung im Moment nicht gelingt. Das ist kein Versagen, sondern ein Signal: Brich den Vorgang mit git merge --abort ab und schaffe erst bessere Voraussetzungen, statt unter Druck Code zu zerstören.",
          "Hol dir dann den aktuellen Zielstand in deinen Branch, bevor du erneut zusammenführst, sprich dich mit den Personen ab, deren Änderungen betroffen sind, und teile den Merge wenn möglich in kleinere Schritte. Oft löst sich ein scheinbar riesiger Konflikt in mehrere kleine, gut verständliche Entscheidungen auf — und genau die lassen sich ruhig und sicher treffen.",
        ],
      },
    ],
    faq: [
      { question: "Verliere ich bei einem Merge-Konflikt Code?", answer: "Nein. Deine bereits erstellten Commits bleiben vollständig erhalten. Git fragt nur, welche Version an der Konfliktstelle gelten soll, und du kannst den Merge jederzeit mit git merge --abort abbrechen und exakt zum Stand davor zurückkehren — es geht dabei nichts verloren." },
      { question: "Was, wenn ich aus Versehen falsch aufgelöst habe?", answer: "Solange du noch nicht committet hast, hilft git merge --abort. Nach dem Commit kannst du mit git revert den Merge-Commit sicher zurücknehmen." },
      { question: "Sind Konflikte bei rebase anders als bei merge?", answer: "Das eigentliche Auflösen ist identisch (Marker bearbeiten, dann git add). Nur der Abschluss unterscheidet sich: bei einem Rebase nutzt du git rebase --continue statt git commit, und du löst die Konflikte gegebenenfalls pro Commit nacheinander." },
    ],
    related: [
      { label: "git merge erklärt", href: "/github/git-merge" },
      { label: "Merge-Konflikt-Workflow", href: "/github/shortcuts#merge-konflikt-loesen" },
      { label: "Rückgängig machen", href: "/github/rueckgaengig-machen" },
    ],
  },

  {
    slug: "ssh-permission-denied-beheben",
    category: "troubleshooting",
    publishedAt: "2026-06-07",
    readingMinutes: 6,
    title: "„Permission denied (publickey)“ bei GitHub beheben",
    description:
      "Der SSH-Fehler Permission denied (publickey) verständlich erklärt und Schritt für Schritt behoben: Schlüssel prüfen, beim SSH-Agent registrieren und in GitHub hinterlegen.",
    intro:
      "Wenige Fehlermeldungen frustrieren beim Einstieg so wie „git@github.com: Permission denied (publickey)“. Sie klingt nach einem ernsten Sicherheitsproblem, ist aber fast immer schnell behoben. Sie bedeutet schlicht: GitHub konnte deinen SSH-Schlüssel nicht erkennen oder akzeptieren. In diesem Artikel klären wir, wie SSH-Authentifizierung funktioniert, woran der Fehler typischerweise liegt und wie du ihn in wenigen, sicheren Schritten behebst.",
    sections: [
      {
        heading: "Wie SSH-Authentifizierung funktioniert",
        paragraphs: [
          "SSH verwendet ein Schlüsselpaar aus einem privaten und einem öffentlichen Schlüssel. Der private Schlüssel bleibt geheim auf deinem Rechner; den öffentlichen Schlüssel hinterlegst du bei GitHub. Beim Verbinden beweist dein Rechner mithilfe des privaten Schlüssels, dass er zum hinterlegten öffentlichen Schlüssel gehört — ganz ohne Passwort.",
          "Der Fehler „Permission denied (publickey)“ tritt auf, wenn dieser Beweis scheitert. Meist liegt das daran, dass kein passender Schlüssel gefunden wurde, der öffentliche Schlüssel nicht in deinem GitHub-Konto liegt, oder die Remote-URL auf HTTPS statt SSH zeigt.",
        ],
      },
      {
        heading: "Schritt 1: Verbindung testen",
        paragraphs: [
          "Bevor du etwas änderst, prüfe den Ist-Zustand mit ssh -T git@github.com. Funktioniert alles, begrüßt dich GitHub mit deinem Benutzernamen. Erscheint stattdessen „Permission denied (publickey)“, weißt du, dass an der Schlüssel-Kette etwas fehlt.",
          "Dieser Test ist harmlos und jederzeit wiederholbar. Nutze ihn nach jedem der folgenden Schritte erneut, um zu sehen, ob das Problem behoben ist.",
        ],
      },
      {
        heading: "Schritt 2: Schlüssel prüfen oder erstellen",
        paragraphs: [
          "Sieh nach, ob bereits ein Schlüssel existiert: Im Ordner ~/.ssh sollten Dateien wie id_ed25519 (privat) und id_ed25519.pub (öffentlich) liegen. Fehlt ein Schlüssel, erstellst du mit ssh-keygen -t ed25519 -C \"deine@mail.de\" ein neues, modernes Schlüsselpaar.",
          "Achte darauf, niemals den privaten Schlüssel weiterzugeben oder in ein Repository zu committen. Nur die .pub-Datei ist für die Weitergabe gedacht. Eine versehentlich veröffentlichte private Schlüsseldatei solltest du sofort ersetzen.",
        ],
      },
      {
        heading: "Schritt 3: Schlüssel beim Agent registrieren",
        paragraphs: [
          "Damit dein System den richtigen Schlüssel anbietet, muss er dem SSH-Agent bekannt sein. Starte ihn gegebenenfalls und füge den Schlüssel mit ssh-add ~/.ssh/id_ed25519 hinzu. Auf manchen Systemen lohnt sich ein Eintrag in der Datei ~/.ssh/config, damit der Schlüssel dauerhaft genutzt wird.",
          "Ein häufiger, leicht übersehener Grund für den Fehler ist genau dieser Schritt: Der Schlüssel existiert, ist aber dem Agent nicht bekannt, sodass er beim Verbinden nicht angeboten wird.",
        ],
      },
      {
        heading: "Schritt 4: Öffentlichen Schlüssel bei GitHub hinterlegen",
        paragraphs: [
          "Kopiere den Inhalt der Datei id_ed25519.pub und füge ihn in GitHub unter Settings → SSH and GPG keys → New SSH key ein. Erst danach kennt GitHub deinen öffentlichen Schlüssel und kann die Verbindung akzeptieren.",
          "Prüfe abschließend, ob deine Remote-URL überhaupt SSH nutzt: git remote -v sollte eine Adresse der Form git@github.com:owner/repo.git zeigen. Steht dort https://, verwendet dein Repository HTTPS — dann brauchst du entweder ein Personal Access Token oder du stellst die Remote mit git remote set-url auf die SSH-Adresse um.",
        ],
      },
      {
        heading: "Mehrere Schlüssel und die config-Datei",
        paragraphs: [
          "Wer mit mehreren Konten oder Geräten arbeitet, hat oft mehrere Schlüssel. Damit dein System pro Host den richtigen anbietet, lohnt sich eine Datei ~/.ssh/config. Dort legst du je Host fest, welcher Schlüssel verwendet wird, etwa einen Eintrag für github.com mit dem Pfad zur passenden IdentityFile.",
          "Ohne diese Zuordnung probiert SSH unter Umständen einen falschen Schlüssel zuerst und scheitert, obwohl der richtige vorhanden ist. Eine saubere config-Datei macht die Verbindung damit nicht nur zuverlässiger, sondern auch nachvollziehbar — du siehst auf einen Blick, welcher Schlüssel wofür gilt.",
        ],
      },
      {
        heading: "Die HTTPS-Alternative mit Token",
        paragraphs: [
          "Du musst nicht zwingend SSH nutzen. Bei HTTPS-Remotes authentifizierst du dich mit einem Personal Access Token (PAT) statt mit einem Passwort. Das Token erstellst du in den GitHub-Einstellungen und gibst es bei der ersten Push-Anfrage ein; ein Credential-Helper speichert es danach sicher.",
          "HTTPS mit Token ist oft der einfachere Einstieg, besonders in Umgebungen, in denen SSH-Ports blockiert sind. Wichtig ist Konsistenz: Entscheide dich pro Repository für SSH oder HTTPS und halte die Remote-URL entsprechend. Ein Wechsel ist jederzeit über git remote set-url möglich.",
        ],
      },
      {
        heading: "Besonderheiten je Betriebssystem",
        paragraphs: [
          "Unter macOS integriert sich der SSH-Agent in den Schlüsselbund; mit einem UseKeychain-Eintrag in der config wird dein Schlüssel nach dem ersten Entsperren automatisch geladen. Unter Linux startest du den Agent gegebenenfalls manuell und fügst den Schlüssel mit ssh-add hinzu.",
          "Unter Windows nutzt du entweder das in Git Bash mitgelieferte OpenSSH oder den OpenSSH-Dienst von Windows; achte darauf, denselben Agent zu verwenden, bei dem dein Schlüssel registriert ist. Diese kleinen Unterschiede sind eine häufige, leicht übersehene Ursache, warum derselbe Schlüssel auf einem System funktioniert und auf einem anderen nicht.",
        ],
      },
      {
        heading: "Häufige Ursachen im Überblick",
        paragraphs: [
          "Wenn der Fehler hartnäckig bleibt, geh die typischen Ursachen der Reihe nach durch. In den allermeisten Fällen liegt es an genau einem dieser Punkte — eine ruhige Checkliste spart dir langes Raten.",
        ],
        list: [
          "Es existiert kein Schlüsselpaar oder es liegt am falschen Ort.",
          "Der private Schlüssel ist dem SSH-Agent nicht bekannt (ssh-add vergessen).",
          "Der öffentliche Schlüssel ist nicht in den GitHub-Einstellungen hinterlegt.",
          "Die Remote-URL nutzt HTTPS statt SSH (oder umgekehrt).",
          "Auf dem Gerät wird ein anderer SSH-Agent verwendet als erwartet.",
        ],
      },
      {
        heading: "Schlüssel sicher halten",
        paragraphs: [
          "Ein SSH-Schlüssel ist ein Zugang zu deinem Code. Schütze den privaten Schlüssel wie ein Passwort: niemals teilen, niemals committen, idealerweise mit einer Passphrase versehen. Eine Passphrase verhindert, dass ein gestohlener Schlüssel sofort nutzbar ist.",
          "Verlierst du die Kontrolle über ein Gerät, entfernst du dessen öffentlichen Schlüssel einfach in den GitHub-Einstellungen — alle anderen Geräte funktionieren weiter. Genau das ist der Vorteil, pro Gerät ein eigenes Schlüsselpaar zu verwenden: Du kannst gezielt einzelne Zugänge widerrufen, ohne deinen gesamten Zugang neu einrichten zu müssen.",
        ],
      },
      {
        heading: "Die Fehlermeldung genau lesen",
        paragraphs: [
          "Die Meldung „Permission denied (publickey)“ nennt den Grund bereits: Die Authentifizierung per öffentlichem Schlüssel ist gescheitert, und zwar als einzige angebotene Methode. GitHub akzeptiert für Git über SSH ausschließlich Schlüssel — fällt diese Methode aus, bleibt nichts übrig, daher der harte Abbruch.",
          "Mehr Details liefert der ausführliche Modus mit ssh -vT git@github.com. Die Ausgabe zeigt Zeile für Zeile, welche Schlüssel angeboten und warum sie abgelehnt wurden. Das klingt technisch, ist aber die schnellste Methode, um zu erkennen, ob überhaupt der erwartete Schlüssel zum Einsatz kommt.",
        ],
      },
      {
        heading: "SSH über Port 443 in blockierten Netzen",
        paragraphs: [
          "In manchen Firmen- oder WLAN-Netzen ist der Standard-SSH-Port 22 gesperrt. Dann scheitert die Verbindung, obwohl deine Schlüssel korrekt sind. GitHub bietet dafür SSH über den HTTPS-Port 443 an: Du erreichst es über den Host ssh.github.com auf Port 443.",
          "Ein kurzer Eintrag in der ~/.ssh/config leitet Verbindungen zu github.com automatisch über diesen Weg. Das ist eine saubere Lösung, wenn der eigentliche Fehler gar nicht an den Schlüsseln, sondern an der Netzwerk-Blockade liegt — ein Detail, das ohne diesen Hinweis viele Stunden Fehlersuche kosten kann.",
        ],
      },
      {
        heading: "Schlüsseltypen: ed25519 statt RSA",
        paragraphs: [
          "Heute ist ed25519 der empfohlene Schlüsseltyp: Er ist kürzer, schneller und nach aktuellem Stand sehr sicher. Ältere Anleitungen erzeugen oft RSA-Schlüssel; diese funktionieren weiterhin, sollten aber mindestens 4096 Bit lang sein.",
          "Falls du einen sehr alten Schlüssel nutzt, lohnt sich der Umstieg auf ed25519. Erzeuge ein neues Paar, hinterlege den neuen öffentlichen Schlüssel bei GitHub und entferne den alten. So bleibst du auf einem modernen, gut unterstützten Stand und vermeidest Kompatibilitätsprobleme mit aktuellen Server-Einstellungen.",
        ],
      },
    ],
    faq: [
      { question: "HTTPS oder SSH — was soll ich nutzen?", answer: "Beides ist sicher. SSH ist nach der Einrichtung bequem ohne Passwort; HTTPS nutzt stattdessen ein Personal Access Token. Wähle eines und halte die Remote-URL entsprechend konsistent." },
      { question: "Muss ich pro Rechner einen eigenen Schlüssel anlegen?", answer: "Empfohlen ja. So kannst du einzelne Geräte gezielt sperren, ohne alle anderen zu beeinträchtigen." },
      { question: "Der Test schlägt weiter fehl — was nun?", answer: "Prüfe der Reihe nach: existiert der Schlüssel, ist er beim Agent registriert, liegt der öffentliche Schlüssel bei GitHub, und nutzt die Remote SSH?" },
    ],
    related: [
      { label: "SSH-Keys & Authentifizierung", href: "/github/ssh-keys" },
      { label: "Fehler: Permission denied (publickey)", href: "/github/permission-denied-publickey" },
      { label: "git remote erklärt", href: "/github/git-remote" },
    ],
  },

  {
    slug: "aenderungen-rueckgaengig-machen",
    category: "troubleshooting",
    publishedAt: "2026-06-07",
    readingMinutes: 8,
    title: "Git: Änderungen sicher rückgängig machen (restore, reset, revert)",
    description:
      "Welcher Git-Befehl macht was rückgängig? restore, reset und revert verständlich erklärt — inklusive der wichtigen Frage, ob du schon gepusht hast.",
    intro:
      "„Hilfe, ich habe etwas kaputt gemacht!“ ist in Git fast nie ein echtes Drama, denn das Werkzeug ist darauf ausgelegt, Fehler rückgängig zu machen. Die Kunst besteht darin, den richtigen der drei Hauptbefehle zu wählen: git restore, git reset oder git revert. Sie klingen ähnlich, tun aber sehr Unterschiedliches. Dieser Leitfaden ordnet sie ein und gibt dir eine klare Entscheidungsregel — vor allem rund um die entscheidende Frage, ob du deine Änderungen schon gepusht hast. Zusätzlich lernst du das Reflog als Sicherheitsnetz kennen, mit dem sich selbst scheinbar verlorene Stände oft wiederherstellen lassen, sowie git commit --amend, um den letzten Commit elegant zu korrigieren, ohne überhaupt zurücksetzen zu müssen.",
    sections: [
      {
        heading: "Die wichtigste Frage zuerst: schon gepusht?",
        paragraphs: [
          "Bevor du irgendetwas rückgängig machst, beantworte eine Frage: Sind die betroffenen Commits bereits zu GitHub gepusht und damit für andere sichtbar? Diese Frage entscheidet, welcher Weg sicher ist.",
          "Solange du nur lokal gearbeitet und noch nicht gepusht hast, darfst du die Historie umschreiben (reset). Sobald du gepusht hast und andere den Stand möglicherweise schon haben, ist das Umschreiben gefährlich — dann ist revert die richtige, rücksichtsvolle Wahl, weil es die Historie ergänzt statt sie zu verändern.",
        ],
      },
      {
        heading: "git restore: Arbeitsdatei zurücksetzen",
        paragraphs: [
          "git restore betrifft den aktuellen Arbeitsstand, nicht die Commit-Historie. Mit git restore <datei> verwirfst du nicht committete Änderungen an einer Datei und holst die zuletzt committete Version zurück. Mit git restore --staged <datei> nimmst du eine versehentlich vorgemerkte Datei wieder aus der Staging-Area, ohne deine Änderungen zu verlieren.",
          "restore ist also dein Werkzeug für den Alltag: „Diese ungespeicherte Änderung war doch nichts“ oder „Ich habe zu viel zu git add hinzugefügt“. Vorsicht: Das Verwerfen nicht committeter Änderungen ist endgültig — committe lieber einmal mehr, bevor du Großes verwirfst.",
        ],
      },
      {
        heading: "git reset: den Branch-Zeiger verschieben",
        paragraphs: [
          "git reset bewegt den Branch auf einen früheren Commit zurück. Entscheidend ist die Variante: --soft behält alle Änderungen vorgemerkt (ideal, um den letzten Commit neu zu schreiben), --mixed (Standard) behält sie unvorgemerkt im Arbeitsverzeichnis, und --hard verwirft sie unwiderruflich.",
          "Genau dieses --hard ist der gefährlichste Befehl für Einsteiger, weil es ungespeicherte Arbeit ohne Rückfrage löscht. Nutze reset nur für lokale, noch nicht gepushte Commits. Ein typischer, sicherer Einsatz ist git reset --soft HEAD~1, um den letzten Commit zu lösen und die Änderungen gleich erneut sauberer zu committen.",
        ],
      },
      {
        heading: "git revert: sicher für geteilte Historie",
        paragraphs: [
          "git revert nimmt einen bestimmten Commit zurück, indem es einen neuen Commit erzeugt, der dessen Änderungen umkehrt. Die Historie bleibt vollständig erhalten — nichts wird umgeschrieben. Genau deshalb ist revert die richtige Wahl, sobald Commits bereits gepusht und geteilt sind.",
          "Der Vorteil: Kolleginnen, die den alten Stand bereits geholt haben, geraten nicht in Konflikte, weil ihre Historie weiterhin gültig ist. Du fügst lediglich einen klar benannten Rücknahme-Commit hinzu. Für die Rücknahme eines fehlerhaften Releases auf main ist revert daher fast immer die saubere Lösung.",
        ],
      },
      {
        heading: "Die Entscheidungsregel auf einen Blick",
        paragraphs: [
          "Fasse es dir als einfache Regel: Geht es um nicht committete Änderungen, nimm restore. Geht es um lokale, noch nicht gepushte Commits, die du aufräumen willst, nimm reset (mit Bedacht, --hard nur wenn du sicher bist). Geht es um bereits gepushte Commits, nimm revert.",
          "Und unabhängig vom Befehl gilt: Committe häufig und in kleinen Schritten. Eine saubere Historie aus vielen kleinen Commits macht jede Rücknahme einfacher, weil du gezielt genau die eine Änderung zurücknehmen kannst, die nicht passt.",
        ],
      },
      {
        heading: "git reflog: das Sicherheitsnetz",
        paragraphs: [
          "Viele glauben, ein git reset --hard oder ein verunglückter Rebase lösche Commits für immer. In den meisten Fällen stimmt das nicht: Git führt mit dem Reflog ein lokales Protokoll, wohin HEAD in den letzten Tagen gezeigt hat. Mit git reflog siehst du diese Geschichte und findest den Hash eines scheinbar verlorenen Stands wieder.",
          "Hast du den Hash, bringt dich git reset --hard <hash> oder das Erstellen eines neuen Branches mit git branch rettung <hash> zurück. So lassen sich überraschend viele „Katastrophen“ rückgängig machen. Wichtig ist nur, schnell zu handeln, denn der Reflog wird nach einiger Zeit aufgeräumt.",
          "Das Reflog ist damit das beste Argument, in Git ruhig zu bleiben: Solange du committet hast, ist fast nichts wirklich endgültig verloren. Nur nie committete Änderungen, die ein --hard verwirft, lassen sich nicht zurückholen — committe deshalb lieber einmal mehr.",
        ],
      },
      {
        heading: "Die drei reset-Modi im Detail",
        paragraphs: [
          "git reset --soft bewegt nur den Branch-Zeiger zurück und lässt alle Änderungen vorgemerkt im Staging. Das ist ideal, um mehrere kleine Commits zu einem zusammenzufassen oder den letzten Commit mit einer besseren Nachricht neu zu erstellen, ohne Arbeit zu verlieren.",
          "git reset --mixed (der Standard) bewegt den Zeiger zurück und nimmt die Änderungen aus dem Staging, behält sie aber im Arbeitsverzeichnis. Du kannst dann gezielt neu auswählen, was in den nächsten Commit soll. Diese Variante ist nützlich, wenn du einen Commit auflösen und seine Änderungen neu strukturieren willst.",
          "git reset --hard schließlich verwirft alles bis zum Zielstand — Staging und Arbeitsverzeichnis. Es ist mächtig und gefährlich zugleich: Genau hier verlieren Einsteiger ungespeicherte Arbeit. Nutze es nur, wenn du sicher bist, dass du die aktuellen Änderungen wirklich wegwerfen willst.",
        ],
      },
      {
        heading: "Den letzten Commit korrigieren mit amend",
        paragraphs: [
          "Oft willst du gar nicht zurücksetzen, sondern nur den letzten Commit nachbessern — etwa weil die Nachricht einen Tippfehler hat oder eine Datei fehlt. Dafür gibt es git commit --amend. Es ersetzt den letzten Commit durch einen neuen, der deine Korrektur enthält.",
          "Solange der Commit noch nicht gepusht ist, ist amend die eleganteste Lösung: schnell, sauber und ohne Reset. Vergisst du etwa eine Datei, fügst du sie mit git add hinzu und führst dann git commit --amend --no-edit aus, um sie still in den letzten Commit aufzunehmen.",
          "Wie beim Reset gilt auch hier die goldene Regel: Bereits gepushte Commits nicht mit amend verändern, da dies die Historie umschreibt. Auf einem geteilten Branch nimmst du Fehler stattdessen mit einem zusätzlichen Korrektur-Commit oder mit revert zurück.",
        ],
      },
      {
        heading: "Eine Entscheidungshilfe aus der Praxis",
        paragraphs: [
          "Stell dir drei typische Situationen vor. Erstens: Du hast in einer Datei herumprobiert und willst den Stand des letzten Commits zurück — git restore <datei> genügt. Zweitens: Dein letzter, noch nicht gepushter Commit war verfrüht — git reset --soft HEAD~1 löst ihn und du committest sauber neu.",
          "Drittens: Ein bereits gepushter Commit auf main verursacht einen Fehler — git revert <hash> nimmt ihn sicher zurück, ohne die Historie anderer zu beschädigen. Diese drei Muster decken den allergrößten Teil des Alltags ab.",
          "Wenn du unsicher bist, welcher Weg richtig ist, halte kurz inne und beantworte nur die eine Frage: Wurde der betroffene Stand schon geteilt? Aus der Antwort folgt fast immer die sichere Wahl — restore und reset für Lokales, revert für Geteiltes.",
        ],
      },
    ],
    faq: [
      { question: "Ich habe git reset --hard genutzt und Arbeit verloren — geht das zurück?", answer: "Manchmal: git reflog zeigt frühere Stände, zu denen du oft zurückfinden kannst. Ungespeicherte, nie committete Änderungen sind allerdings meist endgültig weg." },
      { question: "revert oder reset auf main?", answer: "Auf einem geteilten Branch wie main immer revert. reset würde die Historie umschreiben und allen anderen Konflikte bescheren." },
      { question: "Was ist der Unterschied zwischen restore und reset?", answer: "restore betrifft Dateiinhalte im Arbeitsverzeichnis und im Staging und lässt die Commit-Historie unberührt; reset verschiebt dagegen den Branch-Zeiger und verändert damit, welche Commits als aktuell gelten. Als Faustregel: restore arbeitet auf Dateiebene, reset auf Commit-Ebene." },
      { question: "Wie hole ich einen aus Versehen gelöschten Commit zurück?", answer: "Sieh im Reflog nach: git reflog listet die letzten Stände von HEAD mit ihren Hashes. Mit git reset --hard <hash> oder git branch rettung <hash> stellst du den gewünschten Stand wieder her, solange der Reflog ihn noch enthält." },
    ],
    related: [
      { label: "Rückgängig machen (Wissen)", href: "/github/rueckgaengig-machen" },
      { label: "git add & commit", href: "/github/git-add-commit" },
      { label: "Letzten Commit rückgängig (Workflow)", href: "/github/shortcuts#letzten-commit-rueckgaengig" },
    ],
  },

  {
    slug: "erstes-projekt-auf-github",
    category: "grundlagen",
    publishedAt: "2026-06-07",
    readingMinutes: 7,
    title: "Dein erstes Projekt auf GitHub veröffentlichen",
    description:
      "Vom lokalen Ordner zum öffentlichen GitHub-Repository: Schritt für Schritt initialisieren, committen, verbinden und pushen — inklusive .gitignore, README und Lizenz.",
    intro:
      "Das erste eigene Projekt auf GitHub zu veröffentlichen fühlt sich nach einem großen Schritt an — ist aber eine überschaubare Abfolge weniger Befehle. In diesem Leitfaden bringst du einen lokalen Projektordner sicher online: Du initialisierst Git, schützt sensible Dateien mit einer .gitignore, erstellst den ersten Commit, verbindest dein Projekt mit GitHub und pushst es. Außerdem erfährst du, warum README und Lizenz von Anfang an wichtig sind, wie du danach mit Branches und Pull Requests sauber weiterarbeitest und wie du dein Projekt mit GitHub Pages sogar als Website veröffentlichen kannst.",
    sections: [
      {
        heading: "Vorbereitung: Konto, Git und ein Plan",
        paragraphs: [
          "Du brauchst ein kostenloses GitHub-Konto und ein installiertes Git auf deinem Rechner. Überlege kurz, ob dein Repository öffentlich oder privat sein soll. Öffentlich heißt: für alle sichtbar — ideal für Open-Source und Portfolio, aber niemals der Ort für Passwörter oder Schlüssel.",
          "Lege außerdem fest, wie dein Projekt heißen soll. Ein klarer, kurzer Name in Kleinschreibung mit Bindestrichen ist eine gute Konvention und erleichtert später das Teilen und Auffinden.",
        ],
      },
      {
        heading: "Schritt 1: Repository initialisieren und absichern",
        paragraphs: [
          "Wechsle im Terminal in deinen Projektordner und mache ihn mit git init zu einem Git-Repository. Lege direkt danach eine .gitignore an — das ist der wichtigste Schutzschritt. Trage dort alles ein, was nicht in die Versionskontrolle gehört: Abhängigkeiten wie node_modules, Build-Ausgaben und vor allem Geheimnisse wie .env-Dateien.",
          "Dieser Schritt vor dem ersten Commit ist entscheidend, denn eine einmal committete Geheimnisdatei bleibt in der Historie, selbst wenn du sie später entfernst. Wer die .gitignore von Anfang an pflegt, erspart sich später aufwendige Bereinigungen.",
        ],
      },
      {
        heading: "Schritt 2: Den ersten Commit erstellen",
        paragraphs: [
          "Sieh dir mit git status an, welche Dateien Git erfasst. Merke sie mit git add . vor und prüfe noch einmal, dass keine Geheimnisse dabei sind. Erstelle dann den ersten Commit mit einer aussagekräftigen Nachricht, zum Beispiel git commit -m \"Initialer Commit\".",
          "Gute Commit-Nachrichten beschreiben kurz das Warum statt nur das Was. Schon beim ersten Commit lohnt es sich, diese Gewohnheit zu beginnen — sie macht deine Historie für dich und andere lesbar.",
        ],
      },
      {
        heading: "Schritt 3: Mit GitHub verbinden und pushen",
        paragraphs: [
          "Erstelle auf GitHub ein neues, leeres Repository (ohne automatisch erzeugte README, damit es keine Konflikte gibt). Kopiere dessen URL und verbinde dein lokales Projekt damit: git remote add origin <url>. Lade anschließend deinen Stand mit git push -u origin main hoch.",
          "Das -u beim ersten Push merkt sich die Verbindung, sodass künftig ein einfaches git push genügt. Aktualisiere die Seite auf GitHub — dein Code ist jetzt online und teilbar.",
        ],
      },
      {
        heading: "Schritt 4: README und Lizenz nicht vergessen",
        paragraphs: [
          "Eine gute README ist der erste Eindruck deines Projekts. Sie beantwortet drei Fragen: Was ist das, wie installiere ich es, wie benutze ich es? Selbst ein kurzer, klarer Text hebt dein Projekt deutlich von einem kommentarlosen Code-Haufen ab.",
          "Ebenso wichtig ist eine Lizenz. Ohne Lizenz dürfen andere deinen Code rechtlich nicht nutzen, selbst wenn er öffentlich ist. Eine gängige, permissive Lizenz wie MIT macht klar, dass und wie andere dein Projekt verwenden dürfen — ein wesentlicher Teil eines vertrauenswürdigen Open-Source-Projekts.",
        ],
      },
      {
        heading: "Ab jetzt: Branches statt direkt auf main",
        paragraphs: [
          "Sobald dein Projekt online ist, lohnt sich eine gute Gewohnheit: Entwickle neue Funktionen auf eigenen Branches statt direkt auf main. So bleibt der Hauptstand jederzeit funktionsfähig, während du in Ruhe an etwas Neuem arbeitest.",
          "Der Ablauf ist einfach: Mit git switch -c feature/mein-feature erstellst du einen Branch, arbeitest dort, committest und pushst ihn. Ist das Feature fertig, führst du es über einen Pull Request oder einen Merge zurück nach main. Dieses Muster wirkt anfangs nach Mehraufwand, zahlt sich aber sofort aus, sobald mehr als eine Person beteiligt ist.",
        ],
      },
      {
        heading: "Mitarbeitende und Berechtigungen",
        paragraphs: [
          "Willst du mit anderen zusammenarbeiten, lädst du sie in den Repository-Einstellungen als Collaborators ein oder organisierst das Projekt in einer GitHub-Organisation mit Teams. Über Rollen steuerst du, wer nur lesen, wer schreiben und wer verwalten darf.",
          "Für größere Projekte ist die Organisation der sauberere Weg, weil sich Rechte zentral und nachvollziehbar verwalten lassen. Für ein kleines Projekt zu zweit genügen Collaborators völlig. In beiden Fällen gilt: Vergib nur so viele Rechte wie nötig — das ist die einfachste Sicherheitsmaßnahme überhaupt.",
        ],
      },
      {
        heading: "main schützen und Pull Requests nutzen",
        paragraphs: [
          "Sobald mehrere Personen beitragen, lohnt sich der Schutz des main-Branches. In den Einstellungen kannst du Regeln festlegen: etwa, dass Änderungen nur über Pull Requests einfließen, dass ein Review nötig ist oder dass automatische Tests erfolgreich sein müssen, bevor gemergt werden darf.",
          "So verhinderst du, dass versehentlich ungeprüfter Code im wichtigsten Branch landet. Pull Requests werden damit zum zentralen Ort der Qualitätssicherung: Hier wird diskutiert, geprüft und freigegeben. Auch wenn du allein arbeitest, ist diese Disziplin eine gute Übung und macht dein Projekt für spätere Mitwirkende einladend.",
        ],
      },
      {
        heading: "Die Projektseite ansprechend machen",
        paragraphs: [
          "GitHub zeigt deine README direkt auf der Projektseite. Nutze das: Eine klare Überschrift, ein Satz, der das Projekt erklärt, eine Installations- und eine Nutzungssektion bilden ein solides Grundgerüst. Code-Blöcke und Screenshots erhöhen die Verständlichkeit erheblich.",
          "Ergänze eine kurze Beschreibung und passende Topics in den Repository-Einstellungen — beides hilft anderen, dein Projekt zu finden und einzuordnen. Status-Badges, etwa für den Build-Status deiner GitHub Actions, signalisieren auf einen Blick, dass das Projekt gepflegt wird.",
        ],
      },
      {
        heading: "Mit GitHub Pages eine Website veröffentlichen",
        paragraphs: [
          "Aus vielen Projekten lässt sich mit wenigen Klicks eine Website machen. GitHub Pages veröffentlicht statische Inhalte direkt aus deinem Repository — ideal für eine Projekt-Dokumentation, eine Landingpage oder ein Portfolio, ganz ohne eigenen Server.",
          "Du aktivierst Pages in den Einstellungen und wählst die Quelle (zum Beispiel den Ordner /docs oder einen Build-Output). In Kombination mit GitHub Actions kann die Seite bei jeder Änderung automatisch neu gebaut und veröffentlicht werden. So wird aus deinem ersten Repository nicht nur Code, sondern auch eine sichtbare, teilbare Präsenz im Web.",
        ],
      },
      {
        heading: "Fertige .gitignore-Vorlagen nutzen",
        paragraphs: [
          "Du musst die .gitignore nicht von Hand erfinden. GitHub bietet beim Anlegen eines Repositories Vorlagen je Sprache und Framework an, und das Projekt gitignore von GitHub sammelt geprüfte Vorlagen für nahezu jede Umgebung — von Node über Python bis hin zu spezifischen Editoren und Betriebssystemen.",
          "Eine gute Ausgangsvorlage erspart dir typische Fehler, etwa das versehentliche Einchecken von Abhängigkeits- oder Build-Ordnern. Ergänze sie anschließend um projektspezifische Einträge, vor allem um deine Geheimnisdateien. So startest du von Anfang an mit einer sauberen, vollständigen Ausschlussliste.",
        ],
      },
      {
        heading: "Releases und Versionen veröffentlichen",
        paragraphs: [
          "Wenn dein Projekt einen stabilen Stand erreicht, lohnt sich ein Release. Du markierst einen Punkt der Historie mit einem Tag wie v1.0.0 und erstellst daraus auf GitHub ein Release mit Beschreibung und Änderungsprotokoll. Nutzer können diesen Stand dann gezielt herunterladen.",
          "Folge dabei der semantischen Versionierung nach dem Schema MAJOR.MINOR.PATCH, damit andere die Tragweite eines Updates einschätzen können. Ein gepflegtes Änderungsprotokoll, das die wichtigsten Neuerungen und Korrekturen auflistet, macht dein Projekt zusätzlich vertrauenswürdig und nachvollziehbar — gerade für Menschen, die es zum ersten Mal einsetzen.",
        ],
      },
    ],
    faq: [
      { question: "Öffentlich oder privat — was ist besser für den Anfang?", answer: "Beides ist möglich und kostenlos. Öffentlich eignet sich fürs Portfolio und Open-Source; privat, wenn du in Ruhe experimentieren willst. Geheimnisse gehören in keinem Fall ins Repository." },
      { question: "Ich habe versehentlich eine .env committet — was tun?", answer: "Entferne sie aus der Verfolgung (git rm --cached .env), ergänze die .gitignore und rotiere die betroffenen Geheimnisse, da sie in der Historie verbleiben." },
      { question: "Mein Branch heißt master statt main — ein Problem?", answer: "Nein, das ist nur eine Namenskonvention und technisch völlig gleichwertig. Du kannst den push-Befehl entsprechend anpassen oder den Branch lokal und auf GitHub in main umbenennen." },
    ],
    related: [
      { label: "Projekt veröffentlichen (Wissen)", href: "/github/projekt-veroeffentlichen" },
      { label: ".gitignore", href: "/github/gitignore" },
      { label: "Workflow: Projekt hochladen", href: "/github/shortcuts#projekt-auf-github-hochladen" },
    ],
  },

  {
    slug: "erster-github-actions-workflow",
    category: "automation",
    publishedAt: "2026-06-07",
    readingMinutes: 8,
    title: "Dein erster GitHub-Actions-Workflow: Tests bei jedem Push",
    description:
      "GitHub Actions von Grund auf: Was Workflows, Trigger, Jobs und Steps sind, und wie du eine YAML-Datei schreibst, die bei jedem Push automatisch deine Tests ausführt.",
    intro:
      "Automatisierung klingt nach einem Thema für Profis — mit GitHub Actions ist der Einstieg aber erstaunlich zugänglich. Schon eine kleine YAML-Datei genügt, damit bei jedem Push automatisch deine Tests laufen und du sofort siehst, ob etwas kaputtgegangen ist. In diesem Leitfaden lernst du die Bausteine von GitHub Actions kennen und schreibst einen ersten, nützlichen Workflow — inklusive der wichtigsten Sicherheitsregeln rund um Geheimnisse.",
    sections: [
      {
        heading: "Was GitHub Actions ist",
        paragraphs: [
          "GitHub Actions ist die in GitHub eingebaute Plattform für Automatisierung, oft unter dem Begriff CI/CD (Continuous Integration / Continuous Delivery) zusammengefasst. Sie führt definierte Abläufe automatisch aus, wenn bestimmte Ereignisse in deinem Repository passieren — etwa ein Push oder ein Pull Request.",
          "Typische Einsätze sind das automatische Ausführen von Tests, das Prüfen des Code-Stils (Linting), das Bauen der Anwendung und das Veröffentlichen. Der große Vorteil: Diese Schritte passieren zuverlässig und für alle sichtbar, statt davon abzuhängen, dass jede Person sie manuell ausführt.",
        ],
      },
      {
        heading: "Die Bausteine: Workflow, Trigger, Job, Step",
        paragraphs: [
          "Ein Workflow ist eine YAML-Datei im Ordner .github/workflows. Sie hat einen Auslöser (on), zum Beispiel on: push. Darunter stehen ein oder mehrere Jobs, die auf einem sogenannten Runner laufen — einer frischen virtuellen Maschine, die GitHub bereitstellt.",
          "Jeder Job besteht aus Steps, die nacheinander ausgeführt werden. Ein Step nutzt entweder eine fertige Action (mit uses) oder führt einen Befehl aus (mit run). So setzt sich ein Workflow aus klaren, lesbaren Bausteinen zusammen, die du Schritt für Schritt erweitern kannst.",
        ],
      },
      {
        heading: "Ein minimaler Test-Workflow",
        paragraphs: [
          "Ein nützlicher erster Workflow holt deinen Code, richtet die Laufzeitumgebung ein, installiert Abhängigkeiten und führt die Tests aus. Für ein Node.js-Projekt sind das vier Steps: actions/checkout zum Auschecken, actions/setup-node für die Node-Version, ein run-Step mit npm ci und ein run-Step mit npm test.",
          "Lege diese Datei als .github/workflows/ci.yml an und pushe sie. Ab sofort läuft der Workflow bei jedem Push automatisch; den Status siehst du im Reiter „Actions“ deines Repositories und direkt an jedem Commit und Pull Request als grünes Häkchen oder rotes Kreuz.",
        ],
        list: [
          "on: push / pull_request — wann der Workflow läuft.",
          "runs-on: ubuntu-latest — die Umgebung (Runner).",
          "actions/checkout — holt deinen Code in den Runner.",
          "run: npm ci && npm test — installiert und testet deterministisch.",
        ],
      },
      {
        heading: "Sicherheit: Geheimnisse richtig behandeln",
        paragraphs: [
          "Sobald ein Workflow auf Zugangsdaten zugreift — etwa für ein Deployment —, dürfen diese niemals im Klartext in der YAML-Datei stehen. GitHub bietet dafür verschlüsselte Secrets in den Repository-Einstellungen, die du im Workflow über die secrets-Syntax referenzierst.",
          "Sei außerdem vorsichtig mit Actions von Dritten: Sie können Code in deinem Workflow ausführen. Nutze vertrauenswürdige, gepflegte Actions und pinne sie idealerweise auf eine feste Version. So profitierst du von Automatisierung, ohne dir Sicherheitsrisiken einzuhandeln.",
        ],
      },
      {
        heading: "Sinnvoll erweitern statt überladen",
        paragraphs: [
          "Beginne klein und erweitere bewusst. Häufige nächste Schritte sind das Hinzufügen eines Lint-Steps, das Testen über mehrere Versionen hinweg (Matrix-Builds) und das Einschränken des Workflows auf bestimmte Branches oder Pfade, damit er nicht unnötig läuft.",
          "Achte darauf, Workflows schlank und schnell zu halten: Lange Laufzeiten kosten Zeit und Ressourcen. Ein guter CI-Workflow gibt dir innerhalb weniger Minuten eine klare Antwort darauf, ob deine Änderung sicher ist — genau das macht ihn im Alltag so wertvoll.",
        ],
      },
      {
        heading: "Über mehrere Versionen testen mit einer Matrix",
        paragraphs: [
          "Oft willst du sicherstellen, dass dein Code nicht nur mit einer, sondern mit mehreren Versionen funktioniert — etwa verschiedenen Node- oder Python-Versionen. Dafür gibt es die Matrix-Strategie: Du definierst eine Liste von Werten, und GitHub führt den Job automatisch für jeden Wert parallel aus.",
          "Das spart dir, denselben Job mehrfach zu schreiben, und deckt Kompatibilitätsprobleme früh auf. Eine Matrix kann auch mehrere Dimensionen kombinieren, etwa Betriebssystem und Laufzeitversion. Beginne mit einer einfachen Matrix und erweitere sie nur, wenn du die zusätzliche Abdeckung wirklich brauchst, denn jede Kombination kostet Laufzeit.",
        ],
      },
      {
        heading: "Schneller werden durch Caching",
        paragraphs: [
          "Jeder Workflow-Lauf startet auf einer frischen Maschine und müsste Abhängigkeiten jedes Mal neu installieren. Das kostet Zeit. Mit Caching speicherst du wiederverwendbare Teile — etwa den Paket-Cache von npm oder pip — zwischen den Läufen und sparst so spürbar.",
          "Viele setup-Actions, etwa actions/setup-node, bringen ein eingebautes Caching mit, das du nur aktivieren musst. Für komplexere Fälle gibt es actions/cache mit einem selbst gewählten Schlüssel. Achte darauf, den Cache-Schlüssel an die Abhängigkeitsdateien zu koppeln, damit er bei Änderungen automatisch erneuert wird und nie veraltete Stände liefert.",
        ],
      },
      {
        heading: "Workflows gezielt auslösen",
        paragraphs: [
          "Standardmäßig läuft ein on: push-Workflow bei jedem Push auf jedem Branch. Das ist oft mehr als nötig. Mit Filtern schränkst du das ein: auf bestimmte Branches, auf bestimmte Pfade (etwa nur, wenn sich Code im Ordner src ändert) oder auf bestimmte Ereignisse wie pull_request.",
          "Zusätzlich kannst du Workflows manuell über workflow_dispatch oder zeitgesteuert über schedule starten. Durchdachte Auslöser halten deine Pipeline schnell und sparsam, weil sie nur dann läuft, wenn es wirklich sinnvoll ist — das schont sowohl deine Nerven als auch dein Minutenkontingent.",
        ],
      },
      {
        heading: "Vom Test zum automatischen Deployment",
        paragraphs: [
          "Sobald Tests zuverlässig laufen, ist der nächste logische Schritt das automatische Veröffentlichen. Ein Deployment-Job kann zum Beispiel die gebaute Anwendung auf einen Hosting-Dienst hochladen oder eine Website über GitHub Pages aktualisieren — typischerweise nur, wenn auf main gepusht wird und die Tests erfolgreich waren.",
          "Hier kommen Job-Abhängigkeiten ins Spiel: Mit needs legst du fest, dass das Deployment erst nach erfolgreichem Test-Job startet. So stellst du sicher, dass niemals fehlerhafter Code veröffentlicht wird. Für die Zugangsdaten des Zielsystems nutzt du ausschließlich verschlüsselte Secrets, niemals Klartext.",
        ],
      },
      {
        heading: "Fehlgeschlagene Läufe verstehen",
        paragraphs: [
          "Wenn ein Workflow rot wird, ist das kein Grund zur Sorge, sondern genau sein Zweck: Er hat ein Problem gefunden, bevor es Nutzer erreicht. Im Reiter „Actions“ öffnest du den fehlgeschlagenen Lauf und siehst pro Step die vollständige Ausgabe. Der erste rote Step zeigt meist die eigentliche Ursache.",
          "Häufige Gründe sind fehlende Abhängigkeiten, abweichende lokale gegenüber CI-Umgebungen oder nicht gesetzte Secrets. Ein nützlicher Trick: Bilde die Schritte des Workflows lokal nach, um den Fehler zu reproduzieren. Sind die Logs unübersichtlich, hilft es, den Workflow vorübergehend auf weniger Matrix-Kombinationen zu reduzieren, um die Ursache einzugrenzen.",
        ],
      },
      {
        heading: "Doppelte Läufe vermeiden mit concurrency",
        paragraphs: [
          "Pushst du in schneller Folge mehrere Commits, startet GitHub für jeden einen eigenen Lauf — ältere sind dann oft schon überholt, laufen aber trotzdem weiter und verbrauchen Minuten. Mit der concurrency-Einstellung gruppierst du Läufe und lässt veraltete automatisch abbrechen.",
          "Das ist besonders bei Pull Requests nützlich: Sobald du einen neuen Commit pushst, wird der vorherige, nun überholte Lauf gestoppt und nur der aktuelle ausgeführt. So bleibt deine Pipeline schnell und dein Kontingent geschont, ohne dass du etwas manuell abbrechen musst.",
        ],
      },
      {
        heading: "Logs sauber und sicher halten",
        paragraphs: [
          "Workflow-Logs sind bei öffentlichen Repositories für alle sichtbar. Gib daher niemals Geheimnisse versehentlich aus, etwa durch ein echo eines Tokens zur Fehlersuche. GitHub maskiert registrierte Secrets in der Ausgabe zwar automatisch, doch verlass dich nicht allein darauf.",
          "Halte die Ausgabe außerdem fokussiert: Zu viel Log-Rauschen erschwert die Fehlersuche. Gib gezielt aus, was bei einem Fehler weiterhilft, und nutze aussagekräftige Step-Namen. Saubere, sichere Logs machen aus einem fehlgeschlagenen Lauf eine klare Diagnose statt einer mühsamen Suche.",
        ],
      },
    ],
    faq: [
      { question: "Kostet GitHub Actions etwas?", answer: "Für öffentliche Repositories ist es in großzügigem Umfang kostenlos; private Repositories haben ein monatliches Freikontingent an Minuten." },
      { question: "Wo sehe ich, ob mein Workflow erfolgreich war?", answer: "Im Reiter „Actions“ deines Repositories sowie als Status-Symbol direkt an Commits und Pull Requests." },
      { question: "Wie verhindere ich, dass Secrets geleakt werden?", answer: "Lege sie als verschlüsselte Secrets in den Einstellungen ab, referenziere sie nur über die secrets-Syntax und schreibe sie niemals in Logs oder die YAML-Datei." },
    ],
    related: [
      { label: "GitHub Actions (Wissen)", href: "/github/github-actions" },
      { label: "GitHub CLI", href: "/github/github-cli" },
      { label: "Pull Request", href: "/github/pull-request" },
    ],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function blogWordCount(a: BlogArticle): number {
  const parts: string[] = [a.intro];
  for (const s of a.sections) parts.push(s.heading, ...s.paragraphs, ...(s.list ?? []));
  for (const f of a.faq) parts.push(f.question, f.answer);
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}
