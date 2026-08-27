import { describe, expect, it } from "vitest";
import { googleMapsDirectionsUrl, googleMapsEmbedSrc, STUDIO_TOWN_QUERY } from "../src/lib/maps";

describe("googleMapsEmbedSrc", () => {
  it("falls back to the studio town when no address is published", () => {
    expect(googleMapsEmbedSrc("", "")).toContain(encodeURIComponent(STUDIO_TOWN_QUERY));
    expect(googleMapsEmbedSrc("", "")).toContain("output=embed");
  });

  it("uses a published street address as the pin", () => {
    const src = googleMapsEmbedSrc("12 Example Street, White River", "");
    expect(src).toContain(encodeURIComponent("12 Example Street, White River"));
  });

  it("converts a Google Maps search URL into an embed", () => {
    const src = googleMapsEmbedSrc(
      "",
      "https://www.google.com/maps?q=Nelspruit%2C+Mpumalanga",
    );
    expect(src).toContain(encodeURIComponent("Nelspruit, Mpumalanga"));
    expect(src).toContain("output=embed");
  });

  it("keeps an existing embed URL", () => {
    const embed = "https://maps.google.com/maps?q=White+River&output=embed";
    expect(googleMapsEmbedSrc("", embed)).toBe(embed);
  });
});

describe("googleMapsDirectionsUrl", () => {
  it("prefers a stored directions URL", () => {
    expect(googleMapsDirectionsUrl("", "https://maps.app.goo.gl/studio")).toBe(
      "https://maps.app.goo.gl/studio",
    );
  });

  it("builds a search URL from the town when nothing is stored", () => {
    expect(googleMapsDirectionsUrl("", "")).toContain("query=");
    expect(googleMapsDirectionsUrl("", "")).toContain(encodeURIComponent(STUDIO_TOWN_QUERY));
  });
});
