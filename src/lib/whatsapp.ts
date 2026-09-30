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

function quoteAnswer(label: string, value: string): string[] {
  const answer = value.trim();
  if (!answer) {
    return [];
  }
  return [label, answer, ""];
}

export function enquiryWhatsappMessage(input: {
  brandName?: string;
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
  const brand = input.brandName?.trim() || "Ink & Identity";
  const lines = [
    `Hello ${brand}, I would like a quote.`,
    "",
    ...quoteAnswer("Name", input.name),
    ...quoteAnswer("Email", input.email),
    ...quoteAnswer("Phone", input.phone),
    ...quoteAnswer("Who is this for?", CUSTOMER_LABELS[input.customerType] ?? input.customerType),
    ...quoteAnswer(
      "Product category",
      input.productName?.trim() || input.needType,
    ),
    ...quoteAnswer("Quantity", input.quantity.trim() || "1"),
    ...quoteAnswer("Design notes", input.brandNotes),
    ...quoteAnswer("Deadline", input.deadline),
    ...quoteAnswer("Budget", input.budget),
    ...quoteAnswer("Anything else", input.details),
    ...(input.fileNames.length
      ? quoteAnswer("Artwork to send in this chat", input.fileNames.join(", "))
      : []),
  ];
  return lines.join("\n").trim();
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
