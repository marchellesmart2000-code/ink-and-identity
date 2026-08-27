import { v } from "convex/values";
import { action, internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./lib/permissions";
import { buildSearchText } from "./lib/slug";

export const run = action({
  args: { token: v.string() },
  handler: async (ctx, args): Promise<{ ok: true }> => {
    const expected = process.env.SEED_SECRET;
    if (!expected || args.token !== expected) {
      throw new Error("Invalid seed token.");
    }
    return await ctx.runMutation(internal.seed.apply, {});
  },
});

export const runAsAdmin = mutation({
  args: {},
  handler: async (ctx): Promise<{ ok: true }> => {
    await requireAdmin(ctx);
    return await ctx.runMutation(internal.seed.apply, {});
  },
});

export const apply = internalMutation({
  args: {},
  handler: async (ctx): Promise<{ ok: true }> => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "site"))
      .unique();
    if (!existing) {
      await ctx.db.insert("siteSettings", defaultSettings);
    }

    const categoryIds: Record<string, Id<"categories">> = {};
    for (const category of sampleCategories) {
      const found = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", category.slug))
        .unique();
      categoryIds[category.slug] = found
        ? found._id
        : await ctx.db.insert("categories", category);
    }

    const collectionIds: Record<string, Id<"collections">> = {};
    for (const collection of sampleCollections) {
      const found = await ctx.db
        .query("collections")
        .withIndex("by_slug", (q) => q.eq("slug", collection.slug))
        .unique();
      collectionIds[collection.slug] = found
        ? found._id
        : await ctx.db.insert("collections", collection);
    }

    const serviceIds: Record<string, Id<"services">> = {};
    for (const service of sampleServices) {
      const found = await ctx.db
        .query("services")
        .withIndex("by_slug", (q) => q.eq("slug", service.slug))
        .unique();
      serviceIds[service.slug] = found ? found._id : await ctx.db.insert("services", service);
    }

    for (const product of sampleProducts) {
      const found = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .unique();
      if (found) {
        continue;
      }
      const categoryId = categoryIds[product.categorySlug];
      if (!categoryId) {
        continue;
      }
      await ctx.db.insert("products", {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        categoryId,
        collectionIds: product.collectionSlugs
          .map((slug) => collectionIds[slug])
          .filter((id): id is Id<"collections"> => Boolean(id)),
        serviceIds: product.serviceSlugs
          .map((slug) => serviceIds[slug])
          .filter((id): id is Id<"services"> => Boolean(id)),
        tags: product.tags,
        productType: product.productType,
        personalizationOptions: product.personalizationOptions,
        brandCollection: product.brandCollection,
        sku: product.sku,
        gallery: [],
        currency: "ZAR",
        priceDisplay: "request_quote",
        availability: "available_to_quote",
        leadTime: "",
        featured: product.featured,
        newArrival: product.newArrival,
        specifications: product.specifications,
        careInstructions: product.careInstructions,
        options: product.options,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        published: true,
        archived: false,
        sortOrder: product.sortOrder,
        sampleContent: true,
        searchText: buildSearchText([
          product.name,
          product.shortDescription,
          product.longDescription,
          product.productType,
          ...product.tags,
        ]),
      });
    }

    for (const project of sampleProjects) {
      const found = await ctx.db
        .query("portfolioProjects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .unique();
      if (!found) {
        await ctx.db.insert("portfolioProjects", project);
      }
    }

    for (const post of sampleJournal) {
      const found = await ctx.db
        .query("journalPosts")
        .withIndex("by_slug", (q) => q.eq("slug", post.slug))
        .unique();
      if (!found) {
        await ctx.db.insert("journalPosts", post);
      }
    }

    return { ok: true as const };
  },
});

