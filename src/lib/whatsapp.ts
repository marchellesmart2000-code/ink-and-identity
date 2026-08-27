export function whatsappHref(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) {
    return null;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
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
