import { query } from "./_generated/server";
import { requireStaff } from "./lib/permissions";
import { isCampaignLive } from "./lib/quoteValidation";

export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const [quotes, products, projects, services, campaigns, posts] = await Promise.all([
      ctx.db.query("quoteRequests").collect(),
      ctx.db.query("products").collect(),
      ctx.db.query("portfolioProjects").collect(),
      ctx.db.query("services").collect(),
      ctx.db.query("campaigns").collect(),
      ctx.db.query("journalPosts").collect(),
    ]);
    const now = Date.now();
    return {
      newQuotes: quotes.filter((item) => item.status === "new" && !item.spamFlag).length,
      activeProducts: products.filter((item) => item.published && !item.archived).length,
      publishedProjects: projects.filter((item) => item.published && !item.archived).length,
      activeServices: services.filter((item) => item.published && !item.archived).length,
      liveCampaigns: campaigns.filter(
        (item) => item.published && !item.archived && isCampaignLive(item.startAt, item.endAt, now),
      ).length,
      publishedArticles: posts.filter((item) => item.status === "published" && !item.archived)
        .length,
      recentQuotes: quotes
        .filter((item) => !item.spamFlag)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 6)
        .map((item) => ({
          _id: item._id,
          name: item.name,
          needType: item.needType,
          status: item.status,
          createdAt: item.createdAt,
        })),
    };
  },
});
