import { ProductCard } from "@/components/cards/ProductCard";
import { JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { availabilityCopy } from "@/lib/format";
import { siteOrigin, whatsappHref } from "@/lib/whatsapp";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const product = useQuery(api.products.getBySlug, { slug });
  const settings = useSiteSettings();
  if (product === undefined) {
    return <div className="container-wide py-24">Loading…</div>;
  }
  if (!product) {
    return (
      <div className="container-wide py-24">
        <EmptyState title="This piece is not available" body="It may be archived, or the link has changed." />
      </div>
    );
  }
  const wa = whatsappHref(
    settings?.whatsapp ?? "",
    `Hello Ink & Identity, I would like to enquire about ${product.name}. ${siteOrigin()}/shop/${product.slug}`,
  );
  return (
    <div className="container-wide py-16">
      <Seo title={product.seoTitle} description={product.seoDescription} path={`/shop/${product.slug}`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          category: product.categoryName,
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
      <div className="mt-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <ImageGallery
            images={product.gallery.map((image) => ({
              url: image.url,
              alt: image.alt,
              caption: image.caption,
            }))}
          />
        </div>
        <div className="md:col-span-6">
          <p className="eyebrow">{product.categoryName}</p>
          <h1 className="display mt-3 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-gold">
            {availabilityCopy[product.availability]}
          </p>
          <p className="mt-6 text-base leading-relaxed text-ivory/70">{product.shortDescription}</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">{product.longDescription}</p>
          {product.priceDisplay === "show_price" && product.price ? (
            <p className="mt-6 text-lg">
              {product.currency} {product.price}
            </p>
          ) : (
            <p className="mt-6 text-sm tracking-[0.14em] uppercase text-gold">Request a quote</p>
          )}
          {product.leadTime ? <p className="mt-3 text-sm text-ivory/60">Lead time: {product.leadTime}</p> : null}
          {product.minimumQuantity ? (
            <p className="mt-2 text-sm text-ivory/60">Minimum quantity: {product.minimumQuantity}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/quote?product=${product.slug}`}>Request this product</Button>
            {wa ? (
              <Button href={wa} variant="line">
                WhatsApp this piece
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {product.related.length > 0 ? (
        <section className="mt-20">
          <h2 className="display text-4xl">Related</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {product.related.map((item, index) => (
              <ProductCard
                key={item._id}
                name={item.name}
                slug={item.slug}
                shortDescription={item.shortDescription}
                coverUrl={item.cover?.url}
                availability={item.availability}
                index={index}
              />
            ))}
          </div>
        </section>
      ) : null}
      {product.exampleProjects.length > 0 ? (
        <section className="mt-16">
          <h2 className="display text-4xl">In the work</h2>
          <ul className="mt-4 space-y-2">
            {product.exampleProjects.map((project) => (
              <li key={project.slug}>
                <Link to={`/portfolio/${project.slug}`} className="hover:text-gold">
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
