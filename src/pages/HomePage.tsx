import { CategoryCover } from "@/components/cards/CategoryCover";
import { ProductCard } from "@/components/cards/ProductCard";
import { FeaturedReel } from "@/components/home/FeaturedReel";
import { SegmentCard } from "@/components/cards/SegmentCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { JsonLd, Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { GoldRule } from "@/components/ui/GoldRule";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { featuredProducts, publishedCategories } from "@/lib/catalogue";
import { SAMPLE_HERO_VIDEO, SEGMENTS } from "@/lib/constants";
import { useFeaturedSlugs } from "@/lib/featured";
import { resolveStudio } from "@/lib/studio";
import { CONTACT_WHATSAPP_MESSAGE, siteOrigin, whatsappHref } from "@/lib/whatsapp";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function HomePage() {
  const settings = useSiteSettings();
  const studio = resolveStudio(settings);
  const services = useQuery(api.services.listPublic);
  const featuredSlugs = useFeaturedSlugs(settings?.featuredProductSlugs);
  const categories = publishedCategories();
  const reel = featuredProducts(featuredSlugs);
  const testimonials = useQuery(api.testimonials.listPublic);
  const wa = whatsappHref(studio.whatsapp, CONTACT_WHATSAPP_MESSAGE);
  const origin = siteOrigin();

  return (
    <>
      <Seo
        title={settings?.defaultSeoTitle ?? "Ink & Identity | Sublimation Studio in White River"}
        description={
          settings?.defaultSeoDescription ??
          "Sublimated mugs, tumblers, dog tags, coasters, pillows and gifts from Ink & Identity in White River, Mpumalanga. Order on WhatsApp."
        }
        path="/"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: settings?.brandName ?? "Ink & Identity",
            url: origin,
          },
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: settings?.brandName ?? "Ink & Identity",
            description: settings?.defaultSeoDescription,
            url: origin,
            areaServed: settings?.serviceRegions,
            ...(settings?.email ? { email: settings.email } : {}),
            ...(settings?.phone ? { telephone: settings.phone } : {}),
            ...(settings?.address ? { address: settings.address } : {}),
            sameAs: [studio.instagramUrl, studio.facebookUrl].filter(Boolean),
          },
        ]}
      />

      <section className="relative min-h-[100svh] overflow-hidden bg-ink text-ivory">
        <HeroBackground
          src={settings?.heroVideoUrl?.trim() || SAMPLE_HERO_VIDEO}
          poster={settings?.heroPosterUrl}
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-ink via-ink/35 to-black/10" />
        <div className="pointer-events-none absolute inset-3 z-10 border border-gold/20 sm:inset-6 md:inset-10" />
        <div className="container-wide relative z-20 flex min-h-[100svh] flex-col justify-end pb-10 pt-28 sm:pb-16 sm:pt-36 md:pb-20">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {settings?.heroEyebrow ?? "INK & IDENTITY · CUSTOM PRINTS"}
          </motion.p>
          <motion.h1
            className="display mt-4 max-w-4xl text-[2.35rem] text-ivory sm:mt-6 sm:text-6xl md:text-8xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.04 }}
          >
            {settings?.heroHeadline ?? "Your idea, beautifully made."}
          </motion.h1>
          <div className="gold-hairline mt-6 max-w-48 sm:mt-8" />
          <motion.p
            className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75 sm:mt-6 sm:text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.08 }}
          >
            {settings?.heroSupport}
          </motion.p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button href="/quote" className="w-full sm:w-auto">Start a project</Button>
            <Button href="/shop" variant="ghost" className="w-full sm:w-auto">
              Explore the shop
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/20 bg-charcoal">
        <div className="container-wide grid gap-4 py-6 sm:gap-6 sm:py-8 md:grid-cols-4">
          {(settings?.trustStatements ?? []).map((item) => (
            <p key={item} className="text-center text-[0.78rem] tracking-[0.16em] uppercase text-gold">
              {item}
            </p>
          ))}
        </div>
      </section>

      <FeaturedReel products={reel} />

      <section className="container-wide py-12 md:py-20">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">The work</p>
            <h2 className="display mt-3 text-4xl md:text-6xl">Choose a category</h2>
          </div>
          <Button href="/shop" variant="line" className="w-full sm:w-auto">
            Open the shop
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCover
              key={category.slug}
              name={category.name}
              description={category.description}
              coverUrl={category.coverUrl}
              coverAlt={category.coverAlt}
              href={`/shop/category/${category.slug}`}
              productCount={category.productCount}
              index={index}
            />
          ))}
        </div>
      </section>

      {(services ?? []).some((item) => item.featured) ? (
      <section className="container-wide py-14 md:py-24">
        <p className="eyebrow">Services</p>
        <h2 className="display mt-3 text-4xl md:text-6xl">Made for how you show up.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(services ?? [])
              .filter((item) => item.featured)
              .map((service, index) => (
                <ServiceCard
                  key={service._id}
                  name={service.name}
                  slug={service.slug}
                  summary={service.summary}
                  mark={service.mark}
                  imageUrl={service.heroImage?.url}
                  index={index}
                />
              ))}
        </div>
      </section>
      ) : null}

      <section className="border-y border-gold/15 bg-charcoal">
        <div className="container-wide grid items-center gap-8 py-14 md:grid-cols-12 md:gap-12 md:py-24">
          <div className="md:col-span-6">
            <img
              src="/products/coffee-mugs/gideon-mug-coaster.jpg"
              alt="Sublimated safari mug and matching coaster"
              className="aspect-[4/5] w-full rounded-sm border border-gold/20 bg-ink object-contain"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6">
            <p className="eyebrow">Process</p>
            <h2 className="display mt-3 text-4xl text-ivory md:text-6xl">
              {settings?.editorialHeadline ?? "Made to be remembered"}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ivory/70">
              {settings?.editorialBody}
            </p>
            <GoldRule className="my-8 max-w-40" />
            <Button href="/about" variant="line">
              The studio
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-charcoal py-14 md:py-24">
        <div className="container-wide">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2 className="display mt-3 text-4xl md:text-5xl">Pieces to begin with</h2>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button href="/shop" variant="line" className="w-full sm:w-auto">
                Browse the catalogue
              </Button>
              <Button href="/quote" className="w-full sm:w-auto">
                Request a quote
              </Button>
            </div>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reel.slice(0, 8).map((product, index) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                slug={product.slug}
                shortDescription={product.shortDescription}
                coverUrl={product.coverUrl}
                coverAlt={product.coverAlt}
                availability={product.availability}
                featured={product.featured}
                categoryName={product.categoryName}
                categorySlug={product.categorySlug}
                price={product.price}
                currency={product.currency}
                priceDisplay={product.priceDisplay}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-14 md:py-24">
        <p className="eyebrow">How it works</p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {(settings?.processSteps ?? []).map((step, index) => (
            <div key={step.title}>
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="display mt-3 text-4xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ink-panel paper-grain py-14 text-ivory md:py-24">
        <div className="container-wide">
          <h2 className="display text-4xl md:text-5xl">Who it is for</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {SEGMENTS.map((segment) => (
              <SegmentCard key={segment.slug} title={segment.title} body={segment.body} href={segment.href} />
            ))}
          </div>
        </div>
      </section>

      {testimonials && testimonials.length > 0 ? (
        <section className="border-y border-gold/15 bg-charcoal py-14 md:py-24">
          <div className="container-wide grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item._id} className="rounded-sm border border-gold/25 p-6">
                <p className="display text-3xl text-ivory">“{item.quote}”</p>
                <footer className="mt-4 text-sm text-gold">
                  {item.attribution}
                  {item.role ? ` · ${item.role}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-wide py-12 md:py-16">
        <p className="eyebrow">White River</p>
        <h2 className="display mt-3 text-4xl md:text-5xl">Close to the work</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">
          The studio is at {studio.address}. Pieces can also travel through PUDO.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-ivory/70">
          {studio.serviceRegions.map((region) => (
            <li key={region}>{region}</li>
          ))}
        </ul>
      </section>

      <section className="ink-panel paper-grain py-14 text-center text-ivory md:py-24">
        <div className="container-page">
          <h2 className="display text-4xl text-gold md:text-7xl">
            {settings?.finalCtaHeadline ?? "Let’s put your identity into something people can hold."}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ivory/70 md:text-base">{settings?.finalCtaBody}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
            <Button href="/quote" className="w-full sm:w-auto">Request a quote</Button>
            {wa ? (
              <Button href={wa} variant="ghost" className="w-full sm:w-auto">
                WhatsApp
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

function HeroBackground({
  src,
  poster,
}: {
  src: string;
  poster?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (narrow || reduced || connection?.saveData) {
      return;
    }
    setPlayVideo(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playVideo) {
      return;
    }
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const play = () => {
      void video.play().catch(() => undefined);
    };
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, [playVideo, src]);

  if (!playVideo) {
    return poster ? (
      <img src={poster} alt="" className="absolute inset-0 z-0 h-full w-full object-cover" />
    ) : null;
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster ?? undefined}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
