import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireStaff } from "./lib/permissions";
import { resolveImage } from "./lib/media";
import { imageAssetValidator } from "./lib/validators";

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("socialPosts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const visible = posts.sort((a, b) => a.sortOrder - b.sortOrder);
    return await Promise.all(
      visible.map(async (post) => ({
        ...post,
        image: await resolveImage(ctx, post.image),
      })),
    );
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return (await ctx.db.query("socialPosts").collect()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("socialPosts")),
    caption: v.string(),
    url: v.string(),
    platform: v.union(v.literal("instagram"), v.literal("facebook")),
    image: v.optional(imageAssetValidator),
    published: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...rest } = args;
    if (id) {
      await ctx.db.patch(id, rest);
      return id;
    }
    return await ctx.db.insert("socialPosts", { ...rest, sampleContent: false });
  },
});

export const archive = mutation({
  args: { id: v.id("socialPosts") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch(args.id, { published: false });
  },
});
