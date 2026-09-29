import { ProductCard } from "@/components/cards/ProductCard";
import { JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { publishedCategory, publishedProducts } from "@/lib/catalogue";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { resolveStudio } from "@/lib/studio";
import { CONTACT_WHATSAPP_MESSAGE, siteOrigin, whatsappHref } from "@/lib/whatsapp";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const [search, setSearch] = useState("");
  const studio = resolveStudio(useSiteSettings());
  const studioCategory = publishedCategory(slug);
  const category = useQuery(api.collections.getCategoryBySlug, studioCategory ? "skip" : { slug });
  const products = useQuery(
    api.products.listPublic,
    studioCategory
      ? "skip"
      : {
          categorySlug: slug,
          search: search || undefined,
          sort: "featured",
        },
  );
  const studioProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return publishedProducts(slug).filter((product) => {
      if (!needle) {
        return true;
      }
      return `${product.name} ${product.shortDescription}`.toLowerCase().includes(needle);
    });
  }, [slug, search]);
  const view = studioCategory ?? category;

  const title = view?.seoTitle?.trim() || (view ? `${view.name} | Sublimated prints | Ink & Identity` : "Category");
  const description =
    view?.seoDescription?.trim() ||
    view?.description ||
    "Sublimated products from Ink & Identity.";
  const path = `/shop/category/${slug}`;
  const origin = siteOrigin();
  const wa = whatsappHref(
    studio.whatsapp,
    view
      ? `Hello Ink & Identity, I would like to order something from ${view.name}. Finish: Sublimation.`
      : CONTACT_WHATSAPP_MESSAGE,
  );

  const itemList = useMemo(() => {
    const listed = studioCategory ? studioProducts : products;
    if (!view || !listed) {
      return null;
    }
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: view.name,
      description,
      url: `${origin}${path}`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: listed.length,
        itemListElement: listed.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${origin}/shop/${product.slug}`,
          name: product.name,
        })),
      },
    };
  }, [view, studioCategory, studioProducts, products, description, origin, path]);

  if (!studioCategory && category === undefined) {
    return <div className="container-wide py-24">Loading…</div>;
  }
  if (!view) {
    return (
      <div className="container-wide py-24">
        <EmptyState title="Category not found" body="This category is not published." />
      </div>
    );
  }

  return (
    <div className="container-wide py-16">
      <Seo title={title} description={description} path={path} />
      {itemList ? <JsonLd data={itemList} /> : null}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: view.name },
        ]}
      />
      <p className="eyebrow mt-8">Sublimated · {view.productCount} pieces</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">{view.name}</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">{view.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {wa ? <Button href={wa}>Order on WhatsApp</Button> : null}
        <Button href="/quote" variant="line">
          Request a quote
        </Button>
      </div>
      <div className="mt-8 max-w-md">
        <Input
          label={`Search ${view.name}`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, tag, use"
        />
      </div>
      {!studioCategory && products === undefined ? (
        <p className="mt-12 text-sm text-ivory/60">Loading pieces…</p>
      ) : (studioCategory ? studioProducts : products ?? []).length === 0 ? (
        <div className="mt-12 space-y-6">
          <EmptyState
            title="No pieces in this search"
            body="Images are added in the studio. Until a photo is here, you can still order the piece on WhatsApp."
          />
          {wa ? <Button href={wa}>Order this category on WhatsApp</Button> : null}
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(studioCategory ? studioProducts : products ?? []).map((product, index) => (
            <ProductCard
              key={"_id" in product ? product._id : product.slug}
              name={product.name}
              slug={product.slug}
              shortDescription={product.shortDescription}
              coverUrl={"coverUrl" in product ? product.coverUrl : product.cover?.url}
              coverAlt={"coverAlt" in product ? product.coverAlt : product.cover?.alt}
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
