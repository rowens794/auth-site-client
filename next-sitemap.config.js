/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://swingmass.com",
  generateRobotsTxt: true,
  // Exclude API routes and other non-page routes
  exclude: ["/api/*"],
  // Generate sitemap index for larger sites
  generateIndexSitemap: false,
  // Additional options
  changefreq: "weekly",
  priority: 0.7,
  // Transform function to customize each URL entry
  transform: async (config, path) => {
    // Higher priority for homepage
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Standard priority for other pages
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
