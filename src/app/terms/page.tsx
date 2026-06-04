import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description: "Nutzungsbedingungen von „What's in it?“.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Nutzungsbedingungen" placeholder>
      <p>
        Mit der Nutzung von „What&apos;s in it?“ stimmst du diesen Bedingungen zu. Diese Vorlage muss
        vor dem Produktivbetrieb rechtlich geprüft werden.
      </p>
      <h2>Leistung</h2>
      <p>
        Der Dienst erstellt automatisierte Einschätzungen öffentlicher GitHub-Repositories und
        stellt Wissensinhalte bereit. Es handelt sich um Hilfestellungen, nicht um verbindliche
        Beratung.
      </p>
      <h2>Keine Gewähr</h2>
      <p>
        Analysen werden von KI-Modellen erzeugt und können Fehler enthalten. Prüfe wichtige
        Aussagen (z. B. Sicherheit, Lizenz) immer selbst an der Quelle. Eine Haftung für
        Richtigkeit oder Vollständigkeit ist im gesetzlich zulässigen Rahmen ausgeschlossen.
      </p>
      <h2>Zulässige Nutzung</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Keine automatisierte Massennutzung, die den Dienst beeinträchtigt.</li>
        <li>Keine Umgehung von Rate-Limits oder Schutzmechanismen.</li>
        <li>Nur öffentliche Repositories; keine missbräuchlichen Inhalte.</li>
      </ul>
      <h2>Änderungen</h2>
      <p>Wir können den Dienst und diese Bedingungen jederzeit anpassen.</p>
    </LegalShell>
  );
}
