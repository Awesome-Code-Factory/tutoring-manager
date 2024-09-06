import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";
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

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  out: "src/db/",
  dbCredentials: {
    host,
    database,
    password,
    port,
    user,
    ssl: false,
  },
});
