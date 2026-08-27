import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/ui/Toast";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AdminTable } from "./components/AdminTable";

export function ServicesAdminPage() {
  const services = useQuery(api.services.listAdmin);
  const create = useMutation(api.services.create);
  const archive = useMutation(api.services.archive);
  const { push } = useToast();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  return (
    <div>
      <h1 className="display text-5xl">Services</h1>
      <form
        className="mt-8 max-w-xl space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await create({
            name,
            summary,
            eyebrow: "Studio service",
            description: summary,
            process: "Share the idea, refine the design, receive the work.",
            customerSegment: "business",
            mark: "•",
            faqs: [],
            seoTitle: `${name} | Ink & Identity`,
            seoDescription: summary,
            featured: true,
            published: true,
            sortOrder: (services?.length ?? 0) + 1,
          });
          setName("");
          setSummary("");
          push("Service created.");
        }}
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <Button type="submit">Add service</Button>
      </form>
      <div className="mt-10">
        <AdminTable headers={["Name", "Published", ""]}>
          {(services ?? []).map((service) => (
            <tr key={service._id} className="border-t border-gold/20">
              <td className="px-4 py-3">{service.name}</td>
              <td className="px-4 py-3">{service.published ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => void archive({ id: service._id, archived: !service.archived })}
                >
                  {service.archived ? "Restore" : "Archive"}
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

export function PortfolioAdminPage() {
  const projects = useQuery(api.portfolio.listAdmin);
  const create = useMutation(api.portfolio.create);
  const { push } = useToast();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  return (
    <div>
      <h1 className="display text-5xl">Portfolio</h1>
      <form
        className="mt-8 max-w-xl space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await create({
            title,
            summary,
            brief: summary,
            customerType: "business",
            category: "custom",
            productsUsed: [],
            coloursMaterials: "",
            gallery: [],
            published: false,
            featured: false,
            seoTitle: title,
            seoDescription: summary,
            sortOrder: (projects?.length ?? 0) + 1,
          });
          setTitle("");
          setSummary("");
          push("Project drafted.");
        }}
      >
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <Button type="submit">Add draft project</Button>
      </form>
      <ul className="mt-8 space-y-3">
        {(projects ?? []).map((project) => (
          <li key={project._id}>
            {project.title} · {project.published ? "Published" : "Draft"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JournalAdminPage() {
  const posts = useQuery(api.journal.listAdmin);
  const create = useMutation(api.journal.create);
  const { push } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="max-w-2xl">
      <h1 className="display text-5xl">Journal</h1>
      <form
        className="mt-8 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await create({
            title,
            excerpt,
            body,
            author: "Ink & Identity",
            tags: [],
            seoTitle: title,
            seoDescription: excerpt,
            canonicalUrl: "",
            status: "draft",
          });
          push("Draft saved.");
          setTitle("");
          setExcerpt("");
          setBody("");
        }}
      >
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        <Textarea label="Body (markdown)" value={body} onChange={(e) => setBody(e.target.value)} />
        <Button type="submit">Save draft</Button>
      </form>
      <ul className="mt-8 space-y-2 text-sm">
        {(posts ?? []).map((post) => (
          <li key={post._id}>
            {post.title} · {post.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CampaignsAdminPage() {
  const campaigns = useQuery(api.campaigns.listAdmin);
  const create = useMutation(api.campaigns.create);
  const { push } = useToast();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  return (
    <div className="max-w-2xl">
      <h1 className="display text-5xl">Campaigns</h1>
      <p className="mt-2 text-sm text-ivory/70">Expired campaigns never appear on the public site.</p>
      <form
        className="mt-8 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await create({
            name,
            headline,
            body: headline,
            ctaLabel: "Request a quote",
            ctaHref: "/quote",
            terms: "",
            priceNote: "",
            deadlineNote: "",
            startAt: new Date(startAt).getTime(),
            endAt: new Date(endAt).getTime(),
            published: true,
          });
          push("Campaign saved.");
        }}
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        <Input label="Starts" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        <Input label="Ends" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        <Button type="submit">Create campaign</Button>
      </form>
      <ul className="mt-8 space-y-2 text-sm">
        {(campaigns ?? []).map((campaign) => (
          <li key={campaign._id}>
            {campaign.name} · {campaign.live ? "Live" : campaign.expired ? "Expired" : "Scheduled"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SocialAdminPage() {
  const posts = useQuery(api.social.listAdmin);
  const upsert = useMutation(api.social.upsert);
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  return (
    <div className="max-w-xl">
      <h1 className="display text-5xl">Social gallery</h1>
      <form
        className="mt-8 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await upsert({
            caption,
            url,
            platform: "instagram",
            published: true,
            sortOrder: (posts?.length ?? 0) + 1,
          });
          setCaption("");
          setUrl("");
        }}
      >
        <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Input label="Instagram or Facebook URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button type="submit">Add link card</Button>
      </form>
      <ul className="mt-8 space-y-2 text-sm">
        {(posts ?? []).map((post) => (
          <li key={post._id}>{post.caption}</li>
        ))}
      </ul>
    </div>
  );
}

export function TestimonialsAdminPage() {
  const rows = useQuery(api.testimonials.listAdmin);
  const upsert = useMutation(api.testimonials.upsert);
  const [quote, setQuote] = useState("");
  const [attribution, setAttribution] = useState("");
  const [approved, setApproved] = useState(false);
  return (
    <div className="max-w-xl">
      <h1 className="display text-5xl">Testimonials</h1>
      <p className="mt-2 text-sm text-ivory/70">Nothing appears publicly until it is both approved and published.</p>
      <form
        className="mt-8 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await upsert({
            quote,
            attribution,
            role: "",
            approved,
            published: approved,
            sortOrder: (rows?.length ?? 0) + 1,
          });
          setQuote("");
          setAttribution("");
        }}
      >
        <Textarea label="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} />
        <Input label="Attribution" value={attribution} onChange={(e) => setAttribution(e.target.value)} />
        <Checkbox label="Approved for publication" checked={approved} onChange={(e) => setApproved(e.target.checked)} />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
