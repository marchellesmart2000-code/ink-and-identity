import { describe, expect, it } from "vitest";
import { QUOTE_CATEGORIES, quoteCategoryName } from "../src/lib/constants";

describe("QUOTE_CATEGORIES", () => {
  it("lists only the studio main categories plus custom and other", () => {
    expect(QUOTE_CATEGORIES.map((category) => category.name)).toEqual([
      "A custom request",
      "Acrylic Keyrings",
      "Coffee Mugs",
      "Click Pens",
      "Glass Clock",
      "Glass Fridge Magnets",
      "15oz Stainless Steel Tumbler",
      "20oz Stainless Steel Tumbler",
      "Mousepads",
      "Rubber Coasters",
      "Stainless Steel Waterbottle",
      "Bar mats",
      "TShirts",
      "Other Products",
    ]);
  });

  it("does not include catalogue sub-types", () => {
    const labels = QUOTE_CATEGORIES.map((category) => category.name).join("\n");
    expect(labels).not.toContain("Dog tags");
    expect(labels).not.toContain("Bone tag");
    expect(labels).not.toContain("Key rings");
  });

  it("resolves a slug to its label", () => {
    expect(quoteCategoryName("coffee-mugs")).toBe("Coffee Mugs");
  });
});
