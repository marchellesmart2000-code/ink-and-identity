import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireStaff } from "./lib/permissions";
import { resolveGallery } from "./lib/media";
import { buildSearchText, slugify } from "./lib/slug";
import {
  availabilityValidator,
  imageAssetValidator,
  priceDisplayValidator,
  productOptionValidator,
} from "./lib/validators";

function isPubliclyVisible(product: {
  published: boolean;
  archived: boolean;
  availability: string;
}) {
  return (
    product.published &&
    !product.archived &&
    product.availability !== "archived"
  );
}

const productWriteFields = {
  name: v.string(),
  slug: v.optional(v.string()),
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
  specifications: v.array(v.object({ label: v.string(), value: v.string() })),
  careInstructions: v.string(),
  options: v.array(productOptionValidator),
  seoTitle: v.string(),
  seoDescription: v.string(),
  published: v.boolean(),
  sortOrder: v.number(),
};

export const listPublic = query({
  args: {
    search: v.optional(v.string()),
    categorySlug: v.optional(v.string()),
    collectionSlug: v.optional(v.string()),
    customerType: v.optional(v.string()),
    sort: v.optional(
      v.union(v.literal("featured"), v.literal("name"), v.literal("newest")),
    ),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();
    products = products.filter(isPubliclyVisible);

    if (args.categorySlug) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
        .unique();
      if (category) {
        products = products.filter((product) => product.categoryId === category._id);
      } else {
        products = [];
      }
    }

    if (args.collectionSlug) {
      const collection = await ctx.db
        .query("collections")
        .withIndex("by_slug", (q) => q.eq("slug", args.collectionSlug!))
        .unique();
      if (collection) {
        products = products.filter((product) =>
          product.collectionIds.includes(collection._id),
        );
      } else {
        products = [];
      }
    }

    if (args.search) {
      const needle = args.search.toLowerCase();
      products = products.filter((product) => product.searchText.includes(needle));
    }

    if (args.sort === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (args.sort === "newest") {
      products.sort((a, b) => b._creationTime - a._creationTime);
    } else {
      products.sort((a, b) => a.sortOrder - b.sortOrder || Number(b.featured) - Number(a.featured));
    }

    return await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        const gallery = await resolveGallery(ctx, product.gallery);
        return {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          categoryName: category?.name ?? "",
          categorySlug: category?.slug ?? "",
          tags: product.tags,
          productType: product.productType,
          personalizationOptions: product.personalizationOptions,
          availability: product.availability,
          priceDisplay: product.priceDisplay,
          price: product.priceDisplay === "show_price" ? product.price : undefined,
          currency: product.currency,
          featured: product.featured,
          newArrival: product.newArrival,
          leadTime: product.leadTime,
          cover: gallery[0] ?? null,
          sampleContent: product.sampleContent,
        };
      }),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!product || !isPubliclyVisible(product)) {
      return null;
    }
    const category = await ctx.db.get(product.categoryId);
    const gallery = await resolveGallery(ctx, product.gallery);
    const related = (
      await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", product.categoryId))
        .collect()
    )
      .filter((item) => item._id !== product._id && isPubliclyVisible(item))
      .slice(0, 3);

    const relatedCards = await Promise.all(
      related.map(async (item) => {
        const itemGallery = await resolveGallery(ctx, item.gallery);
        return {
          _id: item._id,
          name: item.name,
          slug: item.slug,
          shortDescription: item.shortDescription,
          cover: itemGallery[0] ?? null,
          availability: item.availability,
          priceDisplay: item.priceDisplay,
        };
      }),
    );

    const exampleProjects = (
      await ctx.db
        .query("portfolioProjects")
        .withIndex("by_published", (q) => q.eq("published", true))
        .collect()
    )
      .filter(
        (project) =>
          !project.archived &&
          project.productsUsed.some((used) =>
            used.toLowerCase().includes(product.name.toLowerCase().split(" ")[0] ?? ""),
          ),
      )
      .slice(0, 3);

    return {
      ...product,
      price: product.priceDisplay === "show_price" ? product.price : undefined,
      categoryName: category?.name ?? "",
      categorySlug: category?.slug ?? "",
      gallery,
      related: relatedCards,
      exampleProjects: exampleProjects.map((project) => ({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
      })),
    };
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const products = await ctx.db.query("products").collect();
    products.sort((a, b) => a.sortOrder - b.sortOrder);
    return products;
  },
});

export const getAdmin = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const product = await ctx.db.get(args.id);
    if (!product) {
      return null;
    }
    const gallery = await resolveGallery(ctx, product.gallery);
    return { ...product, gallery };
  },
});

export const create = mutation({
  args: productWriteFields,
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const slug = slugify(args.slug || args.name);
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new ConvexError("A product with this slug already exists.");
    }
    const category = await ctx.db.get(args.categoryId);
    return await ctx.db.insert("products", {
      ...args,
      slug,
      archived: false,
      sampleContent: false,
      searchText: buildSearchText([
        args.name,
        args.shortDescription,
        args.longDescription,
        args.productType,
        args.brandCollection,
        args.sku,
        category?.name,
        ...args.tags,
        ...args.personalizationOptions,
      ]),
    });
  },
});

export const update = mutation({
  args: { id: v.id("products"), ...productWriteFields },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...rest } = args;
    const current = await ctx.db.get(id);
    if (!current) {
      throw new ConvexError("Product not found.");
    }
    const slug = slugify(rest.slug || rest.name);
    const clash = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (clash && clash._id !== id) {
      throw new ConvexError("A product with this slug already exists.");
    }
    const category = await ctx.db.get(rest.categoryId);
    await ctx.db.patch(id, {
      ...rest,
      slug,
      searchText: buildSearchText([
        rest.name,
        rest.shortDescription,
        rest.longDescription,
        rest.productType,
        rest.brandCollection,
        rest.sku,
        category?.name,
        ...rest.tags,
        ...rest.personalizationOptions,
      ]),
    });
  },
});

export const archive = mutation({
  args: { id: v.id("products"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch(args.id, {
      archived: args.archived,
      availability: args.archived ? "archived" : "available_to_quote",
    });
  },
});
