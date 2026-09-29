export const CONTACT_WHATSAPP_MESSAGE =
  "Hello Ink & Identity, I would like to get in touch.";

export function orderWhatsappMessage(input: {
  name: string;
  category?: string;
  priceLabel?: string;
  url: string;
}) {
  return [
    `Hello Ink & Identity, I would like to order ${input.name}.`,
    input.category ? `Category: ${input.category}` : null,
    "Finish: Sublimation",
    input.priceLabel ? `Listed price: ${input.priceLabel}` : null,
    input.url,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

const CUSTOMER_LABELS: Record<string, string> = {
  business: "Business",
  school_team: "School / team",
  event: "Event",
  personal: "Personal",
  other: "Other",
};

export function normalizeWhatsappNumber(number: string): string {
  let digits = number.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    digits = `27${digits.slice(1)}`;
  }
  return digits;
}

export function whatsappHref(number: string, message: string): string | null {
  const digits = normalizeWhatsappNumber(number);
  if (digits.length < 8) {
    return null;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function enquiryWhatsappMessage(input: {
  name: string;
  email: string;
  phone: string;
  customerType: string;
  needType: string;
  productName?: string;
  quantity: string;
  brandNotes: string;
  deadline: string;
  budget: string;
  details: string;
  fileNames: string[];
}): string {
  const lines = [
    "Hello Ink & Identity, I would like a quote.",
    "",
    `Name: ${input.name.trim()}`,
    `Email: ${input.email.trim()}`,
    input.phone.trim() ? `Phone: ${input.phone.trim()}` : null,
    `This is for: ${CUSTOMER_LABELS[input.customerType] ?? input.customerType}`,
    `Need: ${input.needType.trim()}`,
    input.productName ? `Piece: ${input.productName}` : null,
    `Quantity: ${input.quantity.trim() || "1"}`,
    input.brandNotes.trim() ? `Design notes: ${input.brandNotes.trim()}` : null,
    input.deadline.trim() ? `Deadline: ${input.deadline.trim()}` : null,
    input.budget.trim() ? `Budget: ${input.budget.trim()}` : null,
    input.details.trim() ? `Details: ${input.details.trim()}` : null,
    input.fileNames.length
      ? `Artwork to send in this chat: ${input.fileNames.join(", ")}`
      : null,
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export function siteOrigin(): string {
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://inkandidentity.example";
}
