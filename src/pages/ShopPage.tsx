import { ProductCard } from "@/components/cards/ProductCard";
import { breadcrumbJsonLd, JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { applyFeatured, publishedCategories, publishedProducts } from "@/lib/catalogue";
import { useFeaturedSlugs } from "@/lib/featured";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { siteOrigin } from "@/lib/whatsapp";
import { useMemo, useState } from "react";

export function ShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"featured" | "name" | "newest">("featured");
  const categories = useMemo(
    () => [...publishedCategories()].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const settings = useSiteSettings();
  const featuredSlugs = useFeaturedSlugs(settings?.featuredProductSlugs);
  const catalogue = useMemo(
    () => applyFeatured(publishedProducts(), featuredSlugs),
    [featuredSlugs],
  );
  const needle = search.trim().toLowerCase();
  const products = useMemo(() => {
    const rows = catalogue.filter((product) => {
      if (category !== "all" && product.categorySlug !== category) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return `${product.name} ${product.shortDescription} ${product.categoryName}`.toLowerCase().includes(needle);
    });
    if (sort === "name") {
      return [...rows].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "featured") {
      return [...rows].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return rows;
  }, [catalogue, category, needle, sort]);
  const origin = siteOrigin();
  const visible = products;
  const suggestions = useMemo(() => {
    if (!needle) {
      return [];
    }
    return catalogue
      .filter((product) => {
        if (category !== "all" && product.categorySlug !== category) {
          return false;
        }
        return (
          product.name.toLowerCase() !== needle &&
          `${product.name} ${product.categoryName}`.toLowerCase().includes(needle)
        );
      })
      .slice(0, 8);
  }, [catalogue, category, needle]);

  return (
    <div className="container-wide py-10 md:py-16">
      <Seo
        title="Shop sublimated prints | Ink & Identity"
        description="Shop sublimated coffee mugs, skinny tumblers, coasters, dog tags, water bottles, pillows and gifts from Ink & Identity in White River, Mpumalanga."
        path="/shop"
      />
      <JsonLd
        data={[
          breadcrumbJsonLd(origin, [
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Ink & Identity catalogue",
            description:
              "Sublimated mugs, tumblers, coasters, dog tags, pillows and gifts made in White River.",
            url: `${origin}/shop`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: categories.length + catalogue.length,
              itemListElement: [
                ...categories.map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: item.name,
                  url: `${origin}/shop/category/${item.slug}`,
                })),
                ...catalogue.map((product, index) => ({
                  "@type": "ListItem",
                  position: categories.length + index + 1,
                  name: product.name,
                  url: `${origin}/shop/${product.slug}`,
                })),
              ],
            },
          },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="display mt-8 text-4xl sm:text-5xl md:text-6xl">The catalogue</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/70">
        Search the work or choose a category. Each category and piece has its own page, and you can order on WhatsApp from there.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_12rem]">
        <div className="relative">
          <Input
            label="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Start typing a product name"
            autoComplete="off"
          />
          {suggestions.length > 0 ? (
            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-sm border border-gold/30 bg-charcoal shadow-soft">
              {suggestions.map((product) => (
                <li key={product.slug}>
                  <button
                    type="button"
                    className="flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left text-sm text-ivory hover:bg-gold/10"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSearch(product.name);
                      setCategory(product.categorySlug);
                    }}
                  >
                    <span>{product.name}</span>
                    <span className="shrink-0 text-[0.62rem] tracking-[0.14em] uppercase text-gold">{product.categoryName}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Select label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select label="Sort" value={sort} onChange={(event) => setSort(event.target.value as "featured" | "name" | "newest")}>
          <option value="featured">Featured</option>
          <option value="name">Name</option>
          <option value="newest">Newest</option>
        </Select>
      </div>

      {visible.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="Nothing matches just yet" body="Try another word, or open a category and order a custom sublimated piece." />
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, index) => (
            <ProductCard
              key={product.slug}
              name={product.name}
              slug={product.slug}
              shortDescription={product.shortDescription}
              coverUrl={product.coverUrl}
              coverAlt={product.coverAlt}
              availability={product.availability}
              featured={product.featured}
              categoryName={product.categoryName}
              categorySlug={product.categorySlug}
              price={product.price}
              currency={product.currency}
              priceDisplay={product.priceDisplay}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
