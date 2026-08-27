import { v } from "convex/values";
import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

export const notifyNewQuote = internalAction({
  args: { quoteId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    const payload = await ctx.runQuery(internal.notifications.getQuoteNotice, {
      quoteId: args.quoteId,
    });
    if (!payload) {
      return;
    }
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from || !payload.to) {
      console.info("Quote notification queued (email delivery not configured).", {
        quoteId: args.quoteId,
        name: payload.name,
      });
      return;
    }
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: `New quote request from ${payload.name}`,
        text: [
          `${payload.name} sent a quote request.`,
          `Email: ${payload.email}`,
          `Need: ${payload.needType}`,
          `Open the admin inbox to review details and artwork.`,
        ].join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("Quote notification email failed.", await response.text());
    }
  },
});

export const getQuoteNotice = internalQuery({
  args: { quoteId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    const quote = await ctx.db.get(args.quoteId);
    if (!quote || quote.spamFlag) {
      return null;
    }
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "site"))
      .unique();
    return {
      to: settings?.notificationEmail ?? "",
      name: quote.name,
      email: quote.email,
      needType: quote.needType,
    };
  },
});
