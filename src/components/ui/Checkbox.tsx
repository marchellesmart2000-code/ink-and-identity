import type { InputHTMLAttributes } from "react";

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed text-ivory/75">
      <input
        type="checkbox"
        className="mt-1 size-4 accent-gold"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
