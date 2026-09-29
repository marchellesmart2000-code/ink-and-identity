import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

http.route({
  path: "/sitemap.xml",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const siteUrl = (process.env.SITE_URL ?? "https://example.com").replace(/\/$/, "");
    const [services, products, collections, categories] = await Promise.all([
      ctx.runQuery(api.services.listPublic, {}),
      ctx.runQuery(api.products.listPublic, {}),
      ctx.runQuery(api.collections.listPublic, {}),
      ctx.runQuery(api.collections.listCategories, {}),
    ]);
    const staticPaths = [
      "/",
      "/services",
      "/shop",
      "/about",
      "/quote",
      "/contact",
      "/privacy",
      "/terms",
    ];
    const urls = [
      ...staticPaths,
      ...services.map((item) => `/services/${item.slug}`),
      ...categories.map((item) => `/shop/category/${item.slug}`),
      ...products.map((item) => `/shop/${item.slug}`),
      ...collections.map((item) => `/collections/${item.slug}`),
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url><loc>${siteUrl}${path}</loc><changefreq>weekly</changefreq></url>`,
  )
  .join("\n")}
</urlset>`;
    return new Response(body, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }),
});

export default http;
