import { z } from "zod";

export const authConfig = z.object({
  sessionSecret: z.string().min(1),
});
