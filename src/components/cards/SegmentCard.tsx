import { Link } from "react-router-dom";

export function SegmentCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group flex min-h-48 flex-col justify-between rounded-sm border border-gold/25 bg-charcoal p-6 transition-colors hover:border-gold"
    >
      <h3 className="display text-3xl text-ivory">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ivory/70">{body}</p>
      <span className="mt-6 text-[0.68rem] tracking-[0.16em] uppercase text-gold">Enter</span>
    </Link>
  );
}
