import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireStaff } from "./lib/permissions";
import { resolveImage } from "./lib/media";
import { slugify } from "./lib/slug";
import { imageAssetValidator } from "./lib/validators";

const serviceFields = {
  name: v.string(),
  slug: v.optional(v.string()),
  eyebrow: v.string(),
  summary: v.string(),
  description: v.string(),
  process: v.string(),
  customerSegment: v.string(),
  heroImage: v.optional(imageAssetValidator),
  mark: v.string(),
  faqs: v.array(v.object({ question: v.string(), answer: v.string() })),
  seoTitle: v.string(),
  seoDescription: v.string(),
  featured: v.boolean(),
  published: v.boolean(),
  sortOrder: v.number(),
};

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const visible = services
      .filter((service) => !service.archived)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return await Promise.all(
      visible.map(async (service) => ({
        ...service,
        heroImage: await resolveImage(ctx, service.heroImage),
      })),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const service = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!service || !service.published || service.archived) {
      return null;
    }
    const products = await ctx.db.query("products").collect();
    const examples = products
      .filter(
        (product) =>
          product.published &&
          !product.archived &&
          product.serviceIds.includes(service._id),
      )
      .slice(0, 6)
      .map((product) => ({
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
      }));
    return {
      ...service,
      heroImage: await resolveImage(ctx, service.heroImage),
      examples,
    };
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const services = await ctx.db.query("services").collect();
    return services.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getAdmin = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: serviceFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const slug = slugify(args.slug || args.name);
    const existing = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new ConvexError("A service with this slug already exists.");
    }
    return await ctx.db.insert("services", {
      ...args,
      slug,
      archived: false,
      sampleContent: false,
    });
  },
});

export const update = mutation({
  args: { id: v.id("services"), ...serviceFields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    const slug = slugify(rest.slug || rest.name);
    await ctx.db.patch(id, { ...rest, slug });
  },
});

export const archive = mutation({
  args: { id: v.id("services"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      archived: args.archived,
      ...(args.archived ? { published: false } : {}),
    });
  },
});
