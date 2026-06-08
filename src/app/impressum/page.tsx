import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG / § 18 MStV.",
};

export default function ImpressumPage() {
  return (
    <LegalShell title="Impressum" placeholder>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        [PLATZHALTER: Vor- und Nachname / Firmenname]<br />
        [PLATZHALTER: Straße und Hausnummer]<br />
        [PLATZHALTER: PLZ und Ort]<br />
        [PLATZHALTER: Land]
      </p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: [PLATZHALTER: kontakt@deine-domain.de]<br />
        Telefon: [PLATZHALTER: optional]
      </p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>[PLATZHALTER: Name und Anschrift der verantwortlichen Person]</p>
      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
        Vollständigkeit und Aktualität können wir jedoch keine Gewähr übernehmen. Für Inhalte
        externer Links sind ausschließlich deren Betreiber verantwortlich.
      </p>
    </LegalShell>
  );
}
