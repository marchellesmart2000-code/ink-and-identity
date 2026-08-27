import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireStaff } from "./lib/permissions";
import { resolveImage } from "./lib/media";
import { slugify } from "./lib/slug";
import { imageAssetValidator } from "./lib/validators";

const collectionFields = {
  name: v.string(),
  slug: v.optional(v.string()),
  headline: v.string(),
  summary: v.string(),
  description: v.string(),
  heroImage: v.optional(imageAssetValidator),
  seoTitle: v.string(),
  seoDescription: v.string(),
  published: v.boolean(),
  sortOrder: v.number(),
};

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const visible = collections
      .filter((item) => !item.archived)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return await Promise.all(
      visible.map(async (item) => ({
        ...item,
        heroImage: await resolveImage(ctx, item.heroImage),
      })),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const collection = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!collection || !collection.published || collection.archived) {
      return null;
    }
    return {
      ...collection,
      heroImage: await resolveImage(ctx, collection.heroImage),
    };
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return (await ctx.db.query("collections").collect()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  },
});

export const create = mutation({
  args: collectionFields,
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const slug = slugify(args.slug || args.name);
    const existing = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new ConvexError("A collection with this slug already exists.");
    }
    return await ctx.db.insert("collections", {
      ...args,
      slug,
      archived: false,
      sampleContent: false,
    });
  },
});

export const update = mutation({
  args: { id: v.id("collections"), ...collectionFields },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, slug: slugify(rest.slug || rest.name) });
  },
});

export const archive = mutation({
  args: { id: v.id("collections"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch(args.id, { archived: args.archived, published: !args.archived });
  },
});

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listCategoriesAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return (await ctx.db.query("categories").collect()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  },
});

export const upsertCategory = mutation({
  args: {
    id: v.optional(v.id("categories")),
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.string(),
    published: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const slug = slugify(args.slug || args.name);
    if (args.id) {
      await ctx.db.patch(args.id, {
        name: args.name,
        slug,
        description: args.description,
        published: args.published,
        sortOrder: args.sortOrder,
      });
      return args.id;
    }
    return await ctx.db.insert("categories", {
      name: args.name,
      slug,
      description: args.description,
      published: args.published,
      sortOrder: args.sortOrder,
      sampleContent: false,
    });
  },
});
