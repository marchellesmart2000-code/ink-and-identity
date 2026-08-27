export function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-sm border border-gold/25 bg-charcoal p-5">
      <p className="text-[0.62rem] tracking-[0.16em] uppercase text-gold">{label}</p>
      <p className="display mt-2 text-4xl text-ivory">{value}</p>
    </div>
  );
}
