export const availabilityCopy: Record<string, string> = {
  available_to_quote: "Available to quote",
  made_to_order: "Made to order",
  limited: "Limited availability",
  temporarily_unavailable: "Temporarily unavailable",
  archived: "Archived",
};

export const customerTypeCopy: Record<string, string> = {
  business: "Business",
  school_team: "School / team",
  event: "Event",
  personal: "Personal",
  other: "Other",
};

export const quoteStatusCopy: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  quoted: "Quoted",
  approved: "Approved",
  in_production: "In production",
  completed: "Completed",
  archived: "Archived",
};

export function formatDate(value?: number) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}
