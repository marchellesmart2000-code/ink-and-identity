import { ProductCard } from "@/components/cards/ProductCard";
import { breadcrumbJsonLd, JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { publishedCategory, publishedProduct, relatedProducts } from "@/lib/catalogue";
import { convexEnabled } from "@/lib/convex-enabled";
import { availabilityCopy } from "@/lib/format";
import { resolveStudio } from "@/lib/studio";
import { orderWhatsappMessage, siteOrigin, whatsappHref } from "@/lib/whatsapp";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Link, Navigate, useParams } from "react-router-dom";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const catalogueProduct = publishedProduct(slug);
  const categoryMatch = publishedCategory(slug);
  const live = useQuery(
    api.products.getBySlug,
    catalogueProduct || categoryMatch || !convexEnabled() ? "skip" : { slug },
  );
  const studio = resolveStudio(useSiteSettings());

  if (categoryMatch) {
    return <Navigate to={`/shop/category/${slug}`} replace />;
  }

  const product = catalogueProduct
    ? {
        ...catalogueProduct,
        gallery: catalogueProduct.coverUrl
          ? [{ url: catalogueProduct.coverUrl, alt: catalogueProduct.coverAlt, caption: undefined }]
          : [],
        leadTime: "",
        minimumQuantity: undefined as number | undefined,
        related: relatedProducts(slug),
        exampleProjects: [] as { slug: string; title: string }[],
      }
    : live;

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
    studio.whatsapp,
    orderWhatsappMessage({
      name: product.name,
      category: product.categoryName,
      url: `${siteOrigin()}/shop/${product.slug}`,
    }),
  );
  return (
      <div className="container-wide py-10 md:py-16">
      <Seo title={product.seoTitle} description={product.seoDescription} path={`/shop/${product.slug}`} />
      <JsonLd
        data={[
          breadcrumbJsonLd(siteOrigin(), [
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.categoryName, path: `/shop/category/${product.categorySlug}` },
            { name: product.name, path: `/shop/${product.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.seoDescription || product.shortDescription,
            category: product.categoryName,
            image: product.gallery[0]?.url ? `${siteOrigin()}${product.gallery[0].url}` : undefined,
            url: `${siteOrigin()}/shop/${product.slug}`,
            brand: { "@type": "Brand", name: "Ink & Identity" },
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.categoryName, href: `/shop/category/${product.categorySlug}` },
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
          <p className="eyebrow">
            <Link to={`/shop/category/${product.categorySlug}`} className="hover:text-gold">
              {product.categoryName}
            </Link>
          </p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-gold">
            {availabilityCopy[product.availability]}
          </p>
          <p className="mt-6 text-base leading-relaxed text-ivory/70">{product.shortDescription}</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">{product.longDescription}</p>
          {product.leadTime ? <p className="mt-3 text-sm text-ivory/60">Lead time: {product.leadTime}</p> : null}
          {product.minimumQuantity ? (
            <p className="mt-2 text-sm text-ivory/60">Minimum quantity: {product.minimumQuantity}</p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={wa ?? `/quote?product=${product.slug}`} className="w-full sm:w-auto">Order on WhatsApp</Button>
            <Button href={`/quote?product=${product.slug}`} variant="line" className="w-full sm:w-auto">
              Request a quote
            </Button>
          </div>
        </div>
      </div>
      {product.related.length > 0 ? (
        <section className="mt-20">
          <h2 className="display text-4xl">Related</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {product.related.map((item, index) => (
              <ProductCard
                key={"_id" in item ? item._id : item.slug}
                name={item.name}
                slug={item.slug}
                shortDescription={item.shortDescription}
                coverUrl={"coverUrl" in item ? item.coverUrl : item.cover?.url}
                availability={item.availability}
                index={index}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
