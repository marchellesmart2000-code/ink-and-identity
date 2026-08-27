import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

export function ImageUploader({
  label,
  onUploaded,
}: {
  label: string;
  onUploaded: (storageId: Id<"_storage">, alt: string) => void;
}) {
  const generate = useMutation(api.files.generatePublicUploadUrl);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) {
      return;
    }
    setBusy(true);
    try {
      const url = await generate();
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const json = (await response.json()) as { storageId: Id<"_storage"> };
      onUploaded(json.storageId, alt || file.name);
      setAlt("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold">{label}</p>
      <input
        className="w-full rounded-sm border border-gold/25 bg-charcoal px-3 py-2 text-sm text-ivory"
        placeholder="Alt text"
        value={alt}
        onChange={(event) => setAlt(event.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(event) => void onFile(event.target.files?.[0])}
      />
    </div>
  );
}
