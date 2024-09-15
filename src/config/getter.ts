import { InternalServerError } from "@/errors/server";
import { err, ok } from "neverthrow";
import type { z } from "zod";

export function getConfig<T, TTypeDef extends z.ZodTypeDef, TInput>(
  schema: z.ZodSchema<T, TTypeDef, TInput>,
) {
  const result = schema.safeParse(process.env);
  if (result.success) {
    return ok(result.data);
  }
  const error = new InternalServerError(
    "Environment variables missing or invalid",
  );
  error.cause = result.error;
  return err(error);
}
