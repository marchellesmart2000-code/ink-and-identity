import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { GoldRule } from "@/components/ui/GoldRule";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function AboutPage() {
  const settings = useSiteSettings();
  return (
    <div className="container-wide py-16">
      <Seo
        title="About | Ink & Identity"
        description="The story, values and process behind Ink & Identity — a custom printing and creative product studio in Mpumalanga."
        path="/about"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <h1 className="display mt-8 max-w-3xl text-6xl md:text-7xl">A studio for things people keep.</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/70">{settings?.aboutStory}</p>
      {settings?.ownerName ? (
        <p className="mt-6 text-sm text-gold">Guided by {settings.ownerName}.</p>
      ) : null}
      <GoldRule className="my-12 max-w-48" />
      <div className="grid gap-10 md:grid-cols-3">
        {(settings?.values ?? []).map((value) => (
          <div key={value.title}>
            <h2 className="display text-4xl">{value.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ivory/70">{value.body}</p>
          </div>
        ))}
      </div>
      <section className="mt-20 max-w-2xl">
        <h2 className="display text-5xl">How the work happens</h2>
        <p className="mt-6 leading-relaxed text-ivory/70">{settings?.aboutProcess}</p>
        <div className="mt-8">
          <Button href="/quote">Start a conversation</Button>
        </div>
      </section>
    </div>
  );
}