const defaultSettings = {
  key: "site" as const,
  brandName: "Ink & Identity",
  tagline: "Turning ideas into beautifully made, meaningful products.",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  serviceRegions: [
    "White River / Witrivier (pending owner confirmation)",
    "Surrounding Mpumalanga (pending owner confirmation)",
  ],
  hours: "",
  instagramUrl: "https://www.instagram.com/inkand.identity/",
  instagramHandle: "@inkand.identity",
  facebookUrl: "",
  mapUrl: "",
  heroVideoUrl: "",
  heroEyebrow: "INK & IDENTITY · CUSTOM PRINTS",
  heroHeadline: "Your idea, beautifully made.",
  heroSupport:
    "Thoughtful custom apparel, branded products and personal gifts designed to make your identity visible.",
  primaryLanguage: "en" as const,
  announcementEnabled: true,
  announcementText:
    "Sample content is in place for design review. Confirm details, photography and service areas before public launch.",
  announcementHref: "/quote",
  defaultSeoTitle: "Ink & Identity | Custom Printing & Branded Gifts in Mpumalanga",
  defaultSeoDescription:
    "Turn your idea into something remarkable with custom apparel, branded merchandise, personalised gifts and creative print solutions from Ink & Identity.",
  privacyConsentCopy:
    "By sending this enquiry you agree that Ink & Identity may store your details and any uploaded artwork in order to prepare a quotation. Artwork stays private unless you later ask us to share it.",
  aboutStory:
    "Ink & Identity is a South African custom-printing and creative product studio. The work is personal: a conversation about what you need, a careful design pass, and objects that carry a name, a team, a celebration or a brand with quiet confidence.",
  aboutProcess:
    "Share a sketch, a logo, a colour, or simply the feeling you want the piece to hold. We refine the idea with you, then make it — apparel, gifts, drinkware, stationery and the small details that make a set feel considered.",
  ownerName: "Tiané Eksteen",
  ownerNamePublished: false,
  notificationEmail: "",
  processSteps: [
    {
      title: "Share the idea",
      body: "Tell us who it is for, what you imagine, and when you need it. A photo, a logo or a few sentences is enough to begin.",
    },
    {
      title: "Refine the design",
      body: "We shape placement, colour, product choice and finishing with you until the piece feels like yours.",
    },
    {
      title: "Receive something remarkable",
      body: "The finished work should feel considered in the hand — made to be used, given and remembered.",
    },
  ],
  trustStatements: [
    "Personal design guidance",
    "Made for your brand",
    "Thoughtful finishing",
    "One clear process",
  ],
  values: [
    {
      title: "Care",
      body: "Every enquiry is treated as a real brief, not a ticket in a queue.",
    },
    {
      title: "Clarity",
      body: "You will know what we are making, what we still need, and what happens next.",
    },
    {
      title: "Craft",
      body: "Print, stitch, wrap and finish should feel as considered as the idea behind them.",
    },
  ],
  editorialHeadline: "Made to be remembered",
  editorialBody:
    "From the first conversation to the last stitch or print pass, the studio is built around guidance. We help you choose the right surface, the right scale and the right finish — then we make the work with the care a gift or a brand deserves.",
  finalCtaHeadline: "Let’s put your identity into something people can hold.",
  finalCtaBody:
    "Whether it is a single personal gift or a set for a team, start with a conversation. We will help you shape the brief.",
  sampleContent: true,
  translationsAf: {
    navServices: "Dienste",
    navShop: "Winkel",
    navPortfolio: "Werk",
    navAbout: "Oor ons",
    navJournal: "Joernaal",
    navContact: "Kontak",
    ctaQuote: "Versoek 'n kwotasie",
    ctaWhatsapp: "WhatsApp",
    ctaExplore: "Verken dienste",
  },
};

