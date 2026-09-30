import { cn } from "@/lib/cn";
import { QUOTE_CATEGORIES, type QuoteCategorySlug } from "@/lib/constants";

export function QuoteCategoryPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: QuoteCategorySlug;
  onChange: (slug: QuoteCategorySlug) => void;
}) {
  return (
    <fieldset className="block space-y-3">
      <legend className="text-[0.68rem] tracking-[0.16em] uppercase text-gold/80">{label}</legend>
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-charcoal">
        {QUOTE_CATEGORIES.map((category, index) => (
          <label
            key={category.slug}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-base text-ivory/90 transition-colors hover:bg-gold/5 md:text-sm",
              index > 0 && "border-t border-gold/15",
            )}
          >
            <span>{category.name}</span>
            <input
              type="radio"
              name="quote-product-category"
              value={category.slug}
              checked={value === category.slug}
              onChange={() => onChange(category.slug)}
              className="size-4 shrink-0 accent-gold"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
