export const STUDIO = {
  email: "eksteentiane@gmail.com",
  phone: "083 456 9553",
  whatsapp: "083 456 9553",
  hours: [
    "Mon - Wed (15h00 - 20h00)",
    "Thur (13h00 - 20h00)",
    "Fri - Sat (09h00 - 18h00)",
    "Sun (Closed)",
  ].join("\n"),
  address: "3 Tamboti Str, White River",
  mapAddress: "3 Tamboti Street, White River, Mpumalanga, South Africa",
  serviceRegions: ["PUDO worldwide"],
  instagramUrl: "https://www.instagram.com/inkand.identity/",
  instagramHandle: "@inkand.identity",
  tiktokUrl: "https://www.tiktok.com/@inkand.identity",
  tiktokHandle: "@inkand.identity",
  facebookUrl: "https://www.facebook.com/share/19b1nbaNSY/",
} as const;

type StudioSettings = {
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  hours?: string | null;
  serviceRegions?: string[] | null;
  instagramUrl?: string | null;
  instagramHandle?: string | null;
  tiktokUrl?: string | null;
  tiktokHandle?: string | null;
  facebookUrl?: string | null;
  mapUrl?: string | null;
} | null | undefined;

function filled(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || /pending owner confirmation/i.test(trimmed) || /not yet published/i.test(trimmed)) {
    return "";
  }
  return trimmed;
}

export function resolveStudio(settings: StudioSettings) {
  const regions = (settings?.serviceRegions ?? [])
    .map((region) => region.trim())
    .filter((region) => region && !/pending owner confirmation/i.test(region));

  return {
    email: filled(settings?.email) || STUDIO.email,
    phone: filled(settings?.phone) || STUDIO.phone,
    whatsapp: filled(settings?.whatsapp) || filled(settings?.phone) || STUDIO.whatsapp,
    address: filled(settings?.address) || STUDIO.address,
    mapAddress: filled(settings?.address) || STUDIO.mapAddress,
    hours: filled(settings?.hours) || STUDIO.hours,
    serviceRegions: regions.length > 0 ? regions : [...STUDIO.serviceRegions],
    instagramUrl: filled(settings?.instagramUrl) || STUDIO.instagramUrl,
    instagramHandle: filled(settings?.instagramHandle) || STUDIO.instagramHandle,
    tiktokUrl: filled(settings?.tiktokUrl) || STUDIO.tiktokUrl,
    tiktokHandle: filled(settings?.tiktokHandle) || STUDIO.tiktokHandle,
    facebookUrl: filled(settings?.facebookUrl) || STUDIO.facebookUrl,
    mapUrl: filled(settings?.mapUrl),
  };
}