const sampleCategories = [
  {
    name: "Apparel",
    slug: "apparel",
    description: "Custom garments for brands, teams, schools and personal wear.",
    sortOrder: 1,
    published: true,
    sampleContent: true,
  },
  {
    name: "Drinkware",
    slug: "drinkware",
    description: "Mugs, cups and bottles made to carry a name or a mark.",
    sortOrder: 2,
    published: true,
    sampleContent: true,
  },
  {
    name: "Desk & stationery",
    slug: "desk-stationery",
    description: "Notebooks, mouse pads and desk pieces with a quiet branded presence.",
    sortOrder: 3,
    published: true,
    sampleContent: true,
  },
  {
    name: "Gifting",
    slug: "gifting",
    description: "Personalised gifts and considered sets for people and occasions.",
    sortOrder: 4,
    published: true,
    sampleContent: true,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Caps, socks, lunch boxes and the finishing pieces around a kit.",
    sortOrder: 5,
    published: true,
    sampleContent: true,
  },
];

const sampleCollections = [
  {
    name: "Corporate gifting",
    slug: "corporate-gifting",
    headline: "Gifts that feel like a brand, not a giveaway.",
    summary: "Sets and pieces for clients, teams and year-end thanks.",
    description:
      "A landing place for branded gifts with room for a note, a name and a finish that feels considered. Sample collection — replace with owner photography and confirmed product lists.",
    seoTitle: "Corporate gifting | Ink & Identity",
    seoDescription:
      "Explore corporate gifting ideas from Ink & Identity — branded sets and personalised pieces for South African teams and clients.",
    published: true,
    archived: false,
    sortOrder: 1,
    sampleContent: true,
  },
  {
    name: "Apparel",
    slug: "apparel",
    headline: "Clothing that carries the mark.",
    summary: "Tees, jackets, caps, socks, scrubs and team wear.",
    description:
      "Custom apparel for brands, schools, events and personal wear. Sample collection pending owner-approved garments and process notes.",
    seoTitle: "Custom apparel | Ink & Identity",
    seoDescription:
      "Custom apparel from Ink & Identity — branded clothing for teams, schools and personal wear in Mpumalanga.",
    published: true,
    archived: false,
    sortOrder: 2,
    sampleContent: true,
  },
  {
    name: "Drinkware",
    slug: "drinkware",
    headline: "A name, held in the hand.",
    summary: "Mugs, cups and bottles for desks, kitchens and kits.",
    description:
      "Drinkware made to hold a mark without shouting. Sample collection pending confirmed catalogue photography.",
    seoTitle: "Custom drinkware | Ink & Identity",
    seoDescription:
      "Custom mugs, cups and bottles from Ink & Identity, made for brands, gifts and everyday use.",
    published: true,
    archived: false,
    sortOrder: 3,
    sampleContent: true,
  },
  {
    name: "Stationery",
    slug: "stationery",
    headline: "Paper, print and the quiet desk.",
    summary: "Notebooks and desk pieces with a personal or branded mark.",
    description: "Sample stationery collection for the catalogue architecture.",
    seoTitle: "Custom stationery | Ink & Identity",
    seoDescription: "Custom stationery and desk pieces from Ink & Identity.",
    published: true,
    archived: false,
    sortOrder: 4,
    sampleContent: true,
  },
  {
    name: "Event packs",
    slug: "event-packs",
    headline: "One event, one coherent set.",
    summary: "Apparel, gifts and small goods gathered into a single brief.",
    description:
      "Use this collection for launches, celebrations and team days. Sample architecture only.",
    seoTitle: "Event merchandise | Ink & Identity",
    seoDescription: "Event merchandise and coordinated packs from Ink & Identity.",
    published: true,
    archived: false,
    sortOrder: 5,
    sampleContent: true,
  },
];

