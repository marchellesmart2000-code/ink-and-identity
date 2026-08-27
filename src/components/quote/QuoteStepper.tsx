export function QuoteStepper({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-sm text-gold/80">
        Step {step + 1} of {total} · {label}
      </p>
      <div className="mt-6 h-px bg-gold/20" aria-hidden="true">
        <div className="h-px bg-gold" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
