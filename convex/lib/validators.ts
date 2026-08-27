import { v } from "convex/values";

export const roleValidator = v.union(v.literal("admin"), v.literal("editor"));
export const userStatusValidator = v.union(
  v.literal("active"),
  v.literal("disabled"),
);
export const localeValidator = v.union(v.literal("en"), v.literal("af"));
export const publishStateValidator = v.union(
  v.literal("draft"),
  v.literal("published"),
);
export const availabilityValidator = v.union(
  v.literal("available_to_quote"),
  v.literal("made_to_order"),
  v.literal("limited"),
  v.literal("temporarily_unavailable"),
  v.literal("archived"),
);
export const priceDisplayValidator = v.union(
  v.literal("show_price"),
  v.literal("request_quote"),
  v.literal("hidden"),
);
export const customerTypeValidator = v.union(
  v.literal("business"),
  v.literal("school_team"),
  v.literal("event"),
  v.literal("personal"),
  v.literal("other"),
);
export const quoteStatusValidator = v.union(
  v.literal("new"),
  v.literal("reviewing"),
  v.literal("quoted"),
  v.literal("approved"),
  v.literal("in_production"),
  v.literal("completed"),
  v.literal("archived"),
);
export const campaignStatusValidator = v.union(
  v.literal("scheduled"),
  v.literal("active"),
  v.literal("expired"),
);
export const imageAssetValidator = v.object({
  storageId: v.id("_storage"),
  alt: v.string(),
  caption: v.optional(v.string()),
  sortOrder: v.number(),
});
export const productOptionValidator = v.object({
  name: v.string(),
  values: v.array(v.string()),
});
export const quoteLineValidator = v.object({
  productId: v.optional(v.id("products")),
  serviceId: v.optional(v.id("services")),
  label: v.string(),
  quantity: v.number(),
  notes: v.string(),
});

export const MAX_QUOTE_FILES = 5;
export const MAX_QUOTE_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_QUOTE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
] as const;
