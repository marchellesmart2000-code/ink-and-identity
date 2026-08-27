import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

type CustomerFilter = "business" | "school_team" | "event" | "personal" | "";

export function PortfolioPage() {
  const [customerType, setCustomerType] = useState<CustomerFilter>("");
  const projects = useQuery(api.portfolio.listPublic, {
    customerType: customerType || undefined,
  });
  return (
    <div className="container-wide py-16">
      <Seo
        title="Portfolio | Ink & Identity"
        description="A curated gallery of custom printing and branded merchandise projects from Ink & Identity."
        path="/portfolio"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
      <h1 className="display mt-8 text-6xl">The work</h1>
      <p className="mt-4 max-w-2xl text-sm text-ivory/70">
        Sample studies are marked as such until owner photography and permission are in place. No invented clients.
      </p>
      <div className="mt-8 max-w-xs">
        <Select
          label="Customer type"
          value={customerType}
          onChange={(event) => setCustomerType(event.target.value as CustomerFilter)}
        >
          <option value="">All</option>
          <option value="business">Business</option>
          <option value="school_team">School / team</option>
          <option value="event">Event</option>
          <option value="personal">Personal</option>
        </Select>
      </div>
      {(projects ?? []).length === 0 && projects !== undefined ? (
        <div className="mt-12">
          <EmptyState title="No published projects yet" body="The studio will add work here once photography is approved." />
        </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {(projects ?? []).map((project) => (
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
      )}
    </div>
  );
}
