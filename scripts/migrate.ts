import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  console.log("Running migrations...\n");

  // Create email_subscriptions table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_subscriptions (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (site_id) REFERENCES sites(id),
      UNIQUE(site_id, email)
    )
  `);
  console.log("✓ Created email_subscriptions table");

  // Create contact_messages table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (site_id) REFERENCES sites(id)
    )
  `);
  console.log("✓ Created contact_messages table");

  console.log("\nMigrations complete!");
}

migrate().catch(console.error);
