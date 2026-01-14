import { config } from "dotenv";
import { execSync } from "child_process";
import path from "path";

// Load .env.local before importing db module
config({ path: path.resolve(process.cwd(), ".env.local") });

async function generateSitemap() {
  // Dynamic import after env is loaded
  const { getSite } = await import("../lib/db");
  const site = await getSite();

  if (!site?.domain) {
    console.error("No site domain found in database");
    process.exit(1);
  }

  const siteUrl = `https://${site.domain}`;
  console.log(`Generating sitemap for ${siteUrl}`);

  execSync("npx next-sitemap", {
    stdio: "inherit",
    env: {
      ...process.env,
      SITE_URL: siteUrl,
    },
  });
}

generateSitemap().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
