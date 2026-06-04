import CopyButton from "./CopyButton";

interface CommandBlockProps {
  code: string;
  label?: string;
  copyable?: boolean;
}

// PHASE-4 — renders a copyable command. Used on static /github knowledge pages.
export default function CommandBlock({ code, label, copyable = true }: CommandBlockProps) {
  return (
    <div className="rounded-lg border border-slate-700/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 border-b border-slate-700/60">
        <span className="text-xs font-medium text-slate-300">{label ?? "Terminal"}</span>
        {copyable && <CopyButton text={code} />}
      </div>
      <pre className="px-4 py-3 text-sm text-sky-300 font-mono overflow-x-auto bg-slate-900/40 whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}
