import { mutation } from "./_generated/server";
import { requireStaff } from "./lib/permissions";
import {
  ALLOWED_QUOTE_MIME_TYPES,
  MAX_QUOTE_FILE_BYTES,
} from "./lib/validators";

export const generatePublicUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateQuoteUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export function assertQuoteFile(meta: {
  contentType?: string;
  size?: number;
}) {
  const type = meta.contentType ?? "";
  const size = meta.size ?? 0;
  if (!ALLOWED_QUOTE_MIME_TYPES.includes(type as (typeof ALLOWED_QUOTE_MIME_TYPES)[number])) {
    throw new Error("Artwork must be JPEG, PNG, WebP, SVG, PDF or AI/EPS.");
  }
  if (size > MAX_QUOTE_FILE_BYTES) {
    throw new Error("Each file must be 10MB or smaller.");
  }
}
