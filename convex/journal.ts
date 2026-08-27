import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireStaff } from "./lib/permissions";
import { resolveImage } from "./lib/media";
import { slugify } from "./lib/slug";
import { imageAssetValidator, publishStateValidator } from "./lib/validators";

const postFields = {
  title: v.string(),
  slug: v.optional(v.string()),
  excerpt: v.string(),
  body: v.string(),
  coverImage: v.optional(imageAssetValidator),
  author: v.string(),
  publishedAt: v.optional(v.number()),
  tags: v.array(v.string()),
  seoTitle: v.string(),
  seoDescription: v.string(),
  canonicalUrl: v.string(),
  status: publishStateValidator,
};

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("journalPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const visible = posts
      .filter((post) => !post.archived)
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    return await Promise.all(
      visible.map(async (post) => ({
        ...post,
        coverImage: await resolveImage(ctx, post.coverImage),
      })),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("journalPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!post || post.status !== "published" || post.archived) {
      return null;
    }
    return {
      ...post,
      coverImage: await resolveImage(ctx, post.coverImage),
    };
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return (await ctx.db.query("journalPosts").collect()).sort(
      (a, b) => (b.publishedAt ?? b._creationTime) - (a.publishedAt ?? a._creationTime),
    );
  },
});

export const getAdmin = query({
  args: { id: v.id("journalPosts") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: postFields,
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const slug = slugify(args.slug || args.title);
    const existing = await ctx.db
      .query("journalPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new ConvexError("An article with this slug already exists.");
    }
    return await ctx.db.insert("journalPosts", {
      ...args,
      slug,
      publishedAt:
        args.status === "published" ? args.publishedAt ?? Date.now() : args.publishedAt,
      archived: false,
      sampleContent: false,
    });
  },
});

export const update = mutation({
  args: { id: v.id("journalPosts"), ...postFields },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      ...rest,
      slug: slugify(rest.slug || rest.title),
      publishedAt:
        rest.status === "published" ? rest.publishedAt ?? Date.now() : rest.publishedAt,
    });
  },
});

export const archive = mutation({
  args: { id: v.id("journalPosts"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch(args.id, {
      archived: args.archived,
      ...(args.archived ? { status: "draft" as const } : {}),
    });
  },
});
