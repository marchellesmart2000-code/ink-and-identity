import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PLACEHOLDER_TONES } from "@/lib/constants";

export function ServiceCard({
  name,
  slug,
  summary,
  mark,
  imageUrl,
  index = 0,
}: {
  name: string;
  slug: string;
  summary: string;
  mark: string;
  imageUrl?: string | null;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.12) }}
    >
      <Link to={`/services/${slug}`} className="group block h-full rounded-sm border border-gold/20 bg-charcoal p-6 transition-colors hover:border-gold/55 md:p-8">
        <div className={`mb-6 aspect-[16/10] overflow-hidden rounded-sm bg-linear-to-br ${PLACEHOLDER_TONES[index % 6]}`}>
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-end justify-between p-5 text-ivory/70">
              <span className="display text-5xl">{mark}</span>
            </div>
          )}
        </div>
        <p className="eyebrow">{mark}</p>
        <h3 className="display mt-2 text-3xl md:text-4xl">{name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ivory/70">{summary}</p>
      </Link>
    </motion.article>
  );
}
