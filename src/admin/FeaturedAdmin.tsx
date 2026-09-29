import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { publishedProducts } from "@/lib/catalogue";
import { DEFAULT_FEATURED, readStoredFeatured, writeStoredFeatured } from "@/lib/featured";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";

export function FeaturedAdminPage() {
  const remote = useQuery(api.settings.getAdmin);
  const save = useMutation(api.settings.setFeaturedSlugs);
  const { push } = useToast();
  const products = useMemo(() => publishedProducts(), []);
  const [selected, setSelected] = useState<string[]>(() => readStoredFeatured() ?? DEFAULT_FEATURED);

  useEffect(() => {
    if (remote && Array.isArray(remote.featuredProductSlugs)) {
      setSelected(remote.featuredProductSlugs);
    }
  }, [remote]);

  function toggle(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  async function onSave() {
    writeStoredFeatured(selected);
    try {
      await save({ slugs: selected });
      push("Featured reel updated.");
    } catch {
      push("Saved on this browser. Sign in with the studio backend to publish it for everyone.", "error");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-4xl sm:text-5xl">Featured reel</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/70">
            These pieces drift across the home page. Drag order follows the order you tick them. Visitors see this list once it is saved to the studio.
          </p>
        </div>
        <Button type="button" onClick={() => void onSave()} className="w-full sm:w-auto">
          Save featured
        </Button>
      </div>
      <p className="mt-4 text-sm text-gold">{selected.length} on the reel</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const on = selected.includes(product.slug);
          return (
            <li key={product.slug}>
              <button
                type="button"
                onClick={() => toggle(product.slug)}
                className={`flex w-full items-center gap-3 rounded-sm border p-3 text-left ${on ? "border-gold bg-charcoal" : "border-gold/20"}`}
              >
                <img src={product.coverUrl} alt="" className="h-16 w-16 shrink-0 rounded-sm bg-ink object-contain" />
                <span>
                  <span className="block text-[0.62rem] tracking-[0.16em] uppercase text-gold">{product.categoryName}</span>
                  <span className="display block text-2xl">{product.name}</span>
                  <span className="text-xs text-ivory/55">{on ? "On the reel" : "Hidden"}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
