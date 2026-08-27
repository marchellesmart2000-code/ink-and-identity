import { GoldRule } from "@/components/ui/GoldRule";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { whatsappHref } from "@/lib/whatsapp";
import { Link } from "react-router-dom";

export function Footer() {
  const settings = useSiteSettings();
  const wa = whatsappHref(
    settings?.whatsapp ?? "",
    "Hello Ink & Identity, I would like to talk about a project.",
  );
  return (
    <footer className="mt-24 border-t border-gold/20 bg-ink text-ivory paper-grain">
      <div className="container-wide py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-5xl text-gold">{settings?.brandName ?? "Ink & Identity"}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
              {settings?.tagline ?? "Turning ideas into beautifully made, meaningful products."}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/75">
              {settings?.email ? <li>{settings.email}</li> : <li>Use the quote form to reach us.</li>}
              {settings?.phone ? <li>{settings.phone}</li> : null}
              {settings?.hours ? <li>{settings.hours}</li> : <li>Hours will be confirmed by the studio.</li>}
              {wa ? (
                <li>
                  <a href={wa} className="hover:text-gold">
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow">Service areas</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/75">
              {(settings?.serviceRegions ?? []).map((region) => (
                <li key={region}>{region}</li>
              ))}
            </ul>
          </div>
        </div>
        <GoldRule className="my-10" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-ivory/60">
          <div className="flex flex-wrap gap-5">
            {settings?.instagramUrl ? (
              <a href={settings.instagramUrl} className="hover:text-gold">
                Instagram {settings.instagramHandle}
              </a>
            ) : null}
            {settings?.facebookUrl ? (
              <a href={settings.facebookUrl} className="hover:text-gold">
                Facebook
              </a>
            ) : null}
            <Link to="/privacy" className="hover:text-gold">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gold">
              Terms
            </Link>
            <Link to="/journal" className="hover:text-gold">
              Journal
            </Link>
          </div>
          <form
            className="flex w-full max-w-sm gap-2 md:w-auto"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="newsletter">
              Newsletter (coming soon)
            </label>
            <input
              id="newsletter"
              placeholder="Notes by email, coming soon"
              className="w-full rounded-full border border-gold/30 bg-transparent px-4 py-2 text-sm text-ivory placeholder:text-ivory/35"
              disabled
            />
          </form>
        </div>
        <p className="mt-8 text-[0.62rem] tracking-[0.16em] uppercase text-ivory/35">
          <Link to="/admin/login" className="hover:text-gold">
            Studio
          </Link>
        </p>
      </div>
    </footer>
  );
}
