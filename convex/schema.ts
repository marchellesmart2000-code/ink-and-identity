import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  availabilityValidator,
  customerTypeValidator,
  imageAssetValidator,
  localeValidator,
  priceDisplayValidator,
  productOptionValidator,
  publishStateValidator,
  quoteLineValidator,
  quoteStatusValidator,
  roleValidator,
  userStatusValidator,
} from "./lib/validators";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(roleValidator),
    status: v.optional(userStatusValidator),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_role", ["role"]),

  siteSettings: defineTable({
    key: v.literal("site"),
    brandName: v.string(),
    tagline: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    phone: v.string(),
    whatsapp: v.string(),
    email: v.string(),
    address: v.string(),
    serviceRegions: v.array(v.string()),
    hours: v.string(),
    instagramUrl: v.string(),
    instagramHandle: v.string(),
    facebookUrl: v.string(),
    mapUrl: v.string(),
    heroVideoUrl: v.string(),
    heroPosterStorageId: v.optional(v.id("_storage")),
    heroEyebrow: v.string(),
    heroHeadline: v.string(),
    heroSupport: v.string(),
    primaryLanguage: localeValidator,
    announcementEnabled: v.boolean(),
    announcementText: v.string(),
    announcementHref: v.string(),
    defaultSeoTitle: v.string(),
    defaultSeoDescription: v.string(),
    privacyConsentCopy: v.string(),
    aboutStory: v.string(),
    aboutProcess: v.string(),
    ownerName: v.string(),
    ownerNamePublished: v.boolean(),
    notificationEmail: v.string(),
    processSteps: v.array(
      v.object({
        title: v.string(),
        body: v.string(),
      }),
    ),
    trustStatements: v.array(v.string()),
    values: v.array(
      v.object({
        title: v.string(),
        body: v.string(),
      }),
    ),
    editorialHeadline: v.string(),
    editorialBody: v.string(),
    finalCtaHeadline: v.string(),
    finalCtaBody: v.string(),
    sampleContent: v.boolean(),
    translationsAf: v.optional(
      v.object({
        navServices: v.string(),
        navShop: v.string(),
        navPortfolio: v.string(),
        navAbout: v.string(),
        navJournal: v.string(),
        navContact: v.string(),
        ctaQuote: v.string(),
        ctaWhatsapp: v.string(),
        ctaExplore: v.string(),
      }),
    ),
  }).index("by_key", ["key"]),

  services: defineTable({
    name: v.string(),
    slug: v.string(),
    eyebrow: v.string(),
    summary: v.string(),
    description: v.string(),
    process: v.string(),
    customerSegment: v.string(),
    heroImage: v.optional(imageAssetValidator),
    mark: v.string(),
    faqs: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
      }),
    ),
    seoTitle: v.string(),
    seoDescription: v.string(),
    featured: v.boolean(),
    published: v.boolean(),
    archived: v.boolean(),
    sortOrder: v.number(),
    sampleContent: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"])
    .index("by_sort", ["sortOrder"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    customerType: v.optional(customerTypeValidator),
    sortOrder: v.number(),
    published: v.boolean(),
    sampleContent: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"]),

  collections: defineTable({
    name: v.string(),
    slug: v.string(),
    headline: v.string(),
    summary: v.string(),
    description: v.string(),
    heroImage: v.optional(imageAssetValidator),
    seoTitle: v.string(),
    seoDescription: v.string(),
    published: v.boolean(),
    archived: v.boolean(),
    sortOrder: v.number(),
    sampleContent: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    longDescription: v.string(),
    categoryId: v.id("categories"),
    collectionIds: v.array(v.id("collections")),
    serviceIds: v.array(v.id("services")),
    tags: v.array(v.string()),
    productType: v.string(),
    personalizationOptions: v.array(v.string()),
    brandCollection: v.string(),
    sku: v.string(),
    gallery: v.array(imageAssetValidator),
    price: v.optional(v.number()),
    currency: v.string(),
    priceDisplay: priceDisplayValidator,
    availability: availabilityValidator,
    minimumQuantity: v.optional(v.number()),
    leadTime: v.string(),
    featured: v.boolean(),
    newArrival: v.boolean(),
    specifications: v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      }),
    ),
    careInstructions: v.string(),
    options: v.array(productOptionValidator),
    seoTitle: v.string(),
    seoDescription: v.string(),
    published: v.boolean(),
    archived: v.boolean(),
    sortOrder: v.number(),
    sampleContent: v.boolean(),
    searchText: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"])
    .index("by_availability", ["availability"])
    .index("by_archived", ["archived"])
    .searchIndex("search_products", {
      searchField: "searchText",
      filterFields: ["published", "archived", "categoryId", "availability"],
    }),

  portfolioProjects: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    brief: v.string(),
    customerType: customerTypeValidator,
    category: v.string(),
    productsUsed: v.array(v.string()),
    coloursMaterials: v.string(),
    coverImage: v.optional(imageAssetValidator),
    gallery: v.array(imageAssetValidator),
    published: v.boolean(),
    archived: v.boolean(),
    featured: v.boolean(),
    projectDate: v.optional(v.number()),
    seoTitle: v.string(),
    seoDescription: v.string(),
    sampleContent: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"])
    .index("by_customer_type", ["customerType"])
    .index("by_category", ["category"]),

  journalPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    body: v.string(),
    coverImage: v.optional(imageAssetValidator),
    author: v.string(),
    publishedAt: v.optional(v.number()),
    tags: v.array(v.string()),
    seoTitle: v.string(),
    seoDescription: v.string(),
    canonicalUrl: v.string(),
    status: publishStateValidator,
    archived: v.boolean(),
    sampleContent: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_published_at", ["publishedAt"]),

  campaigns: defineTable({
    name: v.string(),
    slug: v.string(),
    headline: v.string(),
    body: v.string(),
    ctaLabel: v.string(),
    ctaHref: v.string(),
    bannerImage: v.optional(imageAssetValidator),
    terms: v.string(),
    priceNote: v.string(),
    deadlineNote: v.string(),
    startAt: v.number(),
    endAt: v.number(),
    published: v.boolean(),
    archived: v.boolean(),
    sampleContent: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_end", ["endAt"])
    .index("by_start", ["startAt"]),

  socialPosts: defineTable({
    caption: v.string(),
    url: v.string(),
    platform: v.union(v.literal("instagram"), v.literal("facebook")),
    image: v.optional(imageAssetValidator),
    published: v.boolean(),
    sortOrder: v.number(),
    sampleContent: v.boolean(),
  }).index("by_published", ["published"]),

  approvedTestimonials: defineTable({
    quote: v.string(),
    attribution: v.string(),
    role: v.string(),
    approved: v.boolean(),
    published: v.boolean(),
    archived: v.boolean(),
    sortOrder: v.number(),
  }).index("by_published_approved", ["published", "approved"]),

  quoteRequests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    customerType: customerTypeValidator,
    needType: v.string(),
    details: v.string(),
    brandNotes: v.string(),
    deadline: v.string(),
    budget: v.string(),
    lines: v.array(quoteLineValidator),
    status: quoteStatusValidator,
    consent: v.boolean(),
    sourcePath: v.string(),
    whatsappPrefill: v.string(),
    spamFlag: v.boolean(),
    internalNotes: v.array(
      v.object({
        body: v.string(),
        authorName: v.string(),
        createdAt: v.number(),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_email", ["email"])
    .index("by_created", ["createdAt"]),

  quoteFiles: defineTable({
    quoteRequestId: v.id("quoteRequests"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    publicAccess: v.boolean(),
  }).index("by_quote", ["quoteRequestId"]),
});
