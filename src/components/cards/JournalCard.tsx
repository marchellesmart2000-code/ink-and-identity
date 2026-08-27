import { Link } from "react-router-dom";
import { formatDate } from "@/lib/format";

export function JournalCard({
  title,
  slug,
  excerpt,
  publishedAt,
}: {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: number;
}) {
  return (
    <article className="border-t border-gold/20 py-8">
      <p className="text-[0.62rem] tracking-[0.18em] uppercase text-gold/80">{formatDate(publishedAt)}</p>
      <h3 className="display mt-2 text-4xl">
        <Link to={`/journal/${slug}`} className="hover:text-gold">
          {title}
        </Link>
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/70">{excerpt}</p>
    </article>
  );
}
