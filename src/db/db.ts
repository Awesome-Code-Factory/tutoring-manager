import { dbCredentialsSchema } from "@/config/db-credentials";
import { getConfig } from "@/config/getter";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const client = new Client(getConfig(dbCredentialsSchema));

await client.connect();

export const db = drizzle(client);