const sampleServices = [
  {
    name: "Branded apparel",
    slug: "branded-apparel",
    eyebrow: "For brands and teams",
    summary: "Clothing that carries a mark with care — from a single piece to a coordinated set.",
    description:
      "Custom apparel for businesses, schools and personal wear. Choose the garment, the placement and the finish, then we help you arrive at something that feels like you. Sample service copy — confirm methods, lead times and garment ranges with the owner before launch.",
    process:
      "Share the garment you have in mind, a logo or a sketch, and who will wear it. We refine placement and colour, then make the work to the agreed brief.",
    customerSegment: "business",
    mark: "01",
    faqs: [
      {
        question: "Do you hold a standard garment range?",
        answer:
          "The catalogue is built around pieces we can personalise. Confirm current garments with the studio when you enquire — ranges change with season and supply.",
      },
      {
        question: "Can I supply my own clothing?",
        answer:
          "Ask when you send the brief. Some garments take a mark well; others do not. We will be honest about what will hold the design.",
      },
    ],
    seoTitle: "Custom branded apparel | Ink & Identity",
    seoDescription:
      "Custom branded apparel from Ink & Identity in Mpumalanga — clothing made to carry a team, a school or a brand.",
    featured: true,
    published: true,
    archived: false,
    sortOrder: 1,
    sampleContent: true,
  },
  {
    name: "Corporate gifting",
    slug: "corporate-gifting",
    eyebrow: "For businesses",
    summary: "Gifts with a name, a note and a finish that feels considered.",
    description:
      "Corporate gifting for clients, teams and seasonal thanks. We help you choose pieces that belong together, rather than a box of disconnected objects.",
    process:
      "Start with who the gift is for and the feeling it should leave. We propose a set, refine the mark, and prepare the work for the date you share.",
    customerSegment: "business",
    mark: "02",
    faqs: [
      {
        question: "Can gifts be packed as a set?",
        answer:
          "Yes — tell us how you want the pieces to arrive. Packaging details are confirmed per brief.",
      },
    ],
    seoTitle: "Corporate gifting | Ink & Identity",
    seoDescription:
      "Corporate gifting from Ink & Identity — branded and personalised gifts for South African teams and clients.",
    featured: true,
    published: true,
    archived: false,
    sortOrder: 2,
    sampleContent: true,
  },
  {
    name: "Event & team merchandise",
    slug: "event-team-merchandise",
    eyebrow: "For gatherings",
    summary: "Coordinated pieces for events, launches, schools and sides.",
    description:
      "Merchandise that keeps an event or a team visually coherent — apparel, drinkware and small goods under one brief.",
    process:
      "Share the date, the audience and any existing colours or marks. We shape a small set that can be worn, used and kept.",
    customerSegment: "event",
    mark: "03",
    faqs: [
      {
        question: "How early should we start?",
        answer:
          "As soon as the date is real. Lead times depend on the pieces and the finishing — we will not invent a promise here.",
      },
    ],
    seoTitle: "Event and team merchandise | Ink & Identity",
    seoDescription:
      "Event and team merchandise from Ink & Identity — coordinated custom pieces for gatherings in Mpumalanga.",
    featured: true,
    published: true,
    archived: false,
    sortOrder: 3,
    sampleContent: true,
  },
  {
    name: "Drinkware & desk essentials",
    slug: "drinkware-desk-essentials",
    eyebrow: "Everyday objects",
    summary: "Mugs, bottles, mouse pads and desk pieces with a quiet branded presence.",
    description:
      "The objects people touch every day. A mark on a mug or a mat should feel at home there.",
    process:
      "Choose the object, the mark and the colour story. We confirm what the surface can hold, then make the piece.",
    customerSegment: "business",
    mark: "04",
    faqs: [],
    seoTitle: "Custom drinkware and desk essentials | Ink & Identity",
    seoDescription:
      "Custom mugs, bottles and desk essentials from Ink & Identity.",
    featured: true,
    published: true,
    archived: false,
    sortOrder: 4,
    sampleContent: true,
  },
  {
    name: "Personalized gifts",
    slug: "personalized-gifts",
    eyebrow: "For someone",
    summary: "Gifts made for a person, a date, a joke, a name.",
    description:
      "Personal gifting with room for a name, a line of type or a private reference. Sample copy pending owner voice.",
    process:
      "Tell us who it is for and what should be said without saying too much. We will help you choose the object and the words.",
    customerSegment: "personal",
    mark: "05",
    faqs: [],
    seoTitle: "Personalized gifts | Ink & Identity",
    seoDescription:
      "Personalized gifts from Ink & Identity — custom pieces made for people in Mpumalanga.",
    featured: true,
    published: true,
    archived: false,
    sortOrder: 5,
    sampleContent: true,
  },
  {
    name: "Custom stationery",
    slug: "custom-stationery",
    eyebrow: "On paper",
    summary: "Notebooks and printed pieces with a personal or branded identity.",
    description:
      "Stationery that sits on a desk and still feels like a gift. Sample service architecture.",
    process:
      "Share the words, the mark and how the piece will be used. We refine layout and paper choice together.",
    customerSegment: "business",
    mark: "06",
    faqs: [],
    seoTitle: "Custom stationery | Ink & Identity",
    seoDescription: "Custom stationery from Ink & Identity.",
    featured: true,
    published: true,
    archived: false,
    sortOrder: 6,
    sampleContent: true,
  },
];

