import { cn } from "@/lib/cn";
import type { SelectHTMLAttributes } from "react";

export function Select({
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-[0.68rem] tracking-[0.16em] uppercase text-gold/80">{label}</span>
      <select
        className={cn(
          "w-full rounded-sm border border-gold/25 bg-charcoal px-4 py-3 text-sm text-ivory outline-none focus:border-gold",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
