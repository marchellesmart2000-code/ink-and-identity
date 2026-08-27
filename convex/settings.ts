import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireStaff } from "./lib/permissions";
import { localeValidator } from "./lib/validators";

const settingsFields = {
  brandName: v.string(),
  tagline: v.string(),
  logoStorageId: v.optional(v.id("_storage")),
  phone: v.string(),
  whatsapp: v.string(),
  email: v.string(),
  address: v.string(),
  serviceRegions: v.array(v.string()),
  hours: v.string(),
  instagramUrl: v.string(),
  instagramHandle: v.string(),
  facebookUrl: v.string(),
  mapUrl: v.string(),
  heroVideoUrl: v.string(),
  heroPosterStorageId: v.optional(v.id("_storage")),
  heroEyebrow: v.string(),
  heroHeadline: v.string(),
  heroSupport: v.string(),
  primaryLanguage: localeValidator,
  announcementEnabled: v.boolean(),
  announcementText: v.string(),
  announcementHref: v.string(),
  defaultSeoTitle: v.string(),
  defaultSeoDescription: v.string(),
  privacyConsentCopy: v.string(),
  aboutStory: v.string(),
  aboutProcess: v.string(),
  ownerName: v.string(),
  ownerNamePublished: v.boolean(),
  notificationEmail: v.string(),
  processSteps: v.array(v.object({ title: v.string(), body: v.string() })),
  trustStatements: v.array(v.string()),
  values: v.array(v.object({ title: v.string(), body: v.string() })),
  editorialHeadline: v.string(),
  editorialBody: v.string(),
  finalCtaHeadline: v.string(),
  finalCtaBody: v.string(),
  translationsAf: v.optional(
    v.object({
      navServices: v.string(),
      navShop: v.string(),
      navPortfolio: v.string(),
      navAbout: v.string(),
      navJournal: v.string(),
      navContact: v.string(),
      ctaQuote: v.string(),
      ctaWhatsapp: v.string(),
      ctaExplore: v.string(),
    }),
  ),
};

export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "site"))
      .unique();
    if (!settings) {
      return null;
    }
    const logoUrl = settings.logoStorageId
      ? await ctx.storage.getUrl(settings.logoStorageId)
      : null;
    const heroPosterUrl = settings.heroPosterStorageId
      ? await ctx.storage.getUrl(settings.heroPosterStorageId)
      : null;
    return {
      brandName: settings.brandName,
      tagline: settings.tagline,
      logoUrl,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      serviceRegions: settings.serviceRegions,
      hours: settings.hours,
      instagramUrl: settings.instagramUrl,
      instagramHandle: settings.instagramHandle,
      facebookUrl: settings.facebookUrl,
      mapUrl: settings.mapUrl,
      heroVideoUrl: settings.heroVideoUrl,
      heroPosterUrl,
      heroEyebrow: settings.heroEyebrow,
      heroHeadline: settings.heroHeadline,
      heroSupport: settings.heroSupport,
      primaryLanguage: settings.primaryLanguage,
      announcementEnabled: settings.announcementEnabled,
      announcementText: settings.announcementText,
      announcementHref: settings.announcementHref,
      defaultSeoTitle: settings.defaultSeoTitle,
      defaultSeoDescription: settings.defaultSeoDescription,
      privacyConsentCopy: settings.privacyConsentCopy,
      aboutStory: settings.aboutStory,
      aboutProcess: settings.aboutProcess,
      ownerName: settings.ownerNamePublished ? settings.ownerName : "",
      processSteps: settings.processSteps,
      trustStatements: settings.trustStatements,
      values: settings.values,
      editorialHeadline: settings.editorialHeadline,
      editorialBody: settings.editorialBody,
      finalCtaHeadline: settings.finalCtaHeadline,
      finalCtaBody: settings.finalCtaBody,
      sampleContent: settings.sampleContent,
      translationsAf: settings.translationsAf,
    };
  },
});

export const getAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "site"))
      .unique();
    if (!settings) {
      return null;
    }
    const logoUrl = settings.logoStorageId
      ? await ctx.storage.getUrl(settings.logoStorageId)
      : null;
    const heroPosterUrl = settings.heroPosterStorageId
      ? await ctx.storage.getUrl(settings.heroPosterStorageId)
      : null;
    return { ...settings, logoUrl, heroPosterUrl };
  },
});

export const update = mutation({
  args: settingsFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "site"))
      .unique();
    if (!existing) {
      throw new Error("Site settings have not been initialised. Run seed first.");
    }
    await ctx.db.patch(existing._id, args);
  },
});
