import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "gold" | "ivory" | "ghost" | "ink" | "line";

const styles: Record<Variant, string> = {
  gold: "bg-gold text-ink hover:bg-gold-bright",
  ivory: "bg-ivory text-ink hover:bg-gold-bright",
  ghost: "bg-transparent text-ivory border border-gold/45 hover:border-gold hover:text-gold",
  ink: "bg-charcoal text-gold border border-gold/35 hover:border-gold",
  line: "bg-transparent text-gold border border-gold/40 hover:border-gold hover:bg-gold/10",
};

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function Button({
  variant = "gold",
  href,
  className,
  children,
  onClick,
  ...props
}: Props) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.68rem] font-medium tracking-[0.14em] uppercase transition-colors disabled:opacity-50 sm:px-6 sm:text-[0.72rem] sm:tracking-[0.18em]",
    styles[variant],
    className,
  );
  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noreferrer" onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
