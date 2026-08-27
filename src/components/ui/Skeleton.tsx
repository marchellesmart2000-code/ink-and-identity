export function Skeleton({ className = "h-40" }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-gold/10 ${className}`} />;
}
