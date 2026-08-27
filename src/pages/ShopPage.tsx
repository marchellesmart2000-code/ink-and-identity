import { ProductCard } from "@/components/cards/ProductCard";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";

export function ShopPage() {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [sort, setSort] = useState<"featured" | "name" | "newest">("featured");
  const categories = useQuery(api.collections.listCategories);
  const products = useQuery(api.products.listPublic, {
    search: search || undefined,
    categorySlug: categorySlug || undefined,
    sort,
  });

  const visible = useMemo(() => products ?? [], [products]);

  return (
    <div className="container-wide py-16">
      <Seo
        title="Shop | Ink & Identity"
        description="A catalogue of custom apparel, drinkware, stationery and gifts from Ink & Identity. Request a quote — this is not a checkout."
        path="/shop"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="display mt-8 text-6xl">The catalogue</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/70">
        Prices appear only when the studio has confirmed them. Everything else is a conversation — request a quote on the piece you have in mind.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Input label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, tag, use" />
        <Select label="Category" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
          <option value="">All categories</option>
          {(categories ?? []).map((category) => (
            <option key={category._id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          label="Sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as "featured" | "name" | "newest")}
        >
          <option value="featured">Featured</option>
          <option value="name">Name</option>
          <option value="newest">Newest</option>
        </Select>
      </div>
      {visible.length === 0 && products !== undefined ? (
        <div className="mt-12">
          <EmptyState title="Nothing matches just yet" body="Try another word, or send a custom request — we make pieces that are not yet in the catalogue." />
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, index) => (
            <ProductCard
              key={product._id}
              name={product.name}
              slug={product.slug}
              shortDescription={product.shortDescription}
              coverUrl={product.cover?.url}
              coverAlt={product.cover?.alt}
              availability={product.availability}
              featured={product.featured}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