const sampleProducts = [
  {
    name: "Custom apparel tee",
    slug: "custom-apparel-tee",
    shortDescription: "A considered tee, made to carry a mark, a name or a team.",
    longDescription:
      "Sample product pending owner photography, garment details and confirmed finishing. Request a quote with your idea, size range and placement notes.",
    categorySlug: "apparel",
    collectionSlugs: ["apparel", "event-packs"],
    serviceSlugs: ["branded-apparel", "event-team-merchandise"],
    tags: ["apparel", "team", "brand"],
    productType: "apparel",
    personalizationOptions: ["Print", "Name", "Placement"],
    brandCollection: "Apparel",
    sku: "SAMPLE-TEE",
    featured: true,
    newArrival: false,
    specifications: [{ label: "Status", value: "Sample record — owner approval required" }],
    careInstructions: "Care notes will be confirmed per garment.",
    options: [
      { name: "Placement", values: ["Chest", "Back", "Sleeve"] },
      { name: "Size range", values: ["To be confirmed"] },
    ],
    seoTitle: "Custom apparel tee | Ink & Identity",
    seoDescription: "Enquire about a custom apparel tee from Ink & Identity.",
    sortOrder: 1,
  },
  {
    name: "Studio jacket",
    slug: "studio-jacket",
    shortDescription: "A jacket for teams, staff and cooler Lowveld evenings.",
    longDescription:
      "Sample jacket record. Confirm fabric, embroidery or print method, and sizing with the studio.",
    categorySlug: "apparel",
    collectionSlugs: ["apparel"],
    serviceSlugs: ["branded-apparel"],
    tags: ["jacket", "apparel"],
    productType: "apparel",
    personalizationOptions: ["Embroidery", "Print"],
    brandCollection: "Apparel",
    sku: "SAMPLE-JKT",
    featured: true,
    newArrival: true,
    specifications: [],
    careInstructions: "",
    options: [{ name: "Mark", values: ["Chest", "Back"] }],
    seoTitle: "Custom jacket | Ink & Identity",
    seoDescription: "Enquire about a custom jacket from Ink & Identity.",
    sortOrder: 2,
  },
  {
    name: "Branded cap",
    slug: "branded-cap",
    shortDescription: "A cap with a quiet mark — for staff, events or a gift.",
    longDescription: "Sample cap record pending confirmed styles and finishing.",
    categorySlug: "accessories",
    collectionSlugs: ["apparel", "event-packs"],
    serviceSlugs: ["branded-apparel", "event-team-merchandise"],
    tags: ["cap", "accessories"],
    productType: "accessories",
    personalizationOptions: ["Embroidery", "Print"],
    brandCollection: "Accessories",
    sku: "SAMPLE-CAP",
    featured: false,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom cap | Ink & Identity",
    seoDescription: "Enquire about a custom cap from Ink & Identity.",
    sortOrder: 3,
  },
  {
    name: "Personalised mug",
    slug: "personalised-mug",
    shortDescription: "A mug made for a desk, a kitchen or a gift with a name on it.",
    longDescription:
      "Sample mug record for the drinkware catalogue. Confirm shapes, print area and care with the studio.",
    categorySlug: "drinkware",
    collectionSlugs: ["drinkware", "corporate-gifting"],
    serviceSlugs: ["drinkware-desk-essentials", "personalized-gifts", "corporate-gifting"],
    tags: ["mug", "gift", "drinkware"],
    productType: "drinkware",
    personalizationOptions: ["Name", "Mark", "Message"],
    brandCollection: "Drinkware",
    sku: "SAMPLE-MUG",
    featured: true,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [{ name: "Style", values: ["To be confirmed"] }],
    seoTitle: "Personalised mug | Ink & Identity",
    seoDescription: "Enquire about a personalised mug from Ink & Identity.",
    sortOrder: 4,
  },
  {
    name: "Insulated bottle",
    slug: "insulated-bottle",
    shortDescription: "A bottle for workbags, kit bags and everyday water.",
    longDescription: "Sample bottle record pending confirmed catalogue.",
    categorySlug: "drinkware",
    collectionSlugs: ["drinkware", "corporate-gifting", "event-packs"],
    serviceSlugs: ["drinkware-desk-essentials", "corporate-gifting"],
    tags: ["bottle", "drinkware"],
    productType: "drinkware",
    personalizationOptions: ["Name", "Mark"],
    brandCollection: "Drinkware",
    sku: "SAMPLE-BTL",
    featured: false,
    newArrival: true,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom bottle | Ink & Identity",
    seoDescription: "Enquire about a custom bottle from Ink & Identity.",
    sortOrder: 5,
  },
  {
    name: "Desk mouse pad",
    slug: "desk-mouse-pad",
    shortDescription: "A desk piece with space for a mark, a colour or a pattern.",
    longDescription: "Sample mouse pad record.",
    categorySlug: "desk-stationery",
    collectionSlugs: ["stationery", "corporate-gifting"],
    serviceSlugs: ["drinkware-desk-essentials", "custom-stationery"],
    tags: ["desk", "stationery"],
    productType: "stationery",
    personalizationOptions: ["Print", "Colour"],
    brandCollection: "Desk",
    sku: "SAMPLE-PAD",
    featured: false,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom mouse pad | Ink & Identity",
    seoDescription: "Enquire about a custom mouse pad from Ink & Identity.",
    sortOrder: 6,
  },
  {
    name: "Lunch box",
    slug: "lunch-box",
    shortDescription: "A practical piece for school, staff and everyday carrying.",
    longDescription: "Sample lunch box record pending confirmed range.",
    categorySlug: "accessories",
    collectionSlugs: ["event-packs", "corporate-gifting"],
    serviceSlugs: ["personalized-gifts", "event-team-merchandise"],
    tags: ["lunch box", "gift"],
    productType: "accessories",
    personalizationOptions: ["Name", "Mark"],
    brandCollection: "Gifting",
    sku: "SAMPLE-LUNCH",
    featured: false,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom lunch box | Ink & Identity",
    seoDescription: "Enquire about a custom lunch box from Ink & Identity.",
    sortOrder: 7,
  },
  {
    name: "Studio socks",
    slug: "studio-socks",
    shortDescription: "Socks as a small, surprisingly personal branded gift.",
    longDescription: "Sample socks record.",
    categorySlug: "accessories",
    collectionSlugs: ["apparel", "corporate-gifting"],
    serviceSlugs: ["branded-apparel", "corporate-gifting"],
    tags: ["socks", "gift"],
    productType: "accessories",
    personalizationOptions: ["Colour", "Mark"],
    brandCollection: "Apparel",
    sku: "SAMPLE-SOCK",
    featured: false,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom socks | Ink & Identity",
    seoDescription: "Enquire about custom socks from Ink & Identity.",
    sortOrder: 8,
  },
  {
    name: "Scrubs set",
    slug: "scrubs-set",
    shortDescription: "Workwear with a name or a practice mark, made to be worn hard.",
    longDescription:
      "Sample scrubs record. Confirm fabrics, colours and personalisation with the studio — do not publish clinical claims.",
    categorySlug: "apparel",
    collectionSlugs: ["apparel"],
    serviceSlugs: ["branded-apparel"],
    tags: ["scrubs", "workwear"],
    productType: "apparel",
    personalizationOptions: ["Name", "Embroidery"],
    brandCollection: "Apparel",
    sku: "SAMPLE-SCRUB",
    featured: false,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom scrubs | Ink & Identity",
    seoDescription: "Enquire about custom scrubs from Ink & Identity.",
    sortOrder: 9,
  },
  {
    name: "Studio notebook",
    slug: "studio-notebook",
    shortDescription: "A notebook with a cover that belongs to someone, or to a brand.",
    longDescription: "Sample stationery record.",
    categorySlug: "desk-stationery",
    collectionSlugs: ["stationery", "corporate-gifting"],
    serviceSlugs: ["custom-stationery", "corporate-gifting", "personalized-gifts"],
    tags: ["notebook", "stationery", "gift"],
    productType: "stationery",
    personalizationOptions: ["Name", "Mark", "Foil"],
    brandCollection: "Stationery",
    sku: "SAMPLE-NBK",
    featured: true,
    newArrival: false,
    specifications: [],
    careInstructions: "",
    options: [],
    seoTitle: "Custom notebook | Ink & Identity",
    seoDescription: "Enquire about a custom notebook from Ink & Identity.",
    sortOrder: 10,
  },
];

