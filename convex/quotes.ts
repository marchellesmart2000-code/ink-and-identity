import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireStaff } from "./lib/permissions";
import { validateQuoteRequest } from "./lib/quoteValidation";
import {
  customerTypeValidator,
  quoteLineValidator,
  quoteStatusValidator,
} from "./lib/validators";
import { assertQuoteFile } from "./files";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    customerType: customerTypeValidator,
    needType: v.string(),
    details: v.string(),
    brandNotes: v.string(),
    deadline: v.string(),
    budget: v.string(),
    lines: v.array(quoteLineValidator),
    consent: v.boolean(),
    sourcePath: v.string(),
    honeypot: v.optional(v.string()),
    files: v.array(
      v.object({
        storageId: v.id("_storage"),
        fileName: v.string(),
        contentType: v.string(),
        size: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const validation = validateQuoteRequest({
      name: args.name,
      email: args.email,
      phone: args.phone,
      customerType: args.customerType,
      needType: args.needType,
      details: args.details,
      consent: args.consent,
      honeypot: args.honeypot,
      budget: args.budget,
      lines: args.lines,
      files: args.files,
    });
    if (!validation.ok) {
      throw new ConvexError(validation.error);
    }

    const email = args.email.trim().toLowerCase();
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = await ctx.db
      .query("quoteRequests")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    const recentCount = recent.filter((item) => item.createdAt > dayAgo).length;
    if (recentCount >= 5) {
      throw new ConvexError(
        "We have already received several notes from this email today. We will be in touch.",
      );
    }

    const now = Date.now();
    const whatsappPrefill = [
      `Hello Ink & Identity,`,
      `I would like to enquire about ${args.needType}.`,
      args.lines.length
        ? `Items: ${args.lines.map((line) => `${line.label} x${line.quantity}`).join(", ")}`
        : "",
      `Page: ${args.sourcePath}`,
    ]
      .filter(Boolean)
      .join(" ");

    const quoteId = await ctx.db.insert("quoteRequests", {
      name: args.name.trim(),
      email,
      phone: args.phone.trim(),
      customerType: args.customerType,
      needType: args.needType.trim(),
      details: args.details.trim(),
      brandNotes: args.brandNotes.trim(),
      deadline: args.deadline.trim(),
      budget: args.budget.trim(),
      lines: args.lines,
      status: validation.spam ? "archived" : "new",
      consent: true,
      sourcePath: args.sourcePath,
      whatsappPrefill,
      spamFlag: validation.spam,
      internalNotes: [],
      createdAt: now,
      updatedAt: now,
    });

    if (!validation.spam) {
      for (const file of args.files) {
        const meta = await ctx.db.system.get(file.storageId);
        assertQuoteFile({
          contentType: meta?.contentType ?? file.contentType,
          size: meta?.size ?? file.size,
        });
        await ctx.db.insert("quoteFiles", {
          quoteRequestId: quoteId,
          storageId: file.storageId,
          fileName: file.fileName,
          contentType: file.contentType,
          size: file.size,
          publicAccess: false,
        });
      }
      await ctx.scheduler.runAfter(0, internal.notifications.notifyNewQuote, {
        quoteId,
      });
    }

    return { id: quoteId, spam: validation.spam };
  },
});

export const listAdmin = query({
  args: {
    status: v.optional(quoteStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const quotes = args.status
      ? await ctx.db
          .query("quoteRequests")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("quoteRequests").collect();
    return quotes
      .filter((quote) => !quote.spamFlag)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getAdmin = query({
  args: { id: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const quote = await ctx.db.get(args.id);
    if (!quote) {
      return null;
    }
    const files = await ctx.db
      .query("quoteFiles")
      .withIndex("by_quote", (q) => q.eq("quoteRequestId", args.id))
      .collect();
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      })),
    );
    return { ...quote, files: filesWithUrls };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("quoteRequests"),
    status: quoteStatusValidator,
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
  },
});

export const addNote = mutation({
  args: {
    id: v.id("quoteRequests"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    const quote = await ctx.db.get(args.id);
    if (!quote) {
      throw new ConvexError("Quote request not found.");
    }
    await ctx.db.patch(args.id, {
      updatedAt: Date.now(),
      internalNotes: [
        ...quote.internalNotes,
        {
          body: args.body.trim(),
          authorName: user.name || user.email || "Studio",
          createdAt: Date.now(),
        },
      ],
    });
  },
});
