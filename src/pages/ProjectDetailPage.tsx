import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";

export function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const project = useQuery(api.portfolio.getBySlug, { slug });
  if (project === undefined) {
    return <div className="container-wide py-24">Loading…</div>;
  }
  if (!project) {
    return (
      <div className="container-wide py-24">
        <EmptyState title="Project not found" body="This case study is not published." />
      </div>
    );
  }
  return (
    <div className="container-wide py-16">
      <Seo title={project.seoTitle} description={project.seoDescription} path={`/portfolio/${project.slug}`} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/portfolio" },
          { label: project.title },
        ]}
      />
      <h1 className="display mt-8 text-6xl">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-base text-ivory/70">{project.summary}</p>
      <div className="mt-10 max-w-3xl">
        <ImageGallery
          images={
            project.gallery.length
              ? project.gallery.map((image) => ({ url: image.url, alt: image.alt, caption: image.caption }))
              : project.coverImage
                ? [{ url: project.coverImage.url, alt: project.coverImage.alt }]
                : []
          }
        />
      </div>
      <div className="mt-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="display text-4xl">Brief</h2>
          <p className="mt-4 leading-relaxed text-ivory/70">{project.brief}</p>
        </div>
        <aside className="md:col-span-5 space-y-4 text-sm">
          <p>
            <span className="eyebrow block">Products used</span>
            {project.productsUsed.join(", ")}
          </p>
          <p>
            <span className="eyebrow block">Colours / materials</span>
            {project.coloursMaterials}
          </p>
          <Button href="/quote">Start a similar project</Button>
        </aside>
      </div>
    </div>
  );
}
