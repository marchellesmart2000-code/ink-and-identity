import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  overlay?: ReactNode;
};

export function ProductImageFrame({ src, alt, className, overlay }: Props) {
  return (
    <div className={cn("relative overflow-hidden rounded-sm border border-gold/15 bg-ink", className)}>
      <div className="flex aspect-[4/5] items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain object-center transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      </div>
      {overlay}
    </div>
  );
}
