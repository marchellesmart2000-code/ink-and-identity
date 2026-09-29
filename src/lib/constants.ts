export const QUOTE_CATEGORIES = [
  { slug: "acrylic-keyrings", name: "Acrylic Keyrings" },
  { slug: "coffee-mugs", name: "Coffee Mugs" },
  { slug: "click-pens", name: "Click Pens" },
  { slug: "glass-clock", name: "Glass Clock" },
  { slug: "glass-fridge-magnets", name: "Glass Fridge Magnets" },
  { slug: "15oz-stainless-steel-tumbler", name: "15oz Stainless Steel Tumbler" },
  { slug: "20oz-stainless-steel-tumbler", name: "20oz Stainless Steel Tumbler" },
  { slug: "mousepads", name: "Mousepads" },
  { slug: "rubber-coasters", name: "Rubber Coasters" },
  { slug: "stainless-steel-waterbottle", name: "Stainless Steel Waterbottle" },
  { slug: "bar-mats", name: "Bar mats" },
  { slug: "tshirts", name: "TShirts" },
] as const;

export function quoteCategoryName(slug: string): string | undefined {
  return QUOTE_CATEGORIES.find((category) => category.slug === slug)?.name;
}

export const SEGMENTS = [
  {
    slug: "businesses-brands",
    title: "Businesses & Brands",
    body: "Marks, uniforms, client gifts and the objects that sit on a desk every day.",
    href: "/services/branded-apparel",
  },
  {
    slug: "events-celebrations",
    title: "Events & Celebrations",
    body: "Coordinated pieces for a date that matters — launches, gatherings, thanks.",
    href: "/collections/event-packs",
  },
  {
    slug: "personal-gifting",
    title: "Personal Gifting",
    body: "A name, a line, a private reference — made to be kept.",
    href: "/services/personalized-gifts",
  },
] as const;

export const SAMPLE_HERO_VIDEO = "/media/hero-gift-wrap.mp4";

export const PLACEHOLDER_TONES = [
  "from-[#050505] to-[#3a2e18]",
  "from-[#0a0a0a] to-[#4a3b1c]",
  "from-[#111111] to-[#5c4a24]",
  "from-[#080808] to-[#2e2614]",
  "from-[#0c0c0c] to-[#6b5428]",
  "from-[#050505] via-[#1a150c] to-[#c6a35a]/50",
] as const;
