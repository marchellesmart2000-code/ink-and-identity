export function convexEnabled() {
  return Boolean(import.meta.env.VITE_CONVEX_URL?.trim());
}
