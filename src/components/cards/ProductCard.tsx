import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/ui/ProductImageFrame";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { PLACEHOLDER_TONES } from "@/lib/constants";
import { availabilityCopy } from "@/lib/format";
import { resolveStudio } from "@/lib/studio";
import { orderWhatsappMessage, siteOrigin, whatsappHref } from "@/lib/whatsapp";

export function ProductCard({
  name,
  slug,
  shortDescription,
  coverUrl,
  coverAlt,
  availability,
  featured,
  categoryName,
  categorySlug,
  index = 0,
}: {
  name: string;
  slug: string;
  shortDescription: string;
  coverUrl?: string | null;
  coverAlt?: string;
  availability: string;
  featured?: boolean;
  categoryName?: string;
  categorySlug?: string;
  price?: number | null;
  currency?: string;
  priceDisplay?: string;
  index?: number;
}) {
  const studio = resolveStudio(useSiteSettings());
  const tone = PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length];
  const orderHref =
    whatsappHref(
      studio.whatsapp,
      orderWhatsappMessage({
        name,
        category: categoryName,
        url: `${siteOrigin()}/shop/${slug}`,
      }),
    ) ?? `/quote?product=${slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.12) }}
      className="group flex h-full flex-col"
    >
      <Link to={`/shop/${slug}`} className="block">
        {coverUrl ? (
          <ProductImageFrame
            src={coverUrl}
            alt={coverAlt ?? name}
            overlay={
              featured ? (
                <div className="absolute left-4 top-4 flex gap-2">
                  <Badge>Featured</Badge>
                </div>
              ) : null
            }
          />
        ) : (
          <div className={`aspect-[4/5] overflow-hidden rounded-sm border border-gold/15 bg-linear-to-br ${tone} paper-grain`} />
        )}
        <div className="pt-4">
          {categorySlug && categoryName ? (
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-gold/80">{categoryName}</p>
          ) : (
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-gold/80">
              {availabilityCopy[availability] ?? "Available to quote"}
            </p>
          )}
          <h3 className="display mt-1 text-3xl text-ivory">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">{shortDescription}</p>
        </div>
      </Link>
      <div className="mt-4">
        <Button href={orderHref} className="w-full">
          Order on WhatsApp
        </Button>
      </div>
    </motion.article>
  );
}
