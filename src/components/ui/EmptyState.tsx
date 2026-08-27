export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-sm border border-gold/20 bg-charcoal px-8 py-16 text-center">
      <h2 className="display text-3xl text-ivory">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/70">{body}</p>
    </div>
  );
}
