import { useState } from "react";

export function FileUpload({
  label,
  hint,
  files,
  onChange,
  accept = "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf",
}: {
  label: string;
  hint: string;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
}) {
  const [error, setError] = useState("");

  function handle(list: FileList | null) {
    if (!list) {
      return;
    }
    const next = [...files, ...Array.from(list)];
    if (next.length > 5) {
      setError("You can attach up to 5 files.");
      return;
    }
    if (next.some((file) => file.size > 10 * 1024 * 1024)) {
      setError("Each file must be 10MB or smaller.");
      return;
    }
    setError("");
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <span className="text-[0.68rem] tracking-[0.16em] uppercase text-gold/80">{label}</span>
      <label className="flex cursor-pointer flex-col items-center rounded-sm border border-dashed border-gold/30 bg-charcoal px-6 py-10 text-center">
        <span className="text-sm text-ivory/70">{hint}</span>
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple
          onChange={(event) => handle(event.target.files)}
        />
      </label>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <ul className="space-y-2 text-sm">
        {files.map((file) => (
          <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3">
            <span>{file.name}</span>
            <button
              type="button"
            className="text-gold/70 hover:text-error"
              onClick={() => onChange(files.filter((item) => item !== file))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
