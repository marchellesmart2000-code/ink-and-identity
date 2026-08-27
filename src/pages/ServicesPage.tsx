import { ServiceCard } from "@/components/cards/ServiceCard";
import { JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export function ServicesPage() {
  const services = useQuery(api.services.listPublic);
  return (
    <div className="container-wide py-16">
      <Seo
        title="Services | Ink & Identity"
        description="Custom apparel, corporate branding, gifts, event merchandise, school and team wear, and personalised products from Ink & Identity."
        path="/services"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Services" },
          ],
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <h1 className="display mt-8 text-6xl md:text-7xl">What we make with you</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">
        A studio for custom apparel, branded merchandise, event pieces and personal gifts. Every service page is editable — treat this copy as a starting brief until the owner confirms it.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(services ?? []).map((service, index) => (
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
      <div className="mt-16">
        <Button href="/quote">Start a project</Button>
      </div>
    </div>
  );
}