const sampleProjects = [
  {
    title: "Sample study: a coordinated staff set",
    slug: "sample-staff-set",
    summary: "Placeholder case study for apparel and desk pieces belonging to one brief.",
    brief:
      "This is sample portfolio architecture — not a real client project. Replace with owner-approved photography, a true brief and products actually made. Do not invent client names.",
    customerType: "business" as const,
    category: "apparel",
    productsUsed: ["Custom apparel tee", "Branded cap", "Desk mouse pad"],
    coloursMaterials: "To be confirmed with owner photography.",
    gallery: [],
    published: true,
    archived: false,
    featured: true,
    seoTitle: "Sample staff set | Ink & Identity",
    seoDescription: "Sample portfolio study for Ink & Identity — replace before launch.",
    sampleContent: true,
    sortOrder: 1,
  },
  {
    title: "Sample study: a personal gift",
    slug: "sample-personal-gift",
    summary: "Placeholder for a single-object gift with a name and a quiet finish.",
    brief:
      "Sample case study only. Use this page structure for real gifts once photography and permission are in place.",
    customerType: "personal" as const,
    category: "gifting",
    productsUsed: ["Personalised mug", "Studio notebook"],
    coloursMaterials: "To be confirmed.",
    gallery: [],
    published: true,
    archived: false,
    featured: true,
    seoTitle: "Sample personal gift | Ink & Identity",
    seoDescription: "Sample gift case study for Ink & Identity.",
    sampleContent: true,
    sortOrder: 2,
  },
  {
    title: "Sample study: a school or team kit",
    slug: "sample-team-kit",
    summary: "Placeholder for apparel made for a side, a school or a club.",
    brief:
      "Sample architecture for school and team work. Confirm the institution before naming it in public.",
    customerType: "school_team" as const,
    category: "apparel",
    productsUsed: ["Custom apparel tee", "Studio jacket", "Studio socks"],
    coloursMaterials: "To be confirmed.",
    gallery: [],
    published: true,
    archived: false,
    featured: true,
    seoTitle: "Sample team kit | Ink & Identity",
    seoDescription: "Sample team merchandise study for Ink & Identity.",
    sampleContent: true,
    sortOrder: 3,
  },
];

