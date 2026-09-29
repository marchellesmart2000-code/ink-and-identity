import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { ShopProduct } from "@/lib/catalogue";

export function FeaturedReel({ products }: { products: ShopProduct[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const paused = useRef(false);
  const width = useRef(0);
  const moved = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || products.length === 0) {
      return;
    }
    const measure = () => {
      width.current = track.scrollWidth / 2;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    let frame = 0;
    let last = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const loop = width.current;
      if (!drag.current && !paused.current && !reduced.matches && loop > 0) {
        offset.current -= dt * 0.035;
      }
      if (loop > 0) {
        while (offset.current <= -loop) {
          offset.current += loop;
        }
        while (offset.current > 0) {
          offset.current -= loop;
        }
      }
      track.style.transform = `translate3d(${offset.current}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [products.length]);

  if (products.length === 0) {
    return null;
  }

  const loop = [...products, ...products];

  return (
    <section className="border-y border-gold/15 bg-charcoal py-10 md:py-14" aria-label="Featured products">
      <div className="container-wide mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="eyebrow">Featured</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl md:text-5xl">Pieces on the bench</h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm text-ivory/55 sm:block">
          Drag either way. Tap a piece to open its category.
        </p>
      </div>
      <div
        ref={viewportRef}
        className="cursor-grab overflow-hidden active:cursor-grabbing"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) {
            return;
          }
          drag.current = { x: event.clientX, moved: false };
          paused.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) {
            return;
          }
          const dx = event.clientX - drag.current.x;
          if (Math.abs(dx) > 5) {
            drag.current.moved = true;
            moved.current = true;
          }
          offset.current += dx;
          drag.current.x = event.clientX;
        }}
        onPointerUp={() => {
          moved.current = drag.current?.moved ?? false;
          drag.current = null;
          paused.current = false;
        }}
        onPointerCancel={() => {
          drag.current = null;
          paused.current = false;
        }}
        onMouseEnter={() => {
          if (window.matchMedia("(hover: hover)").matches) {
            paused.current = true;
          }
        }}
        onMouseLeave={() => {
          if (!drag.current) {
            paused.current = false;
          }
        }}
      >
        <div ref={trackRef} className="flex w-max gap-4 px-4 will-change-transform sm:gap-5 sm:px-6">
          {loop.map((product, index) => (
            <Link
              key={`${product.slug}-${index}`}
              to={`/shop/category/${product.categorySlug}`}
              draggable={false}
              onClick={(event) => {
                if (moved.current) {
                  event.preventDefault();
                  moved.current = false;
                }
              }}
              className="group w-[72vw] max-w-[280px] shrink-0 sm:w-[300px]"
            >
              <div className="overflow-hidden rounded-sm border border-gold/20 bg-ink">
                <img
                  src={product.coverUrl}
                  alt=""
                  draggable={false}
                  decoding="async"
                  loading={index < 4 ? "eager" : "lazy"}
                  className="aspect-square w-full object-contain p-3 transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 text-[0.62rem] tracking-[0.18em] uppercase text-gold">{product.categoryName}</p>
              <h3 className="display mt-1 text-2xl text-ivory sm:text-3xl">{product.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
