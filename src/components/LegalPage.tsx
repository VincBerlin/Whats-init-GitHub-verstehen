// PHASE-6 — shared shell for legal/trust pages.
export function LegalShell({ title, children, placeholder = false }: { title: string; children: React.ReactNode; placeholder?: boolean }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">{title}</h1>
      {placeholder && (
        <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200/90">
          Hinweis: Diese Seite enthält <strong>[PLATZHALTER]</strong> und ist <strong>noch nicht produktionsreif</strong>.
          Vor dem öffentlichen Launch / AdSense-Antrag müssen die echten Angaben eingetragen und rechtlich geprüft werden.
        </div>
      )}
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-100 [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-blue-400 [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
