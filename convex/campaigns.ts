import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireStaff } from "./lib/permissions";
import { resolveImage } from "./lib/media";
import { isCampaignLive } from "./lib/quoteValidation";
import { slugify } from "./lib/slug";
import { imageAssetValidator } from "./lib/validators";

const campaignFields = {
  name: v.string(),
  slug: v.optional(v.string()),
  headline: v.string(),
  body: v.string(),
  ctaLabel: v.string(),
  ctaHref: v.string(),
  bannerImage: v.optional(imageAssetValidator),
  terms: v.string(),
  priceNote: v.string(),
  deadlineNote: v.string(),
  startAt: v.number(),
  endAt: v.number(),
  published: v.boolean(),
};

function withStatus<T extends { startAt: number; endAt: number; published: boolean; archived: boolean }>(
  campaign: T,
  now = Date.now(),
) {
  const live = campaign.published && !campaign.archived && isCampaignLive(campaign.startAt, campaign.endAt, now);
  return {
    ...campaign,
    live,
    expired: now > campaign.endAt,
    scheduled: now < campaign.startAt,
  };
}

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const active = campaigns
      .map((campaign) => withStatus(campaign, now))
      .filter((campaign) => campaign.live);
    return await Promise.all(
      active.map(async (campaign) => ({
        ...campaign,
        bannerImage: await resolveImage(ctx, campaign.bannerImage),
      })),
    );
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const now = Date.now();
    return (await ctx.db.query("campaigns").collect())
      .map((campaign) => withStatus(campaign, now))
      .sort((a, b) => b.startAt - a.startAt);
  },
});

export const create = mutation({
  args: campaignFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.endAt <= args.startAt) {
      throw new ConvexError("Campaign end must be after the start date.");
    }
    const slug = slugify(args.slug || args.name);
    return await ctx.db.insert("campaigns", {
      ...args,
      slug,
      archived: false,
      sampleContent: false,
    });
  },
});

export const update = mutation({
  args: { id: v.id("campaigns"), ...campaignFields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    if (rest.endAt <= rest.startAt) {
      throw new ConvexError("Campaign end must be after the start date.");
    }
    await ctx.db.patch(id, { ...rest, slug: slugify(rest.slug || rest.name) });
  },
});

export const archive = mutation({
  args: { id: v.id("campaigns"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { archived: args.archived, published: !args.archived });
  },
});
