import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "gold",
}: {
  children: string;
  tone?: "gold" | "ivory" | "ink";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[0.62rem] tracking-[0.18em] uppercase",
        tone === "gold" && "border border-gold/40 text-gold",
        tone === "ivory" && "border border-ivory/30 text-ivory/80",
        tone === "ink" && "border border-gold/30 text-gold",
      )}
    >
      {children}
    </span>
  );
}