const sampleJournal = [
  {
    title: "How to prepare artwork for printing",
    slug: "how-to-prepare-artwork-for-printing",
    excerpt:
      "A calm checklist for sending a logo, a drawing or a photograph so the studio can make it well.",
    body: `Bring the highest-quality file you have. Vector marks (SVG, AI, EPS or PDF) keep edges clean. Photographs should be sharp and large enough for the object they will live on.

Share the colours you love, even if they are only a reference. Tell us where the mark should sit. If the file is a photograph of a sketch on paper, that is a perfectly good place to start — we will tell you what we can hold and what we still need.

This article is sample editorial. Confirm technical requirements with the studio before treating it as specification.`,
    author: "Ink & Identity",
    publishedAt: Date.now(),
    tags: ["artwork", "process"],
    seoTitle: "How to prepare artwork for printing | Ink & Identity",
    seoDescription:
      "A practical guide to preparing artwork for custom printing with Ink & Identity.",
    canonicalUrl: "",
    status: "published" as const,
    archived: false,
    sampleContent: true,
  },
  {
    title: "Corporate gifting ideas that still feel personal",
    slug: "corporate-gifting-ideas",
    excerpt: "A few ways to thank a team or a client without defaulting to the generic.",
    body: `A gift lands when it feels chosen. A mug with a name, a notebook with a quiet mark, a small set packed with a handwritten note — these are starting points, not a catalogue promise.

Think about how the object will be used on an ordinary Tuesday. That is usually a better brief than “something branded”.

Sample editorial pending owner voice and confirmed product photography.`,
    author: "Ink & Identity",
    publishedAt: Date.now(),
    tags: ["gifting", "business"],
    seoTitle: "Corporate gifting ideas | Ink & Identity",
    seoDescription: "Corporate gifting ideas from Ink & Identity in Mpumalanga.",
    canonicalUrl: "",
    status: "published" as const,
    archived: false,
    sampleContent: true,
  },
  {
    title: "Branded apparel for teams",
    slug: "branded-apparel-for-teams",
    excerpt: "How to brief clothing for a side, a staff group or a school so it feels like them.",
    body: `Start with who will wear it, where they will wear it, and what should be readable from a few steps away. Then choose the garment that will actually be put on.

Share sizes honestly. Share the mark in the best file you have. We will help with placement so the piece does not feel stamped; it feels made.

Sample editorial — confirm garment ranges before launch.`,
    author: "Ink & Identity",
    publishedAt: Date.now(),
    tags: ["apparel", "teams"],
    seoTitle: "Branded apparel for teams | Ink & Identity",
    seoDescription: "How to brief branded apparel for teams with Ink & Identity.",
    canonicalUrl: "",
    status: "published" as const,
    archived: false,
    sampleContent: true,
  },
  {
    title: "An event merchandise checklist",
    slug: "event-merchandise-checklist",
    excerpt: "Dates, quantities, marks and the few decisions that keep an event set coherent.",
    body: `Write down the date first. Then the people. Then the pieces they will actually use — a tee, a bottle, a small gift, a sign-in desk object.

Keep the colour story short. One mark, used well, is stronger than five competing graphics.

Sample checklist pending owner process confirmation. Do not treat this as a production schedule.`,
    author: "Ink & Identity",
    publishedAt: Date.now(),
    tags: ["events", "checklist"],
    seoTitle: "Event merchandise checklist | Ink & Identity",
    seoDescription: "A thoughtful checklist for event merchandise with Ink & Identity.",
    canonicalUrl: "",
    status: "published" as const,
    archived: false,
    sampleContent: true,
  },
  {
    title: "Personalized gift ideas",
    slug: "personalized-gift-ideas",
    excerpt: "Small, specific gifts — a name, a date, a line of type — made to be kept.",
    body: `The most personal gifts are rarely the loudest. A mug, a notebook, a bottle, a piece of clothing with a name placed with care.

Tell us the person, the occasion if there is one, and the words that should appear. We will help you choose the object that can hold them.

Sample editorial for the journal architecture.`,
    author: "Ink & Identity",
    publishedAt: Date.now(),
    tags: ["gifts", "personal"],
    seoTitle: "Personalized gift ideas | Ink & Identity",
    seoDescription: "Personalized gift ideas from Ink & Identity.",
    canonicalUrl: "",
    status: "published" as const,
    archived: false,
    sampleContent: true,
  },
];
