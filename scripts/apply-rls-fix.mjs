#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const sql = readFileSync(resolve(__dirname, "../supabase/migrations/006_fix_profiles_rls.sql"), "utf8");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Try to execute SQL via a raw query approach
// Supabase doesn't allow raw SQL via REST, so we need pg connection
const { Client } = await import("pg");

const client = new Client({
  host: "db.pwutyibfjskhlzldmjdg.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "Acc123acc123@",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connected to Supabase PostgreSQL");
  await client.query(sql);
  console.log("Migration applied successfully!");
} catch (err) {
  console.error("Failed:", err.message);
  // Fallback: try pooler
  try {
    const client2 = new Client({
      host: "aws-0-ap-south-1.pooler.supabase.com",
      port: 5432,
      database: "postgres",
      user: "postgres.pwutyibfjskhlzldmjdg",
      password: "Acc123acc123@",
      ssl: { rejectUnauthorized: false },
    });
    await client2.connect();
    console.log("Connected via pooler");
    await client2.query(sql);
    console.log("Migration applied successfully!");
    await client2.end();
  } catch (err2) {
    console.error("Pooler also failed:", err2.message);
    console.error("\n--- Paste this SQL into Supabase Dashboard → SQL Editor ---\n");
    console.log(sql);
    process.exit(1);
  }
}

await client.end();
