import { googleMapsEmbedSrc } from "@/lib/maps";

export function StudioMap({
  address,
  mapUrl,
}: {
  address?: string | null;
  mapUrl?: string | null;
}) {
  const src = googleMapsEmbedSrc(address, mapUrl);
  const pinLabel = address?.trim()
    ? address.trim()
    : "White River / Witrivier, Mpumalanga — town pin until a street address is published";

  return (
    <figure className="overflow-hidden rounded-sm border border-gold/25 bg-charcoal">
      <div className="relative aspect-[4/5] min-h-56 w-full sm:aspect-[4/3] md:min-h-[28rem]">
        <iframe
          title="Ink & Identity studio location"
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <figcaption className="border-t border-gold/20 px-4 py-3 text-xs leading-relaxed text-ivory/65">
        {pinLabel}
      </figcaption>
    </figure>
  );
}
