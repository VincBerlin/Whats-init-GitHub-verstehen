import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Was ist „What's in it?“ — ein kostenloser, werbefinanzierter GitHub-Repository-Intelligence- und Wissens-Hub auf Deutsch.",
};

export default function AboutPage() {
  return (
    <LegalShell title="Über „What's in it?“">
      <p>
        „What&apos;s in it?“ hilft dir, GitHub-Repositories schnell zu verstehen: Was ein Projekt
        macht, wofür es gut ist, wie du es installierst und worauf du achten solltest — in
        Sekunden statt nach langem Lesen von READMEs.
      </p>
      <h2>Was wir bieten</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>KI-gestützte Analyse beliebiger öffentlicher GitHub-Repositories</li>
        <li>Strukturiertes Git- &amp; GitHub-Wissen mit Befehlen und Workflows zum Kopieren</li>
        <li>Eine wöchentliche Top-10-Liste wachstumsstarker Repositories</li>
      </ul>
      <h2>Unser Modell</h2>
      <p>
        Der Dienst ist kostenlos und finanziert sich über dezente Werbung. Es gibt keine
        Accounts, keine Abos, keine Paywall. Wir analysieren ausschließlich öffentliche Daten.
      </p>
      <h2>Wie die Analyse funktioniert</h2>
      <p>
        Wir lesen öffentliche GitHub-Metadaten und die README eines Repositorys und erstellen
        daraus eine strukturierte Einschätzung. Ergebnisse werden zwischengespeichert, damit
        dasselbe Repository nicht mehrfach unnötig analysiert wird.
      </p>
    </LegalShell>
  );
}
