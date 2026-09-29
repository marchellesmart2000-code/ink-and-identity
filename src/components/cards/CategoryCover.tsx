import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function CategoryCover({
  name,
  description,
  coverUrl,
  coverAlt,
  href,
  productCount,
  index = 0,
}: {
  name: string;
  description: string;
  coverUrl?: string | null;
  coverAlt?: string;
  href: string;
  productCount: number;
  index?: number;
}) {
  const countLabel = productCount === 1 ? "1 piece" : `${productCount} pieces`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.12) }}
    >
      <Link to={href} className="group block h-full">
        <div className="relative overflow-hidden rounded-sm border border-gold/20 bg-ink transition-colors group-hover:border-gold">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={coverAlt ?? name}
              className="aspect-[4/5] w-full object-contain p-6 transition-transform duration-200 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="aspect-[4/5] bg-linear-to-br from-[#050505] to-[#3a2e18]" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent px-5 pb-5 pt-16">
            <p className="eyebrow">{countLabel}</p>
            <h2 className="display mt-2 text-3xl text-ivory sm:text-4xl">{name}</h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ivory/70">{description}</p>
        <p className="mt-3 text-[0.68rem] tracking-[0.16em] uppercase text-gold">View all {name}</p>
      </Link>
    </motion.article>
  );
}
