import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getCurrentUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }
  return await ctx.db.get(userId);
}

export async function requireUser(ctx: Ctx): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (!user || user.status === "disabled") {
    throw new ConvexError("You need to sign in to continue.");
  }
  return user;
}

export async function requireStaff(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role !== "admin" && user.role !== "editor") {
    throw new ConvexError("Staff access is required.");
  }
  return user;
}

export async function requireAdmin(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireStaff(ctx);
  if (user.role !== "admin") {
    throw new ConvexError("Admin access is required.");
  }
  return user;
}

export function canManageSettings(user: Doc<"users">): boolean {
  return user.role === "admin";
}

export function canManageUsers(user: Doc<"users">): boolean {
  return user.role === "admin";
}

export function canManageContent(user: Doc<"users">): boolean {
  return user.role === "admin" || user.role === "editor";
}

export async function getPublicFileUrl(
  ctx: Ctx,
  storageId: Id<"_storage"> | undefined,
): Promise<string | null> {
  if (!storageId) {
    return null;
  }
  return await ctx.storage.getUrl(storageId);
}
