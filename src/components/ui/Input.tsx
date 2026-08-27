import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const inputId = id ?? props.name;
  return (
    <label className="block space-y-2">
      <span className="text-[0.68rem] tracking-[0.16em] uppercase text-gold/80">{label}</span>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-sm border border-gold/25 bg-charcoal px-4 py-3 text-base text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold md:text-sm",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </label>
  );
}
