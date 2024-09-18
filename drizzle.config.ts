import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";
import { getConfig } from "@/config/getter";
import { dbCredentialsSchema } from "@/config/db-credentials";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const configResult = getConfig(dbCredentialsSchema);

if (configResult.isErr()) throw configResult.error;

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  out: "src/db/",
  dbCredentials: configResult.value,
});
