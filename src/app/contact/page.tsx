import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktmöglichkeiten zu „What's in it?“.",
};

export default function ContactPage() {
  return (
    <LegalShell title="Kontakt" placeholder>
      <p>Du erreichst uns bei Fragen, Feedback oder rechtlichen Anliegen unter:</p>
      <h2>E-Mail</h2>
      <p>[PLATZHALTER: kontakt@deine-domain.de]</p>
      <h2>Verantwortlich</h2>
      <p>[PLATZHALTER: Vor- und Nachname / Firma]</p>
      <p className="text-slate-500">
        Wir antworten in der Regel innerhalb weniger Werktage. Für Melde- und Löschanfragen zu
        Inhalten nutze bitte dieselbe Adresse.
      </p>
    </LegalShell>
  );
}
