import { GoldRule } from "@/components/ui/GoldRule";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { publishedCategories } from "@/lib/catalogue";
import { resolveStudio } from "@/lib/studio";
import { CONTACT_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";
import { Link } from "react-router-dom";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const settings = useSiteSettings();
  const studio = resolveStudio(settings);
  const categories = publishedCategories();
  const wa = whatsappHref(studio.whatsapp, CONTACT_WHATSAPP_MESSAGE);
  return (
    <footer className="mt-4 border-t border-gold/20 bg-ink text-ivory paper-grain md:mt-6">
      <div className="container-wide py-3 md:py-3.5">
        <div className="grid gap-3 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-5">
            <p className="display text-xl text-gold md:text-2xl">{settings?.brandName ?? "Ink & Identity"}</p>
            <p className="mt-1 max-w-sm text-xs leading-snug text-ivory/70">
              {settings?.tagline ?? "Turning ideas into beautifully made, meaningful products."}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow">Contact</p>
            <ul className="mt-1.5 space-y-0 text-xs leading-tight text-ivory/75">
              <li>
                <a href={`mailto:${studio.email}`} className="hover:text-gold">
                  {studio.email}
                </a>
              </li>
              <li>
                {wa ? (
                  <a href={wa} className="hover:text-gold" target="_blank" rel="noreferrer">
                    {studio.phone}
                  </a>
                ) : (
                  studio.phone
                )}
              </li>
              <li className="whitespace-pre-line">{studio.hours}</li>
              {studio.instagramUrl ? (
                <li>
                  <a href={studio.instagramUrl} className="hover:text-gold" target="_blank" rel="noreferrer">
                    {studio.instagramHandle}
                  </a>
                </li>
              ) : null}
              {studio.facebookUrl ? (
                <li>
                  <a href={studio.facebookUrl} className="hover:text-gold" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow">Service areas</p>
            <ul className="mt-1.5 space-y-0 text-xs leading-tight text-ivory/75">
              {studio.serviceRegions.map((region) => (
                <li key={region}>{region}</li>
              ))}
            </ul>
          </div>
        </div>
        <GoldRule className="my-2" />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ivory/70">
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <Link to="/services" className="hover:text-gold">Services</Link>
          <Link to="/about" className="hover:text-gold">About</Link>
          <Link to="/contact" className="hover:text-gold">Contact</Link>
          <Link to="/quote" className="hover:text-gold">Request a quote</Link>
          {categories.map((category) => (
            <Link key={category.slug} to={`/shop/category/${category.slug}`} className="hover:text-gold">
              {category.name}
            </Link>
          ))}
        </nav>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ivory/60">
          <SocialLinks />
          {studio.instagramUrl ? (
            <a href={studio.instagramUrl} className="hover:text-gold" target="_blank" rel="noreferrer">
              Instagram
            </a>
          ) : null}
          {studio.facebookUrl ? (
            <a href={studio.facebookUrl} className="hover:text-gold" target="_blank" rel="noreferrer">
              Facebook
            </a>
          ) : null}
          <Link to="/privacy" className="hover:text-gold">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-gold">
            Terms
          </Link>
        </div>
        <div className="relative mt-2">
          <div className="flex justify-center">
          <a
            href="https://www.lowveldweb.co.za"
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-gold/45 py-1 pl-1 pr-3 transition-colors hover:border-gold sm:pr-4"
          >
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-gold">
              <img
                src="/brand/lowveld-web-mark.png?v=2"
                alt=""
                width={802}
                height={802}
                className="size-[78%] object-contain"
              />
            </span>
            <span className="display text-sm italic leading-tight tracking-normal text-ivory sm:text-[1.05rem]">
              Professionally made by <span className="not-italic text-gold">Lowveld Web</span>
            </span>
          </a>
          </div>
          <p className="mt-2 text-center text-[0.62rem] tracking-[0.16em] uppercase text-ivory/35 md:absolute md:right-0 md:top-1/2 md:mt-0 md:-translate-y-1/2">
            <Link to="/admin/login" className="hover:text-gold">
              Studio
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
