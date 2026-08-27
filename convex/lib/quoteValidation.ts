export const ALLOWED_QUOTE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
]);

export const MAX_QUOTE_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_QUOTE_FILES = 5;

export type QuoteValidationInput = {
  name: string;
  email: string;
  phone?: string;
  customerType: string;
  needType: string;
  details?: string;
  consent: boolean;
  honeypot?: string;
  budget?: string;
  lines: Array<{ label: string; quantity: number }>;
  files?: Array<{ contentType: string; size: number }>;
};

export type QuoteValidationResult =
  | { ok: true; spam: boolean }
  | { ok: false; error: string };

const CUSTOMER_TYPES = new Set([
  "business",
  "school_team",
  "event",
  "personal",
  "other",
]);

export function validateQuoteRequest(
  input: QuoteValidationInput,
): QuoteValidationResult {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: true, spam: true };
  }
  if (input.name.trim().length < 2) {
    return { ok: false, error: "Please share your name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim().toLowerCase())) {
    return { ok: false, error: "Please use a valid email address." };
  }
  if (!CUSTOMER_TYPES.has(input.customerType)) {
    return { ok: false, error: "Please choose a customer type." };
  }
  if (input.needType.trim().length < 2) {
    return { ok: false, error: "Please tell us what you need." };
  }
  if (!input.consent) {
    return {
      ok: false,
      error: "Consent is required before we can store your enquiry.",
    };
  }
  if (input.lines.some((line) => line.quantity < 1 || line.quantity > 100000)) {
    return { ok: false, error: "Quantities must be at least 1." };
  }
  if (input.files && input.files.length > MAX_QUOTE_FILES) {
    return {
      ok: false,
      error: `You can attach up to ${MAX_QUOTE_FILES} files.`,
    };
  }
  if (input.files) {
    for (const file of input.files) {
      if (!ALLOWED_QUOTE_MIME.has(file.contentType)) {
        return {
          ok: false,
          error: "Artwork must be JPEG, PNG, WebP, SVG, PDF or AI/EPS.",
        };
      }
      if (file.size > MAX_QUOTE_FILE_BYTES) {
        return { ok: false, error: "Each file must be 10MB or smaller." };
      }
    }
  }
  return { ok: true, spam: false };
}

export function isCampaignLive(
  startAt: number,
  endAt: number,
  now = Date.now(),
): boolean {
  return now >= startAt && now <= endAt;
}
