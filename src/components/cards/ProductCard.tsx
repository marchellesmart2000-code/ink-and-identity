import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { PLACEHOLDER_TONES } from "@/lib/constants";
import { availabilityCopy } from "@/lib/format";

export function ProductCard({
  name,
  slug,
  shortDescription,
  coverUrl,
  coverAlt,
  availability,
  featured,
  index = 0,
}: {
  name: string;
  slug: string;
  shortDescription: string;
  coverUrl?: string | null;
  coverAlt?: string;
  availability: string;
  featured?: boolean;
  index?: number;
}) {
  const tone = PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length];
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="group"
    >
      <Link to={`/shop/${slug}`} className="block">
        <div className="relative overflow-hidden rounded-sm border border-gold/15">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={coverAlt ?? name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className={`aspect-[4/5] bg-linear-to-br ${tone} paper-grain`} />
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            {featured ? <Badge>Featured</Badge> : null}
          </div>
        </div>
        <div className="pt-4">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-gold/80">
            {availabilityCopy[availability] ?? "Available to quote"}
          </p>
          <h3 className="display mt-1 text-3xl text-ivory">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">{shortDescription}</p>
          <p className="mt-3 text-[0.68rem] tracking-[0.16em] uppercase text-gold">Request a quote</p>
        </div>
      </Link>
    </motion.article>
  );
}
