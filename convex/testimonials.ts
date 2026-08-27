import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireStaff } from "./lib/permissions";

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("approvedTestimonials")
      .withIndex("by_published_approved", (q) =>
        q.eq("published", true).eq("approved", true),
      )
      .collect();
    return rows
      .filter((item) => !item.archived)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return (await ctx.db.query("approvedTestimonials").collect()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("approvedTestimonials")),
    quote: v.string(),
    attribution: v.string(),
    role: v.string(),
    approved: v.boolean(),
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
    return await ctx.db.insert("approvedTestimonials", {
      ...rest,
      archived: false,
    });
  },
});

export const archive = mutation({
  args: { id: v.id("approvedTestimonials"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch(args.id, {
      archived: args.archived,
      ...(args.archived ? { published: false } : {}),
    });
  },
});
