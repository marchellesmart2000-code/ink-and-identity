import { ProductCard } from "@/components/cards/ProductCard";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { SegmentCard } from "@/components/cards/SegmentCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { JsonLd, Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GoldRule } from "@/components/ui/GoldRule";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SAMPLE_HERO_VIDEO, SEGMENTS } from "@/lib/constants";
import { siteOrigin, whatsappHref } from "@/lib/whatsapp";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function HomePage() {
  const settings = useSiteSettings();
  const services = useQuery(api.services.listPublic);
  const products = useQuery(api.products.listPublic, { sort: "featured" });
  const projects = useQuery(api.portfolio.listPublic, {});
  const social = useQuery(api.social.listPublic);
  const testimonials = useQuery(api.testimonials.listPublic);
  const wa = whatsappHref(
    settings?.whatsapp ?? "",
    "Hello Ink & Identity, I would like to start a project.",
  );
  const origin = siteOrigin();

  return (
    <>
      <Seo
        title={settings?.defaultSeoTitle ?? "Ink & Identity | Custom Printing & Branded Gifts in Mpumalanga"}
        description={
          settings?.defaultSeoDescription ??
          "Turn your idea into something remarkable with custom apparel, branded merchandise, personalised gifts and creative print solutions from Ink & Identity."
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
            sameAs: [settings?.instagramUrl, settings?.facebookUrl].filter(Boolean),
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {settings?.heroEyebrow ?? "INK & IDENTITY · CUSTOM PRINTS"}
          </motion.p>
          <motion.h1
            className="display mt-4 max-w-4xl text-[2.35rem] text-ivory sm:mt-6 sm:text-6xl md:text-8xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {settings?.heroHeadline ?? "Your idea, beautifully made."}
          </motion.h1>
          <div className="gold-hairline mt-6 max-w-48 sm:mt-8" />
          <motion.p
            className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75 sm:mt-6 sm:text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {settings?.heroSupport}
          </motion.p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button href="/quote" className="w-full sm:w-auto">Start a project</Button>
            <Button href="/portfolio" variant="ghost" className="w-full sm:w-auto">
              Explore the work
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

      <section className="container-wide py-14 md:py-24">
        <p className="eyebrow">Services</p>
        <h2 className="display mt-3 text-4xl md:text-6xl">Made for how you show up.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services === undefined ? (
            <Skeleton className="h-80" />
          ) : (
            services
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
              ))
          )}
        </div>
      </section>

      <section className="border-y border-gold/15 bg-charcoal">
        <div className="container-wide grid items-center gap-8 py-14 md:grid-cols-12 md:gap-12 md:py-24">
          <div className="md:col-span-6">
            <div className="aspect-[4/5] rounded-sm border border-gold/20 ink-panel paper-grain" />
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

      <section className="container-wide py-14 md:py-24">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">Featured projects</h2>
          </div>
          <Button href="/portfolio" variant="line">
            All work
          </Button>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {(projects ?? []).slice(0, 3).map((project) => (
            <PortfolioCard
              key={project._id}
              title={project.title}
              slug={project.slug}
              summary={project.summary}
              customerType={project.customerType}
              productsUsed={project.productsUsed}
              coverUrl={project.coverImage?.url}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-gold/15 bg-charcoal py-14 md:py-24">
        <div className="container-wide">
          <p className="eyebrow">Catalogue</p>
          <h2 className="display mt-3 text-4xl md:text-5xl">Pieces to begin with</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(products ?? []).slice(0, 8).map((product, index) => (
              <ProductCard
                key={product._id}
                name={product.name}
                slug={product.slug}
                shortDescription={product.shortDescription}
                coverUrl={product.cover?.url}
                coverAlt={product.cover?.alt}
                availability={product.availability}
                featured={product.featured}
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
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {SEGMENTS.map((segment) => (
              <SegmentCard key={segment.slug} title={segment.title} body={segment.body} href={segment.href} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-14 md:py-24">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Studio diary</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">Instagram & Facebook</h2>
          </div>
          {settings?.instagramUrl ? (
            <Button href={settings.instagramUrl} variant="line">
              {settings.instagramHandle || "Instagram"}
            </Button>
          ) : null}
        </div>
        {social && social.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {social.map((post) => (
              <a key={post._id} href={post.url} className="block aspect-square overflow-hidden rounded-sm border border-gold/20 bg-charcoal" target="_blank" rel="noreferrer">
                {post.image ? (
                  <img src={post.image.url} alt={post.image.alt || post.caption} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-end p-4 text-sm text-ivory/80">{post.caption}</div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="A curated gallery lives here"
              body="Selected Instagram and Facebook images are managed in the studio admin. Until they are published, visit the public profiles directly."
            />
          </div>
        )}
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
        <p className="eyebrow">Mpumalanga</p>
        <h2 className="display mt-3 text-4xl md:text-5xl">Close to the work</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">
          Service areas are published only once the owner confirms them. The current wording is editable in studio settings.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-ivory/70">
          {(settings?.serviceRegions ?? []).map((region) => (
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
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
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster ?? undefined}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
