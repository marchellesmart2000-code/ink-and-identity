import { quoteStatusCopy } from "@/lib/format";
import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[0.62rem] tracking-[0.16em] uppercase",
        status === "new" && "bg-gold text-ink",
        status === "completed" && "bg-success/15 text-success",
        status === "archived" && "border border-gold/25 text-ivory/55",
        status !== "new" && status !== "completed" && status !== "archived" && "border border-gold/30 text-gold",
      )}
    >
      {quoteStatusCopy[status] ?? status}
    </span>
  );
}
