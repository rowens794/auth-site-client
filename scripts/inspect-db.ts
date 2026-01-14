import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  console.log("--- Tables ---");
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table';"
  );
  for (const row of tables.rows) {
    const tableName = row.name as string;
    console.log(`\nTable: ${tableName}`);
    const columns = await client.execute(`PRAGMA table_info(${tableName});`);
    console.table(columns.rows);
  }
}

main().catch(console.error);
