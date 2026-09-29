import { useEffect, useState } from "react";

export const FEATURED_STORAGE_KEY = "ink-identity-featured-v1";

export const DEFAULT_FEATURED = [
  "gideon-mug-coaster",
  "landie-mug-coaster",
  "hannie-mug-coaster",
  "chris-adventure-set",
  "eksteen-family-pillow",
  "family-photo-clock",
  "super-aj-coolers",
  "mikayla-coolers",
  "photo-collage-bar-mat",
  "diana-set",
  "luca-army-tags",
  "brandy-collection",
  "nellie-bottle",
  "manzelle-mugs",
  "photo-keyring",
  "she-is-worthy-coaster",
];

export function readStoredFeatured(): string[] | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(FEATURED_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

export function writeStoredFeatured(slugs: string[]) {
  window.localStorage.setItem(FEATURED_STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("ink-featured"));
}

export function useFeaturedSlugs(remote: readonly string[] | null | undefined) {
  const stored = useStoredFeatured();
  if (Array.isArray(remote)) {
    return remote;
  }
  return stored ?? DEFAULT_FEATURED;
}

export function useStoredFeatured() {
  const [slugs, setSlugs] = useState<string[] | null>(null);
  useEffect(() => {
    const sync = () => setSlugs(readStoredFeatured());
    sync();
    window.addEventListener("ink-featured", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ink-featured", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return slugs;
}
