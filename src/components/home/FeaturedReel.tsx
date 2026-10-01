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

    let active: { id: number; x: number; y: number; axis: "x" | "y" | null; moved: boolean } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      active = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null, moved: false };
      drag.current = { x: event.clientX, moved: false };
      paused.current = true;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!active || event.pointerId !== active.id) {
        return;
      }
      const dx = event.clientX - active.x;
      const dy = event.clientY - active.y;
      if (!active.axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
          return;
        }
        active.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (active.axis === "y") {
          active = null;
          drag.current = null;
          paused.current = false;
          return;
        }
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          // The pointer can already be gone on a quick tap.
        }
      }
      if (active.axis !== "x") {
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
      active.moved = true;
      moved.current = true;
      offset.current += dx;
      active.x = event.clientX;
      if (drag.current) {
        drag.current.moved = true;
        drag.current.x = event.clientX;
      }
    };
    const endDrag = (event: PointerEvent) => {
      if (active && event.pointerId !== active.id) {
        return;
      }
      moved.current = active?.moved ?? false;
      active = null;
      drag.current = null;
      paused.current = false;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!active) {
        return;
      }
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      if (!active.axis) {
        const dx = touch.clientX - active.x;
        const dy = touch.clientY - active.y;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
          return;
        }
        active.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (active.axis === "y") {
          active = null;
          drag.current = null;
          paused.current = false;
          return;
        }
      }
      if (active.axis === "x" && event.cancelable) {
        event.preventDefault();
      }
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("touchmove", onTouchMove);
    };
  }, [products.length]);

  if (products.length === 0) {
    return null;
  }

  const loop = [...products, ...products];

  return (
    <section className="border-y border-gold/15 bg-charcoal py-10 md:py-14" aria-label="Featured products">
      <div className="container-wide mb-6 md:mb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl md:text-5xl">Pieces on the bench</h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-ivory/55 sm:block">
            Drag either way. Tap a piece to open its category.
          </p>
        </div>
        <p className="mt-2 text-sm text-ivory/55 sm:hidden">Swipe either way. Tap a piece to open its category.</p>
      </div>
      <div
        ref={viewportRef}
        className="cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
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
                <div className="flex aspect-[4/5] items-center justify-center">
                  <img
                    src={product.coverUrl}
                    alt=""
                    draggable={false}
                    decoding="async"
                    loading={index < 4 ? "eager" : "lazy"}
                    className="h-full w-full object-contain object-center transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
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
