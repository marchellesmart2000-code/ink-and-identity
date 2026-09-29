/** Town-level fallback only — never a fabricated street address. */
export const STUDIO_TOWN_QUERY = "White River, Mpumalanga, South Africa";

export function googleMapsEmbedSrc(address?: string | null, mapUrl?: string | null) {
  const fromUrl = embedFromMapsUrl(mapUrl);
  if (fromUrl) {
    return fromUrl;
  }
  const query = address?.trim() || STUDIO_TOWN_QUERY;
  return mapsEmbedQuery(query, address?.trim() ? 16 : 13);
}

export function googleMapsDirectionsUrl(address?: string | null, mapUrl?: string | null) {
  const trimmed = mapUrl?.trim();
  if (trimmed) {
    return trimmed;
  }
  const query = address?.trim() || STUDIO_TOWN_QUERY;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsEmbedQuery(query: string, zoom = 13) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
}

function embedFromMapsUrl(mapUrl?: string | null) {
  const trimmed = mapUrl?.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.searchParams.get("output") === "embed") {
      return trimmed;
    }
    if (url.pathname.includes("/maps/embed")) {
      return trimmed;
    }
    const query = url.searchParams.get("q") ?? url.searchParams.get("query");
    if (query) {
      return mapsEmbedQuery(query);
    }
    const place = url.pathname.match(/\/maps\/place\/([^/]+)/);
    if (place?.[1]) {
      return mapsEmbedQuery(decodeURIComponent(place[1].replace(/\+/g, " ")));
    }
    const coords = url.pathname.match(/\/maps\/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/);
    if (coords) {
      return `https://maps.google.com/maps?q=${coords[1]},${coords[2]}&z=${Math.round(Number(coords[3]))}&output=embed`;
    }
    if (url.hostname.includes("google.") && url.pathname.includes("/maps")) {
      return mapsEmbedQuery(STUDIO_TOWN_QUERY);
    }
    return null;
  } catch {
    return null;
  }
}
