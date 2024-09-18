import { dbCredentialsSchema } from "@/config/db-credentials";
import { getConfig } from "@/config/getter";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config = getConfig(dbCredentialsSchema);
if (config.isErr()) throw config.error;

const client = new Client(config.value);

await client.connect();

export const db = drizzle(client);
