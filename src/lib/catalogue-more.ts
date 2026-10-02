type PriceDisplay = "show_price" | "request_quote";

type Product = {
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

type Category = {
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  coverSlug: string;
  products: Product[];
};

function piece(
  slug: string,
  name: string,
  short: string,
  image: string,
  alt: string,
  extra: Partial<Product> = {},
): Product {
  return {
    slug,
    name,
    shortDescription: short,
    longDescription: extra.longDescription ?? short,
    image,
    alt,
    priceDisplay: extra.priceDisplay ?? "request_quote",
    price: extra.price,
    featured: extra.featured,
    listIn: extra.listIn,
  };
}

function fromFolder(
  folder: string,
  rows: Array<[string, string, string, string?]>,
): Product[] {
  return rows.map(([slug, name, file, alt]) =>
    piece(
      slug,
      name,
      `Sublimated ${name.toLowerCase()}.`,
      file ? `/products/${folder}/${file}` : "",
      alt ?? name,
    ),
  );
}

export const EXTRA_DOG_TAGS: Product[] = [
  piece(
    "luca-army-tags",
    "Army-style dog tags",
    "Army-style photo dog tags on a ball chain.",
    "/products/dog-tags/luca-army.jpg",
    "Sublimated army-style dog tags with handprints and a baby photo",
    { featured: true },
  ),
];

export const EXTRA_MUGS: Product[] = [
  piece(
    "gideon-mug-coaster",
    "Safari mug and coaster",
    "A sublimated safari mug with a matching coaster.",
    "/products/coffee-mugs/gideon-mug-coaster.jpg",
    "Sublimated safari mug and matching wildlife coaster",
    { featured: true, listIn: ["coasters"] },
  ),
  piece(
    "landie-mug-coaster",
    "Floral horse mug and coaster",
    "A floral horse mug with a lilac handle and a matching coaster.",
    "/products/coffee-mugs/landie-mug-coaster.jpg",
    "Sublimated floral horse mug with a lilac handle and matching coaster",
    { featured: true, listIn: ["coasters"] },
  ),
  piece(
    "hannie-mug-coaster",
    "Elephant mug and coaster",
    "An elephant mug with a blue handle and a matching coaster.",
    "/products/coffee-mugs/hannie-mug-coaster.jpg",
    "Sublimated elephant mug with a blue handle and matching coaster",
    { featured: true, listIn: ["coasters"] },
  ),
  piece(
    "chris-adventure-set",
    "Adventure set",
    "A mug, coaster, lighter and skinny tumbler in one hunt design.",
    "/products/coffee-mugs/chris-adventure-set.jpg",
    "Sublimated mug, coaster, lighter and Live the Adventure tumbler",
    { featured: true, listIn: ["coasters", "skinny-tumblers"] },
  ),
];

export const MORE_CATEGORIES: Category[] = [
  {
    slug: "coasters",
    name: "Coasters",
    description: "Sublimated rubber coasters, printed in full colour.",
    seoTitle: "Sublimated coasters | Ink & Identity",
    seoDescription: "Sublimated rubber coasters from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 4,
    coverSlug: "she-is-worthy-coaster",
    products: fromFolder("coasters", [
      ["ac-fitness-coasters", "AC Fitness coasters", "ac-fitness.jpg"],
      ["brother-alone-coaster", "Brother coaster", "brother-alone.jpg"],
      ["drinks-are-on-me", "Drinks are on me", "drinks-are-on-me.jpg"],
      ["old-but-cool-dad", "Old but cool dad", "old-but-cool-dad.jpg"],
      ["braver-stronger-loved", "Braver, stronger, loved", "braver-stronger-loved.jpg"],
      ["always-my-mom", "Always my mom", "always-my-mom.jpg"],
      ["colour-girl", "Colour girl", "colour-girl.jpg"],
      ["brother-in-law-coaster", "Brother-in-law coaster", "brother-in-law.jpg"],
      ["judz-coaster", "Portrait coaster", "judz.jpg"],
      ["tristan-coaster", "Photo portrait coaster", "tristan.jpg"],
      ["vacation-coaster", "Vacation coaster", "vacation.jpg"],
      ["family-coaster", "Family coaster", "family.jpg"],
      ["ouma-girlfriend", "Ouma coaster", "ouma-girlfriend.jpg"],
      ["luhan-all-blacks", "All Blacks coaster", "luhan-all-blacks.jpg"],
      ["luhan-twane", "Couple coaster", "luhan-twane.jpg"],
      ["w-monogram", "W monogram coaster", "w-monogram.jpg"],
      ["apex-wellness-coaster", "Apex Wellness coaster", "apex-wellness.jpg"],
      ["she-is-worthy-coaster", "She is Worthy coaster", "she-is-worthy.jpg"],
      ["chris-coaster", "Hunt coaster", "chris.jpg"],
      ["manzelle-kobus-coasters", "Leopard and orchard coasters", "manzelle-kobus.jpg"],
    ]),
  },
  {
    slug: "skinny-tumblers",
    name: "Skinny tumblers",
    description: "Sublimated 15oz and 20oz stainless steel skinny tumblers.",
    seoTitle: "Sublimated skinny tumblers | Ink & Identity",
    seoDescription:
      "Sublimated 15oz and 20oz stainless skinny tumblers from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 5,
    coverSlug: "snethemba-tumbler",
    products: [
      piece(
        "brandy-collection",
        "Brandy collection tumblers",
        "A pair of tall frosted tumblers.",
        "/products/frosted-glasses/brandy-collection.jpg",
        "Two sublimated frosted tumblers, one about listening and one a brandy collection",
        { featured: true },
      ),
      ...fromFolder("skinny-tumblers", [
      ["charmaine-family-tumbler", "Family photo tumbler", "charmaine-family.jpg"],
      ["charmaine-baby-tumbler", "Baby photo tumbler", "charmaine-baby.jpg"],
      ["snethemba-tumbler", "Portrait tumbler", "snethemba.jpg"],
      ["girlfriend-birthday-tumbler", "Girlfriend birthday tumbler", "girlfriend-birthday.jpg"],
      ["judz-tumbler", "Photo tumbler", "judz.jpg"],
      ["carel-tumbler", "Custom photo tumbler", "carel.jpg"],
      ["to-my-sister-tumbler", "To my sister tumbler", "to-my-sister.jpg"],
      ["luca-van-den-berg-tumbler", "Personalised tumbler", "luca-van-den-berg.jpg"],
      ["mom-tumbler", "Mom tumbler", "mom.jpg"],
      ["dad-legend-tumbler", "Dad legend tumbler", "dad-legend.jpg"],
      ["pj-klipdrift-tumbler", "Klipdrift tumbler", "pj-klipdrift.jpg"],
      ["milandri-tumbler", "Script tumbler", "milandri.jpg"],
      ["brother-tumbler", "Brother tumbler", "brother.jpg"],
    ]),
    ],
  },
  {
    slug: "water-bottles",
    name: "Water bottles",
    description: "Sublimated 20oz stainless steel skinny bottles with a sport lid.",
    seoTitle: "Sublimated water bottles | Ink & Identity",
    seoDescription:
      "Sublimated 20oz stainless skinny water bottles from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 6,
    coverSlug: "nellie-bottle",
    products: [
      piece("nellie-bottle", "Portrait bottle", "A sublimated bottle with a sport lid.", "/products/water-bottles/nellie.jpg", "Sublimated portrait water bottles", { featured: true }),
      piece("miano-aircraft-bottle", "Aircraft bottle", "A sublimated aircraft bottle.", "/products/water-bottles/miano-aircraft.jpg", "Sublimated aircraft water bottle"),
      piece("miano-vintage-bottle", "Vintage aircraft bottle", "A sublimated vintage aircraft bottle.", "/products/water-bottles/miano-vintage.jpg", "Sublimated vintage aircraft water bottle"),
      piece("ac-fitness-bottle", "AC Fitness bottle", "A sublimated AC Fitness bottle.", "/products/water-bottles/ac-fitness-bottle.jpg", "Sublimated AC Fitness water bottle"),
      piece("merry-pebbles-bottle", "Scenic photo bottle", "A sublimated photo bottle.", "/products/water-bottles/merry-pebbles.jpg", "Sublimated scenic photo water bottle"),
      piece("mother-trucker-bottle", "Mother Trucker bottle", "A sublimated Mother Trucker bottle.", "/products/water-bottles/mother-trucker.jpg", "Sublimated Mother Trucker water bottle"),
    ],
  },
  {
    slug: "can-coolers",
    name: "Can coolers",
    description: "Sublimated stainless can coolers.",
    seoTitle: "Sublimated can coolers | Ink & Identity",
    seoDescription: "Sublimated can coolers from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 7,
    coverSlug: "super-aj-coolers",
    products: [
      piece("mikayla-coolers", "Character can coolers", "Cocomelon can coolers sublimated in full colour.", "/products/can-coolers/mikayla.jpg", "Three sublimated character can coolers", { featured: true }),
      piece("super-aj-coolers", "Game can coolers", "A set of sublimated game can coolers.", "/products/can-coolers/super-aj.jpg", "Three sublimated game can coolers", { featured: true }),
      piece("raptors-coolers", "Raptors can coolers", "Slim can coolers sublimated for Raptors.", "/products/can-coolers/raptors.jpg", "Three sublimated Raptors can coolers"),
      piece("ac-fitness-coolers", "AC Fitness can coolers", "Slim can coolers sublimated for AC Fitness.", "/products/can-coolers/ac-fitness-cans.jpg", "Three sublimated AC Fitness can coolers"),
    ],
  },
  {
    slug: "beer-mugs",
    name: "Beer mugs",
    description: "Sublimated frosted beer mugs.",
    seoTitle: "Sublimated beer mugs | Ink & Identity",
    seoDescription: "Sublimated frosted beer mugs from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 8,
    coverSlug: "braai-drinking-mugs",
    products: [
      piece(
        "braai-drinking-mugs",
        "Braai and drinking mugs",
        "Frosted beer mugs printed Then, Braai & Drinking, and Now.",
        "/products/beer-mugs/braai-drinking.jpg",
        "Three sublimated frosted beer mugs",
      ),
    ],
  },
  {
    slug: "pillows",
    name: "Pillows",
    description: "Sublimated 9-panel pillow cases.",
    seoTitle: "Sublimated pillows | Ink & Identity",
    seoDescription: "Sublimated 9-panel pillow cases from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 10,
    coverSlug: "eksteen-family-pillow",
    products: [
      piece(
        "eksteen-family-pillow",
        "Family photo pillow",
        "A 9-panel pillow case and pillow.",
        "/products/pillows/eksteen-family.jpg",
        "Sublimated 9-panel family photo pillow",
        { featured: true },
      ),
      piece(
        "eksteen-dogs-pillow",
        "Family and dogs pillow",
        "A 9-panel pillow case with the family and their dogs.",
        "/products/pillows/eksteen-dogs.jpg",
        "Sublimated 9-panel family pillow with dogs",
      ),
    ],
  },
  {
    slug: "clocks",
    name: "Photo clocks",
    description: "Sublimated square photo clocks.",
    seoTitle: "Sublimated photo clocks | Ink & Identity",
    seoDescription: "Sublimated photo clocks from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 11,
    coverSlug: "family-photo-clock",
    products: [
      piece(
        "family-photo-clock",
        "Family photo clock",
        "A square sublimated photo clock.",
        "/products/clocks/family-photo.jpg",
        "Square sublimated family photo clock",
        { featured: true },
      ),
    ],
  },
  {
    slug: "gift-sets",
    name: "Gift sets",
    description: "Matching sublimated sets — mug, coaster and key ring.",
    seoTitle: "Sublimated gift sets | Ink & Identity",
    seoDescription: "Matching sublimated gift sets from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 12,
    coverSlug: "diana-set",
    products: [
      piece(
        "diana-set",
        "Bulbinella gift set",
        "A matching mug, coaster and key ring.",
        "/products/gift-sets/diana.jpg",
        "Sublimated mug, coaster and key ring gift set",
        { featured: true },
      ),
    ],
  },
  {
    slug: "mousepads",
    name: "Mousepads",
    description: "Sublimated photo mousepads.",
    seoTitle: "Sublimated mousepads | Ink & Identity",
    seoDescription: "Sublimated mousepads from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 13,
    coverSlug: "sunset-couple-mousepad",
    products: [
      piece(
        "sunset-couple-mousepad",
        "Sunset couple mousepad",
        "A photo mousepad edged with fairy lights.",
        "/products/mousepads/sunset-couple.jpg",
        "Sublimated sunset couple mousepad with fairy lights",
      ),
    ],
  },
  {
    slug: "bar-mats",
    name: "Bar mats",
    description: "Sublimated bar mats.",
    seoTitle: "Sublimated bar mats | Ink & Identity",
    seoDescription: "Sublimated bar mats from Ink & Identity in White River. Order on WhatsApp.",
    sortOrder: 14,
    coverSlug: "photo-collage-bar-mat",
    products: [
      piece(
        "photo-collage-bar-mat",
        "Photo collage bar mat",
        "A photo collage bar mat.",
        "/products/bar-mats/photo-collage.jpg",
        "Sublimated photo collage bar mat",
        { featured: true },
      ),
    ],
  },
];
