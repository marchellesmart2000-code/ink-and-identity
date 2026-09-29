import { CategoryCover } from "@/components/cards/CategoryCover";
import { ProductCard } from "@/components/cards/ProductCard";
import { JsonLd, Seo } from "@/components/seo/Seo";
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
  const [sort, setSort] = useState<"featured" | "name" | "newest">("featured");
  const categories = publishedCategories();
  const settings = useSiteSettings();
  const featuredSlugs = useFeaturedSlugs(settings?.featuredProductSlugs);
  const products = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const rows = applyFeatured(publishedProducts(), featuredSlugs).filter((product) => {
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
  }, [search, sort, featuredSlugs]);
  const origin = siteOrigin();
  const visible = products;

  return (
    <div className="container-wide py-10 md:py-16">
      <Seo
        title="Shop sublimated prints | Ink & Identity"
        description="Browse sublimated mugs, tumblers, coasters, dog tags, pillows and gifts from Ink & Identity in White River. Order on WhatsApp."
        path="/shop"
      />
      {categories && categories.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Ink & Identity catalogue",
            url: `${origin}/shop`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: categories.map((category, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: category.name,
                url: `${origin}/shop/category/${category.slug}`,
              })),
            },
          }}
        />
      ) : null}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="display mt-8 text-4xl sm:text-5xl md:text-6xl">The catalogue</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/70">
        Every piece is sublimated. Open a category to see the work, then order on WhatsApp — the message already names the product.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <CategoryCover
            key={category.slug}
            name={category.name}
            description={category.description}
            coverUrl={category.coverUrl}
            coverAlt={category.coverAlt}
            href={`/shop/category/${category.slug}`}
            productCount={category.productCount}
            index={index}
          />
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Input label="Search all pieces" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, tag, use" />
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
