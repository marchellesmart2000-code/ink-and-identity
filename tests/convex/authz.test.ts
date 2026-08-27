/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";

const modules = import.meta.glob("../../convex/**/*.ts");

describe("authorization", () => {
  it("does not allow anonymous product writes", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.products.create, {
        name: "Secret tee",
        shortDescription: "x",
        longDescription: "x",
        categoryId: "jd7category000000000000000000" as never,
        collectionIds: [],
        serviceIds: [],
        tags: [],
        productType: "apparel",
        personalizationOptions: [],
        brandCollection: "",
        sku: "X",
        gallery: [],
        currency: "ZAR",
        priceDisplay: "request_quote",
        availability: "available_to_quote",
        leadTime: "",
        featured: false,
        newArrival: false,
        specifications: [],
        careInstructions: "",
        options: [],
        seoTitle: "x",
        seoDescription: "x",
        published: true,
        sortOrder: 1,
      }),
    ).rejects.toThrow();
  });

  it("does not allow anonymous settings updates", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.settings.update, {
        brandName: "Hijack",
        tagline: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        serviceRegions: [],
        hours: "",
        instagramUrl: "",
        instagramHandle: "",
        facebookUrl: "",
        mapUrl: "",
        heroVideoUrl: "",
        heroEyebrow: "",
        heroHeadline: "",
        heroSupport: "",
        primaryLanguage: "en",
        announcementEnabled: false,
        announcementText: "",
        announcementHref: "",
        defaultSeoTitle: "",
        defaultSeoDescription: "",
        privacyConsentCopy: "",
        aboutStory: "",
        aboutProcess: "",
        ownerName: "",
        ownerNamePublished: false,
        notificationEmail: "",
        processSteps: [],
        trustStatements: [],
        values: [],
        editorialHeadline: "",
        editorialBody: "",
        finalCtaHeadline: "",
        finalCtaBody: "",
      }),
    ).rejects.toThrow();
  });

  it("rejects a quote without consent", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.quotes.submit, {
        name: "Test Person",
        email: "person@example.com",
        phone: "",
        customerType: "personal",
        needType: "gifts",
        details: "",
        brandNotes: "",
        deadline: "",
        budget: "",
        lines: [{ label: "Mug", quantity: 1, notes: "" }],
        consent: false,
        sourcePath: "/quote",
        files: [],
      }),
    ).rejects.toThrow();
  });
});
