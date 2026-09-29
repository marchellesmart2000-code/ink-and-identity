import { EXTRA_DOG_TAGS, EXTRA_MUGS, MORE_CATEGORIES } from "@/lib/catalogue-more";

export type PriceDisplay = "show_price" | "request_quote";

export type CatalogueProduct = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  alt: string;
  price?: number;
  priceDisplay: PriceDisplay;
  featured?: boolean;
  listIn?: string[];
};

export type CatalogueCategory = {
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  coverSlug: string;
  products: CatalogueProduct[];
};

export type ShopCategory = {
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  productCount: number;
  coverUrl: string;
  coverAlt: string;
  published: boolean;
};

export type ShopProduct = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  coverUrl: string;
  coverAlt: string;
  categoryName: string;
  categorySlug: string;
  price?: number;
  currency: "ZAR";
  priceDisplay: PriceDisplay;
  availability: "made_to_order";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
};

const dogTag = (product: Omit<CatalogueProduct, "price" | "priceDisplay">): CatalogueProduct => ({
  ...product,
  priceDisplay: "request_quote",
});

export const CATALOGUE: CatalogueCategory[] = [
  {
    slug: "dog-tags",
    name: "Dog tags",
    description: "Sublimated bone and paw tags, printed in full colour.",
    seoTitle: "Sublimated dog tags | Ink & Identity",
    seoDescription:
      "Sublimated bone and paw dog tags from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 1,
    coverSlug: "vlooi-filla-bone-tags",
    products: [
      dogTag({
        slug: "vlooi-filla-bone-tags",
        name: "Bone tag pair",
        shortDescription: "A pair of sublimated bone tags.",
        longDescription: "Two bone-shaped tags, sublimated in full colour.",
        image: "/products/dog-tags/bone-tags-vlooi-filla.jpg",
        alt: "Two sublimated bone-shaped dog tags",
      }),
      dogTag({
        slug: "bailey-bennie-bone-tags",
        name: "Photo bone tags",
        shortDescription: "A pair of sublimated bone tags.",
        longDescription: "Two bone-shaped tags, sublimated in full colour.",
        image: "/products/dog-tags/bone-tags-bailey-bennie.jpg",
        alt: "Two sublimated bone-shaped dog tags",
      }),
      dogTag({
        slug: "hassie-bone-tags",
        name: "Printed bone tags",
        shortDescription: "Sublimated bone tags.",
        longDescription: "Bone-shaped tags sublimated in full colour.",
        image: "/products/dog-tags/bone-tags-hassie.jpg",
        alt: "Sublimated bone-shaped dog tags",
      }),
      dogTag({
        slug: "ava-bone-tags",
        name: "Colour bone tags",
        shortDescription: "A pair of sublimated bone tags.",
        longDescription: "Two bone-shaped tags, sublimated in full colour.",
        image: "/products/dog-tags/bone-tags-ava.jpg",
        alt: "Two sublimated bone-shaped dog tags",
      }),
      dogTag({
        slug: "vlooi-paw-tag",
        name: "Paw tag",
        shortDescription: "A sublimated paw-shaped tag.",
        longDescription: "A paw-shaped tag sublimated in full colour.",
        image: "/products/dog-tags/paw-tag-vlooi.jpg",
        alt: "Sublimated paw-shaped dog tag",
      }),
      dogTag({
        slug: "blue-bone-tags",
        name: "Blue print bone tags",
        shortDescription: "A pair of sublimated bone tags.",
        longDescription: "Two bone-shaped tags sublimated in full colour on a blue ground.",
        image: "/products/dog-tags/bone-tags-blue.jpg",
        alt: "Two blue sublimated bone-shaped dog tags",
      }),
      dogTag({
        slug: "riley-bone-tag",
        name: "Single bone tag",
        shortDescription: "A sublimated bone tag.",
        longDescription: "A bone-shaped tag sublimated in full colour.",
        image: "/products/dog-tags/bone-tag-riley.jpg",
        alt: "Sublimated bone-shaped dog tag",
      }),
      dogTag({
        slug: "rosie-paw-tag",
        name: "Paw print tag",
        shortDescription: "A sublimated paw-shaped tag.",
        longDescription: "A paw-shaped tag sublimated in full colour.",
        image: "/products/dog-tags/paw-tag-rosie.jpg",
        alt: "Sublimated paw-shaped dog tag",
      }),
      ...EXTRA_DOG_TAGS,
    ],
  },
  {
    slug: "key-rings",
    name: "Key rings",
    description: "Sublimated photo keyrings, bottle openers and sets.",
    seoTitle: "Sublimated key rings | Ink & Identity",
    seoDescription:
      "Sublimated key rings from Ink & Identity — photo keyrings, bottle openers and printed sets. Order on WhatsApp.",
    sortOrder: 2,
    coverSlug: "photo-keyring",
    products: [
      {
        slug: "photo-keyring",
        name: "Photo keyring",
        featured: true,
        shortDescription: "A sublimated photo keyring.",
        longDescription: "A double-sided photo keyring, sublimated in full colour.",
        image: "/products/key-rings/photo-keyring.jpg",
        alt: "Sublimated photo keyring",
        priceDisplay: "request_quote",
      },
      {
        slug: "bottle-opener-keyring",
        name: "Bottle-opener keyring",
        shortDescription: "A sublimated keyring with a bottle opener.",
        longDescription: "A photo keyring with a bottle opener, sublimated in full colour.",
        image: "/products/key-rings/bottle-opener-keyring.jpg",
        alt: "Sublimated bottle-opener keyring",
        priceDisplay: "request_quote",
      },
      {
        slug: "raptors-fitness-keyrings",
        name: "Raptors & AC Fitness keyrings",
        shortDescription: "A set of sublimated club keyrings.",
        longDescription: "Club keyrings sublimated in full colour.",
        image: "/products/key-rings/raptors-fitness-keyrings.jpg",
        alt: "Sublimated Raptors and AC Fitness keyrings",
        priceDisplay: "request_quote",
      },
      {
        slug: "faith-hope-love",
        name: "Faith, Hope & Love keyring",
        shortDescription: "A sublimated heartbeat and cross keyring.",
        longDescription: "A keyring sheet sublimated with Faith, Hope and Love.",
        image: "/products/key-rings/faith-hope-love.jpg",
        alt: "Sublimated Faith Hope and Love keyring",
        priceDisplay: "request_quote",
      },
    ],
  },
  {
    slug: "coffee-mugs",
    name: "Coffee mugs",
    description: "Sublimated photo mugs and full-wrap prints.",
    seoTitle: "Sublimated coffee mugs | Ink & Identity",
    seoDescription:
      "Sublimated coffee mugs from Ink & Identity in White River — photo mugs and full-wrap prints. Order on WhatsApp.",
    sortOrder: 3,
    coverSlug: "manzelle-mugs",
    products: [
      {
        slug: "photo-mug",
        name: "Photo mug",
        shortDescription: "A sublimated photo mug with a coloured handle.",
        longDescription: "A white mug with a photo printed on the front and a coloured inner and handle.",
        image: "/products/coffee-mugs/photo-mug.jpg",
        alt: "White sublimated photo mug with a purple handle",
        priceDisplay: "request_quote",
      },
      {
        slug: "mike-secret-mugs",
        name: "Statement mugs",
        shortDescription: "A pair of sublimated statement mugs.",
        longDescription: "Two white mugs sublimated with a statement design.",
        image: "/products/coffee-mugs/secret-mike-mugs.jpg",
        alt: "Two sublimated statement mugs",
        priceDisplay: "request_quote",
      },
      {
        slug: "kobus-mugs",
        name: "Macadamia mugs",
        shortDescription: "A full-wrap macadamia mug, shown three ways.",
        longDescription: "A sublimated mug printed edge to edge with orchard artwork.",
        image: "/products/coffee-mugs/kobus-mugs.jpg",
        alt: "Three views of a sublimated macadamia mug",
        priceDisplay: "request_quote",
      },
      {
        slug: "manzelle-mugs",
        name: "Leopard print mugs",
        featured: true,
        shortDescription: "A full-wrap leopard and nails mug, shown three ways.",
        longDescription: "A sublimated mug printed edge to edge.",
        image: "/products/coffee-mugs/manzelle-mugs.jpg",
        alt: "Three views of a sublimated leopard print mug",
        priceDisplay: "request_quote",
      },
      {
        slug: "juf-anneke-mugs",
        name: "Teacher mugs",
        shortDescription: "A striped teacher mug, shown three ways.",
        longDescription: "A sublimated mug with pencil artwork and a pink inner.",
        image: "/products/coffee-mugs/juf-anneke-mugs.jpg",
        alt: "Three views of a sublimated teacher mug",
        priceDisplay: "request_quote",
      },
      {
        slug: "homosapien-mug",
        name: "World's Best Homosapien mug",
        shortDescription: "A sublimated Father's Day mug.",
        longDescription: "A white mug sublimated with the World's Best Homosapien artwork.",
        image: "/products/coffee-mugs/homosapien-mug.jpg",
        alt: "Sublimated World's Best Homosapien mug",
        priceDisplay: "request_quote",
      },
      {
        slug: "she-is-worthy-mugs",
        name: "She is Worthy mugs",
        shortDescription: "Frosted bow mugs, front and back.",
        longDescription: "A pair of frosted mugs sublimated with a bow and Proverbs 31.",
        image: "/products/coffee-mugs/worthy-bow-mugs.jpg",
        alt: "Two frosted sublimated mugs with a pink bow, one reading She is Worthy",
        priceDisplay: "request_quote",
      },
      {
        slug: "apex-wellness-mugs",
        name: "Apex Core Wellness mugs",
        shortDescription: "A branded mug, shown three ways.",
        longDescription: "A white mug sublimated with Apex Core Wellness branding.",
        image: "/products/coffee-mugs/apex-wellness-mugs.jpg",
        alt: "Three views of a sublimated Apex Core Wellness mug",
        priceDisplay: "request_quote",
      },
      {
        slug: "chris-hunt-mugs",
        name: "Hunt mugs",
        shortDescription: "A full-wrap hunting mug, shown three ways.",
        longDescription: "A sublimated mug printed with hunt artwork.",
        image: "/products/coffee-mugs/chris-hunt-mugs.jpg",
        alt: "Three views of a sublimated hunting mug",
        priceDisplay: "request_quote",
      },
      ...EXTRA_MUGS,
    ],
  },
  ...MORE_CATEGORIES,
];

