import { JsonLd, Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { RichTextRenderer } from "@/components/ui/RichTextRenderer";
import { formatDate } from "@/lib/format";
import { siteOrigin } from "@/lib/whatsapp";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";

export function JournalDetailPage() {
  const { slug = "" } = useParams();
  const post = useQuery(api.journal.getBySlug, { slug });
  if (post === undefined) {
    return <div className="container-wide py-24">Loading…</div>;
  }
  if (!post) {
    return (
      <div className="container-wide py-24">
        <EmptyState title="Article not found" body="This note is a draft, or the link has changed." />
      </div>
    );
  }
  return (
    <article className="container-page py-16">
      <Seo
        title={post.seoTitle}
        description={post.seoDescription}
        path={`/journal/${post.slug}`}
        type="article"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
          author: { "@type": "Organization", name: post.author },
          mainEntityOfPage: `${siteOrigin()}/journal/${post.slug}`,
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
          { label: post.title },
        ]}
      />
      <p className="mt-8 text-[0.62rem] tracking-[0.18em] uppercase text-gold">
        {formatDate(post.publishedAt)} · {post.author}
      </p>
      <h1 className="display mt-3 text-5xl md:text-6xl">{post.title}</h1>
      <p className="mt-6 text-lg text-ivory/70">{post.excerpt}</p>
      <div className="mt-10">
        <RichTextRenderer content={post.body} />
      </div>
    </article>
  );
}
