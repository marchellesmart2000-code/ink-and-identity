import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";

type Settings = NonNullable<FunctionReturnType<typeof api.settings.getAdmin>>;

function toForm(settings: Settings) {
  return {
    brandName: settings.brandName,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    hours: settings.hours,
    instagramUrl: settings.instagramUrl,
    instagramHandle: settings.instagramHandle,
    facebookUrl: settings.facebookUrl,
    mapUrl: settings.mapUrl,
    heroVideoUrl: settings.heroVideoUrl,
    heroEyebrow: settings.heroEyebrow,
    heroHeadline: settings.heroHeadline,
    heroSupport: settings.heroSupport,
    announcementText: settings.announcementText,
    announcementHref: settings.announcementHref,
    defaultSeoTitle: settings.defaultSeoTitle,
    defaultSeoDescription: settings.defaultSeoDescription,
    privacyConsentCopy: settings.privacyConsentCopy,
    aboutStory: settings.aboutStory,
    aboutProcess: settings.aboutProcess,
    ownerName: settings.ownerName,
    notificationEmail: settings.notificationEmail,
    editorialHeadline: settings.editorialHeadline,
    editorialBody: settings.editorialBody,
    finalCtaHeadline: settings.finalCtaHeadline,
    finalCtaBody: settings.finalCtaBody,
    serviceRegions: settings.serviceRegions.join("\n"),
    announcementEnabled: settings.announcementEnabled,
    ownerNamePublished: settings.ownerNamePublished,
  };
}

export function SettingsAdminPage() {
  const settings = useQuery(api.settings.getAdmin);
  const me = useQuery(api.users.me);
  if (me && me.role !== "admin") {
    return <p>Settings are limited to administrators.</p>;
  }
  if (!settings) {
    return <p>Loading settings…</p>;
  }
  return <SettingsForm key={settings._id} settings={settings} />;
}

function SettingsForm({ settings }: { settings: Settings }) {
  const update = useMutation(api.settings.update);
  const { push } = useToast();
  const [form, setForm] = useState(() => toForm(settings));

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await update({
          brandName: form.brandName,
          tagline: form.tagline,
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          address: form.address,
          hours: form.hours,
          instagramUrl: form.instagramUrl,
          instagramHandle: form.instagramHandle,
          facebookUrl: form.facebookUrl,
          mapUrl: form.mapUrl,
          heroVideoUrl: form.heroVideoUrl,
          heroEyebrow: form.heroEyebrow,
          heroHeadline: form.heroHeadline,
          heroSupport: form.heroSupport,
          announcementText: form.announcementText,
          announcementHref: form.announcementHref,
          defaultSeoTitle: form.defaultSeoTitle,
          defaultSeoDescription: form.defaultSeoDescription,
          privacyConsentCopy: form.privacyConsentCopy,
          aboutStory: form.aboutStory,
          aboutProcess: form.aboutProcess,
          ownerName: form.ownerName,
          notificationEmail: form.notificationEmail,
          editorialHeadline: form.editorialHeadline,
          editorialBody: form.editorialBody,
          finalCtaHeadline: form.finalCtaHeadline,
          finalCtaBody: form.finalCtaBody,
          serviceRegions: form.serviceRegions.split("\n").map((item) => item.trim()).filter(Boolean),
          announcementEnabled: form.announcementEnabled,
          ownerNamePublished: form.ownerNamePublished,
          primaryLanguage: settings.primaryLanguage,
          processSteps: settings.processSteps,
          trustStatements: settings.trustStatements,
          values: settings.values,
          translationsAf: settings.translationsAf,
          logoStorageId: settings.logoStorageId,
          heroPosterStorageId: settings.heroPosterStorageId,
        });
        push("Settings saved.");
      }}
    >
      <h1 className="display text-5xl">Settings</h1>
      <Input label="Brand name" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} />
      <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
      <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="WhatsApp number" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
      <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <Input label="Hours" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
      <Textarea label="Service regions (one per line)" value={form.serviceRegions} onChange={(e) => setForm({ ...form, serviceRegions: e.target.value })} />
      <Input label="Instagram URL" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
      <Input label="Instagram handle" value={form.instagramHandle} onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })} />
      <Input label="Facebook URL" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
      <Input
        label="Map / directions URL (Google Maps link or embed)"
        value={form.mapUrl}
        onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
      />
      <p className="text-xs text-ivory/55">
        The contact page embeds this pin. Leave it blank to show White River / Witrivier until a street address is published.
      </p>
      <Input label="Hero video URL" value={form.heroVideoUrl} onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })} />
      <Input label="Hero eyebrow" value={form.heroEyebrow} onChange={(e) => setForm({ ...form, heroEyebrow: e.target.value })} />
      <Input label="Hero headline" value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />
      <Textarea label="Hero support" value={form.heroSupport} onChange={(e) => setForm({ ...form, heroSupport: e.target.value })} />
      <Checkbox label="Announcement enabled" checked={form.announcementEnabled} onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })} />
      <Input label="Announcement" value={form.announcementText} onChange={(e) => setForm({ ...form, announcementText: e.target.value })} />
      <Input label="Default SEO title" value={form.defaultSeoTitle} onChange={(e) => setForm({ ...form, defaultSeoTitle: e.target.value })} />
      <Textarea label="Default SEO description" value={form.defaultSeoDescription} onChange={(e) => setForm({ ...form, defaultSeoDescription: e.target.value })} />
      <Textarea label="Privacy / consent copy" value={form.privacyConsentCopy} onChange={(e) => setForm({ ...form, privacyConsentCopy: e.target.value })} />
      <Textarea label="About story" value={form.aboutStory} onChange={(e) => setForm({ ...form, aboutStory: e.target.value })} />
      <Input label="Owner name (unpublished until approved)" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
      <Checkbox label="Publish owner name" checked={form.ownerNamePublished} onChange={(e) => setForm({ ...form, ownerNamePublished: e.target.checked })} />
      <Input label="Notification email" value={form.notificationEmail} onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })} />
      <Button type="submit">Save settings</Button>
    </form>
  );
}
