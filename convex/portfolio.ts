import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireStaff } from "./lib/permissions";
import { resolveGallery, resolveImage } from "./lib/media";
import { slugify } from "./lib/slug";
import { customerTypeValidator, imageAssetValidator } from "./lib/validators";

const projectFields = {
  title: v.string(),
  slug: v.optional(v.string()),
  summary: v.string(),
  brief: v.string(),
  customerType: customerTypeValidator,
  category: v.string(),
  productsUsed: v.array(v.string()),
  coloursMaterials: v.string(),
  coverImage: v.optional(imageAssetValidator),
  gallery: v.array(imageAssetValidator),
  published: v.boolean(),
  featured: v.boolean(),
  projectDate: v.optional(v.number()),
  seoTitle: v.string(),
  seoDescription: v.string(),
  sortOrder: v.number(),
};

export const listPublic = query({
  args: {
    customerType: v.optional(customerTypeValidator),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("portfolioProjects")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const visible = projects
      .filter((project) => !project.archived)
      .filter((project) =>
        args.customerType ? project.customerType === args.customerType : true,
      )
      .filter((project) =>
        args.category ? project.category === args.category : true,
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return await Promise.all(
      visible.map(async (project) => ({
        ...project,
        coverImage: await resolveImage(ctx, project.coverImage),
      })),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("portfolioProjects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!project || !project.published || project.archived) {
      return null;
    }
    return {
      ...project,
      coverImage: await resolveImage(ctx, project.coverImage),
      gallery: await resolveGallery(ctx, project.gallery),
    };
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return (await ctx.db.query("portfolioProjects").collect()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  },
});

export const getAdmin = query({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) {
      return null;
    }
    return {
      ...project,
      coverImage: await resolveImage(ctx, project.coverImage),
      gallery: await resolveGallery(ctx, project.gallery),
    };
  },
});

export const create = mutation({
  args: projectFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const slug = slugify(args.slug || args.title);
    const existing = await ctx.db
      .query("portfolioProjects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new ConvexError("A project with this slug already exists.");
    }
    return await ctx.db.insert("portfolioProjects", {
      ...args,
      slug,
      archived: false,
      sampleContent: false,
    });
  },
});

export const update = mutation({
  args: { id: v.id("portfolioProjects"), ...projectFields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, slug: slugify(rest.slug || rest.title) });
  },
});

export const archive = mutation({
  args: { id: v.id("portfolioProjects"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      archived: args.archived,
      ...(args.archived ? { published: false } : {}),
    });
  },
});
