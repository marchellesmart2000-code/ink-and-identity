import { StudioMap } from "@/components/contact/StudioMap";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { googleMapsDirectionsUrl } from "@/lib/maps";
import { whatsappHref } from "@/lib/whatsapp";

export function ContactPage() {
  const settings = useSiteSettings();
  const wa = whatsappHref(
    settings?.whatsapp ?? "",
    "Hello Ink & Identity, I would like to get in touch.",
  );
  const directions = googleMapsDirectionsUrl(settings?.address, settings?.mapUrl);

  return (
    <div className="container-wide py-16">
      <Seo
        title="Contact | Ink & Identity"
        description="Contact Ink & Identity in Mpumalanga for custom printing, branded merchandise and personalised gifts."
        path="/contact"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="display mt-8 text-6xl">Write to the studio</h1>
      <p className="mt-4 max-w-xl text-ivory/70">
        Phone, email, hours and a street address appear here only once the owner has confirmed them. Until then, the quote form is the surest way to reach us.
      </p>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">{settings?.email || "Not yet published"}</dd>
            </div>
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-1">{settings?.phone || "Not yet published"}</dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-1">{settings?.hours || "Not yet published"}</dd>
            </div>
            <div>
              <dt className="eyebrow">Address</dt>
              <dd className="mt-1">{settings?.address || "Not yet published"}</dd>
            </div>
            <div>
              <dt className="eyebrow">Service areas</dt>
              <dd className="mt-1 space-y-1">
                {(settings?.serviceRegions ?? []).map((region) => (
                  <p key={region}>{region}</p>
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/quote">Request a quote</Button>
            {wa ? (
              <Button href={wa} variant="line">
                WhatsApp
              </Button>
            ) : null}
            <Button href={directions} variant="line">
              Directions
            </Button>
            {settings?.instagramUrl ? (
              <Button href={settings.instagramUrl} variant="line">
                Instagram
              </Button>
            ) : null}
            {settings?.facebookUrl ? (
              <Button href={settings.facebookUrl} variant="line">
                Facebook
              </Button>
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">Find us</p>
          <StudioMap address={settings?.address} mapUrl={settings?.mapUrl} />
        </div>
      </div>
    </div>
  );
}
