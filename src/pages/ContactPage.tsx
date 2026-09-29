import { SocialLinks } from "@/components/layout/SocialLinks";
import { StudioMap } from "@/components/contact/StudioMap";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { googleMapsDirectionsUrl } from "@/lib/maps";
import { resolveStudio } from "@/lib/studio";
import { CONTACT_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";

export function ContactPage() {
  const studio = resolveStudio(useSiteSettings());
  const wa = whatsappHref(studio.whatsapp, CONTACT_WHATSAPP_MESSAGE);
  const directions = googleMapsDirectionsUrl(studio.mapAddress, studio.mapUrl);

  return (
    <div className="container-wide py-16">
      <Seo
        title="Contact | Ink & Identity"
        description="Contact Ink & Identity at 3 Tamboti Street, White River. Message the studio on WhatsApp, or write to eksteentiane@gmail.com."
        path="/contact"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="display mt-8 text-4xl sm:text-5xl md:text-6xl">Write to the studio</h1>
      <p className="mt-4 max-w-xl text-ivory/70">
        Message us on WhatsApp and the note is already written. Email and the map are here if you would rather write or visit.
      </p>

      <div className="mt-12">
        <p className="eyebrow mb-4">Find us</p>
        <StudioMap address={studio.mapAddress} mapUrl={studio.mapUrl} />
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
        <dl className="space-y-5 text-sm lg:col-span-7">
          <div>
            <dt className="eyebrow">Email</dt>
            <dd className="mt-1">
              <a href={`mailto:${studio.email}`} className="hover:text-gold">
                {studio.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Phone</dt>
            <dd className="mt-1">
              {wa ? (
                <a href={wa} className="hover:text-gold" target="_blank" rel="noreferrer">
                  {studio.phone}
                </a>
              ) : (
                <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {studio.phone}
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Hours</dt>
            <dd className="mt-1 whitespace-pre-line leading-relaxed">{studio.hours}</dd>
          </div>
          <div>
            <dt className="eyebrow">Address</dt>
            <dd className="mt-1">{studio.address}</dd>
          </div>
          {studio.instagramUrl ? (
            <div>
              <dt className="eyebrow">Instagram</dt>
              <dd className="mt-1">
                <a href={studio.instagramUrl} className="hover:text-gold" target="_blank" rel="noreferrer">
                  {studio.instagramHandle}
                </a>
              </dd>
            </div>
          ) : null}
          {studio.facebookUrl ? (
            <div>
              <dt className="eyebrow">Facebook</dt>
              <dd className="mt-1">
                <a href={studio.facebookUrl} className="hover:text-gold" target="_blank" rel="noreferrer">
                  Ink & Identity
                </a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="eyebrow">Service areas</dt>
            <dd className="mt-1 space-y-1">
              {studio.serviceRegions.map((region) => (
                <p key={region}>{region}</p>
              ))}
            </dd>
          </div>
        </dl>
        <div className="flex flex-col items-start gap-4 lg:col-span-5">
          {wa ? (
            <Button href={wa} className="w-full sm:w-auto">
              Message on WhatsApp
            </Button>
          ) : null}
          <Button href={`mailto:${studio.email}`} variant="line" className="w-full sm:w-auto">
            Email the studio
          </Button>
          <Button href={directions} variant="line" className="w-full sm:w-auto">
            Directions
          </Button>
          {studio.instagramUrl ? (
            <Button href={studio.instagramUrl} variant="line" className="w-full sm:w-auto">
              Instagram
            </Button>
          ) : null}
          {studio.facebookUrl ? (
            <Button href={studio.facebookUrl} variant="line" className="w-full sm:w-auto">
              Facebook
            </Button>
          ) : null}
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
