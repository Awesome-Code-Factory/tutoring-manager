import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { z } from "zod";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const dbCredentialsSchema = z.object({
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PORT: z.string().transform((data) => Number(data)),
  DB_PASSWORD: z.string(),
});

const {
  DB_HOST: host,
  DB_NAME: database,
  DB_PASSWORD: password,
  DB_PORT: port,
  DB_USER: user,
} = dbCredentialsSchema.parse(process.env);

const client = new Client({
  host,
  database,
  password,
  port,
  user,
  ssl: false,
});
await client.connect();

export const db = drizzle(client);
