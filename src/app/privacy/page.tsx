import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von „What's in it?“ — welche Daten verarbeitet werden und warum.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Datenschutzerklärung" placeholder>
      <p>
        Diese Erklärung beschreibt, wie „What&apos;s in it?“ Daten verarbeitet. Sie ist eine Vorlage
        und muss vor dem Produktivbetrieb rechtlich geprüft und mit den echten Anbieterangaben
        vervollständigt werden.
      </p>

      <h2>Verantwortlicher</h2>
      <p>[PLATZHALTER: Name, Anschrift, E-Mail — siehe Impressum]</p>

      <h2>Welche Daten wir verarbeiten</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Keine Benutzerkonten:</strong> Wir speichern keine Profile, Namen oder Login-Daten.</li>
        <li>
          <strong>Missbrauchs- und Kostenschutz:</strong> Zur Begrenzung automatisierter Anfragen
          speichern wir technische Ereignisse mit <em>gehashten</em> Werten (IP-Adresse, Sitzung,
          User-Agent als HMAC-Hash). Die rohe IP-Adresse wird <strong>nicht</strong> gespeichert.
        </li>
        <li><strong>Analyse-Inhalte:</strong> Öffentliche GitHub-Metadaten und Analyseergebnisse werden zwischengespeichert.</li>
      </ul>

      <h2>Externe Dienste</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>GitHub API</strong> — zum Abruf öffentlicher Repository-Daten.</li>
        <li><strong>OpenRouter</strong> — serverseitige Erstellung der Analyse (es werden nur öffentliche Repo-Daten übermittelt, keine personenbezogenen Daten).</li>
        <li><strong>Werbung (Google AdSense)</strong> — [PLATZHALTER] sofern aktiviert; Hinweise zu Cookies/Consent siehe unten.</li>
      </ul>

      <h2>Cookies &amp; Einwilligung</h2>
      <p>
        [PLATZHALTER: Consent-Management-Plattform]. Werbe- und Analyse-Cookies werden erst nach
        Einwilligung gesetzt, sofern erforderlich (EWR/UK/Schweiz).
      </p>

      <h2>Speicherdauer</h2>
      <p>Technische Ereignis-Hashes werden für maximal 90 Tage zur Missbrauchserkennung gespeichert und danach gelöscht.</p>

      <h2>Deine Rechte</h2>
      <p>
        Du hast Rechte auf Auskunft, Berichtigung, Löschung und Widerspruch. Wende dich dazu an
        die im Impressum genannte Adresse.
      </p>
    </LegalShell>
  );
}
