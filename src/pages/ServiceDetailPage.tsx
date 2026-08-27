import { JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = useQuery(api.services.getBySlug, { slug });
  if (service === undefined) {
    return <div className="container-wide py-24">Loading…</div>;
  }
  if (service === null) {
    return (
      <div className="container-wide py-24">
        <EmptyState title="This service is not published" body="It may be a draft, or the link is no longer current." />
      </div>
    );
  }
  return (
    <div className="container-wide py-16">
      <Seo title={service.seoTitle} description={service.seoDescription} path={`/services/${service.slug}`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "/services" },
            { "@type": "ListItem", position: 3, name: service.name },
          ],
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />
      <p className="eyebrow mt-8">{service.eyebrow}</p>
      <h1 className="display mt-3 text-6xl md:text-7xl">{service.name}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">{service.summary}</p>
      <div className="mt-12 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7 space-y-6 text-base leading-relaxed text-ivory/70">
          <p>{service.description}</p>
          <h2 className="display text-4xl text-ivory">The process</h2>
          <p>{service.process}</p>
        </div>
        <aside className="md:col-span-5 rounded-sm border border-gold/25 bg-charcoal p-8">
          <p className="eyebrow">Begin</p>
          <p className="mt-3 text-sm text-ivory/70">Tell us what you need. We will help you shape the brief.</p>
          <div className="mt-6">
            <Button href={`/quote?service=${service.slug}`}>Request this service</Button>
          </div>
        </aside>
      </div>
      {service.examples.length > 0 ? (
        <section className="mt-16">
          <h2 className="display text-4xl">Related pieces</h2>
          <ul className="mt-6 space-y-3">
            {service.examples.map((item) => (
              <li key={item.slug}>
                <Link to={`/shop/${item.slug}`} className="hover:text-gold">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {service.faqs.length > 0 ? (
        <section className="mt-16">
          <h2 className="display text-4xl">Questions</h2>
          <div className="mt-6 space-y-6">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="border-t border-gold/20 py-4">
                <summary className="cursor-pointer text-lg">{faq.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
