import type { z } from "zod";

export function getConfig<T, TTypeDef extends z.ZodTypeDef, TInput>(
  schema: z.ZodSchema<T, TTypeDef, TInput>,
) {
  return schema.parse(process.env);
}
