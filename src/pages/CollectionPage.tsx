import { ProductCard } from "@/components/cards/ProductCard";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";

export function CollectionPage() {
  const { slug = "" } = useParams();
  const collection = useQuery(api.collections.getBySlug, { slug });
  const products = useQuery(api.products.listPublic, { collectionSlug: slug });
  if (collection === undefined) {
    return <div className="container-wide py-24">Loading…</div>;
  }
  if (!collection) {
    return (
      <div className="container-wide py-24">
        <EmptyState title="Collection not found" body="This campaign or category is not published." />
      </div>
    );
  }
  return (
    <div className="container-wide py-16">
      <Seo title={collection.seoTitle} description={collection.seoDescription} path={`/collections/${collection.slug}`} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: collection.name }]} />
      <p className="eyebrow mt-8">Collection</p>
      <h1 className="display mt-3 text-6xl">{collection.headline}</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">{collection.description}</p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {(products ?? []).map((product, index) => (
          <ProductCard
            key={product._id}
            name={product.name}
            slug={product.slug}
            shortDescription={product.shortDescription}
            coverUrl={product.cover?.url}
            availability={product.availability}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
