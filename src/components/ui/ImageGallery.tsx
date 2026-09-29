import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconButton } from "./IconButton";

export type GalleryImage = { url: string; alt: string; caption?: string };

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  useEffect(() => {
    if (index === null) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        onIndex((index + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        onIndex((index - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndex]);

  const current = index === null ? null : images[index];

  return (
    <AnimatePresence>
      {current ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <IconButton label="Close" className="absolute right-4 top-4 text-ivory" onClick={onClose}>
            ×
          </IconButton>
          <img src={current.url} alt={current.alt} className="max-h-[82vh] max-w-full object-contain" />
          {current.caption ? (
            <p className="absolute bottom-6 text-sm text-ivory/80">{current.caption}</p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const active = images[index] ?? images[0];
  if (!active) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-sm border border-gold/20 bg-charcoal text-ivory/70">
        Photography coming soon
      </div>
    );
  }
  return (
    <div>
      <button type="button" className="block w-full" onClick={() => setOpen(index)}>
        <img
          src={active.url}
          alt={active.alt}
          className="aspect-square w-full rounded-sm bg-ink object-contain sm:aspect-[4/5]"
        />
      </button>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`overflow-hidden rounded-sm ${i === index ? "ring-1 ring-gold" : ""}`}
            >
              <img src={image.url} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  );
}
