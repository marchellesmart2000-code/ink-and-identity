import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { customerTypeCopy } from "@/lib/format";

export function PortfolioCard({
  title,
  slug,
  summary,
  customerType,
  productsUsed,
  coverUrl,
}: {
  title: string;
  slug: string;
  summary: string;
  customerType: string;
  productsUsed: string[];
  coverUrl?: string | null;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/portfolio/${slug}`} className="block">
        <div className="overflow-hidden rounded-sm border border-gold/15 bg-graphite">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-[5/4] items-end p-6 paper-grain ink-panel">
              <p className="display text-4xl text-ivory">{title}</p>
            </div>
          )}
        </div>
        <p className="mt-4 text-[0.62rem] tracking-[0.18em] uppercase text-gold">
          {customerTypeCopy[customerType] ?? customerType}
        </p>
        <h3 className="display mt-1 text-3xl">{title}</h3>
        <p className="mt-2 text-sm text-ivory/70">{summary}</p>
        <p className="mt-3 text-xs text-gold/70">{productsUsed.join(" · ")}</p>
      </Link>
    </motion.article>
  );
}