export type LiveCategory = {
  slug: string;
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
  published?: boolean;
  productCount?: number;
  coverPath?: string;
  coverAlt?: string;
};

function categoryProducts(slug: string) {
  return CATALOGUE.flatMap((category) =>
    category.products.filter(
      (product) => category.slug === slug || product.listIn?.includes(slug),
    ),
  );
}

function coverFor(category: CatalogueCategory, live?: LiveCategory) {
  const product =
    category.products.find((item) => item.slug === category.coverSlug) ?? category.products[0];
  return {
    coverUrl: live?.coverPath?.trim() || product?.image || "",
    coverAlt: live?.coverAlt?.trim() || product?.alt || category.name,
  };
}

export function publishedCategories(live?: LiveCategory[]): ShopCategory[] {
  const extras: ShopCategory[] = [];
  const cards = CATALOGUE.map((category) => {
    const match = live?.find((item) => item.slug === category.slug);
    const cover = coverFor(category, match);
    return {
      slug: category.slug,
      name: match?.name?.trim() || category.name,
      description: match?.description?.trim() || category.description,
      seoTitle: match?.seoTitle?.trim() || category.seoTitle,
      seoDescription: match?.seoDescription?.trim() || category.seoDescription,
      sortOrder: match?.sortOrder ?? category.sortOrder,
      productCount: categoryProducts(category.slug).length,
      coverUrl: cover.coverUrl,
      coverAlt: cover.coverAlt,
      published: match?.published ?? true,
    };
  });

  for (const item of live ?? []) {
    if (CATALOGUE.some((category) => category.slug === item.slug)) {
      continue;
    }
    if (!item.published && item.published !== undefined) {
      continue;
    }
    if (!item.coverPath && !(item.productCount && item.productCount > 0)) {
      continue;
    }
    extras.push({
      slug: item.slug,
      name: item.name,
      description: item.description,
      seoTitle: item.seoTitle?.trim() || `${item.name} | Ink & Identity`,
      seoDescription: item.seoDescription?.trim() || item.description,
      sortOrder: item.sortOrder,
      productCount: item.productCount ?? 0,
      coverUrl: item.coverPath ?? "",
      coverAlt: item.coverAlt?.trim() || item.name,
      published: item.published ?? true,
    });
  }

  return [...cards, ...extras].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function publishedCategory(slug: string, live?: LiveCategory[]) {
  return publishedCategories(live).find((category) => category.slug === slug) ?? null;
}

function toShopProduct(category: CatalogueCategory, product: CatalogueProduct): ShopProduct {
  return {
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    coverUrl: product.image,
    coverAlt: product.alt,
    categoryName: category.name,
    categorySlug: category.slug,
    price: product.price,
    currency: "ZAR",
    priceDisplay: product.priceDisplay,
    availability: "made_to_order",
    featured: Boolean(product.featured),
    seoTitle: `${product.name} | ${category.name} | Ink & Identity`,
    seoDescription: `${product.shortDescription} Sublimated by Ink & Identity in White River.`,
  };
}

export function publishedProducts(categorySlug?: string): ShopProduct[] {
  const rows: ShopProduct[] = [];
  for (const category of CATALOGUE) {
    for (const product of category.products) {
      const listed = !categorySlug || category.slug === categorySlug || product.listIn?.includes(categorySlug);
      if (listed) {
        rows.push(toShopProduct(category, product));
      }
    }
  }
  return rows;
}

export function applyFeatured(products: ShopProduct[], slugs: readonly string[] | null): ShopProduct[] {
  if (!slugs) {
    return products;
  }
  const chosen = new Set(slugs);
  return products.map((product) => ({ ...product, featured: chosen.has(product.slug) }));
}

export function featuredProducts(slugs: readonly string[]): ShopProduct[] {
  const bySlug = new Map(publishedProducts().map((product) => [product.slug, product]));
  return slugs.flatMap((slug) => {
    const product = bySlug.get(slug);
    return product ? [{ ...product, featured: true }] : [];
  });
}

export function relatedProducts(slug: string, limit = 3): ShopProduct[] {
  const current = publishedProduct(slug);
  if (!current) {
    return [];
  }
  return publishedProducts(current.categorySlug)
    .filter((product) => product.slug !== slug)
    .slice(0, limit);
}

export function publishedProduct(slug: string) {
  return publishedProducts().find((product) => product.slug === slug) ?? null;
}

export function coverChoices() {
  return CATALOGUE.flatMap((category) =>
    category.products.map((product) => ({
      value: product.image,
      label: `${category.name} — ${product.name}`,
    })),
  );
}
