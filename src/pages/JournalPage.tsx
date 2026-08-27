import { JournalCard } from "@/components/cards/JournalCard";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export function JournalPage() {
  const posts = useQuery(api.journal.listPublic);
  return (
    <div className="container-wide py-16">
      <Seo
        title="Journal | Ink & Identity"
        description="Guides, ideas and seasonal gifting notes from Ink & Identity."
        path="/journal"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <h1 className="display mt-8 text-6xl">Journal</h1>
      <p className="mt-4 max-w-xl text-sm text-ivory/70">
        Notes on artwork, gifting, teams and the making of a piece. Sample articles are clearly that — replace with owner voice.
      </p>
      <div className="mt-10">
        {(posts ?? []).length === 0 && posts !== undefined ? (
          <EmptyState title="No articles yet" body="The studio will publish guides and seasonal notes here." />
        ) : (
          (posts ?? []).map((post) => (
            <JournalCard
              key={post._id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
            />
          ))
        )}
      </div>
    </div>
  );
}
