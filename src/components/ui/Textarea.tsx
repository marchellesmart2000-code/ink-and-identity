import { cn } from "@/lib/cn";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  label,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-[0.68rem] tracking-[0.16em] uppercase text-gold/80">{label}</span>
      <textarea
        className={cn(
          "min-h-32 w-full rounded-sm border border-gold/25 bg-charcoal px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </label>
  );
}
