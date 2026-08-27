import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { action, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireAdmin, requireStaff } from "./lib/permissions";
import { isEmail } from "./lib/slug";
import { roleValidator } from "./lib/validators";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      _id: user._id,
      email: user.email ?? "",
      name: user.name ?? "",
      role: user.role ?? "editor",
      status: user.status ?? "active",
    };
  },
});

export const listStaff = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    return users
      .filter((user) => user.role === "admin" || user.role === "editor")
      .map((user) => ({
        _id: user._id,
        email: user.email ?? "",
        name: user.name ?? "",
        role: user.role ?? "editor",
        status: user.status ?? "active",
      }));
  },
});

export const hasAnyAdmin = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").withIndex("by_role", (q) => q.eq("role", "admin")).first();
    return users !== null;
  },
});

export const updateOwnName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    await ctx.db.patch(user._id, { name: args.name.trim() });
  },
});

export const setUserStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("disabled")),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === args.userId && args.status === "disabled") {
      throw new ConvexError("You cannot disable your own account.");
    }
    await ctx.db.patch(args.userId, { status: args.status });
  },
});

export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === args.userId && args.role !== "admin") {
      throw new ConvexError("You cannot remove your own admin role.");
    }
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const bootstrapAdmin = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
    if (!expected || args.token !== expected) {
      throw new ConvexError("Invalid bootstrap token.");
    }
    const exists = await ctx.runQuery(internal.users.hasAnyAdminInternal);
    if (exists) {
      throw new ConvexError("An administrator already exists. Bootstrap is closed.");
    }
    if (!isEmail(args.email)) {
      throw new ConvexError("Please use a valid email address.");
    }
    if (args.password.length < 12) {
      throw new ConvexError("Password must be at least 12 characters.");
    }
    await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email.trim().toLowerCase(),
        secret: args.password,
      },
      profile: {
        email: args.email.trim().toLowerCase(),
        name: args.name.trim(),
        role: "admin",
        status: "active",
      },
    });
    return { ok: true as const };
  },
});

export const createStaff = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You need to sign in to continue.");
    }
    const actor = await ctx.runQuery(internal.users.getBySubject, {
      subject: identity.subject,
    });
    if (!actor || actor.role !== "admin") {
      throw new ConvexError("Admin access is required.");
    }
    if (!isEmail(args.email)) {
      throw new ConvexError("Please use a valid email address.");
    }
    if (args.password.length < 12) {
      throw new ConvexError("Password must be at least 12 characters.");
    }
    await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email.trim().toLowerCase(),
        secret: args.password,
      },
      profile: {
        email: args.email.trim().toLowerCase(),
        name: args.name.trim(),
        role: args.role,
        status: "active",
      },
    });
    return { ok: true as const };
  },
});

export const hasAnyAdminInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
    return admin !== null;
  },
});

export const getBySubject = internalQuery({
  args: { subject: v.string() },
  handler: async (ctx, args) => {
    const userId = args.subject.split("|")[0];
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId as Id<"users">);
  },
});
