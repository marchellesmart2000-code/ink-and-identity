import { convexEnabled } from "@/lib/convex-enabled";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export function useSiteSettings() {
  return useQuery(api.settings.getPublic, convexEnabled() ? {} : "skip");
}
