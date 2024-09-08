import { z } from "zod";

const boolStringSchema = z.union([z.literal("true"), z.literal("false")]);
type BoolString = z.infer<typeof boolStringSchema>;

export function zodBooleanWithDefault(defaultValue: BoolString) {
  return boolStringSchema.default(defaultValue).transform((v) => v !== "false");
}
