import { z } from "zod";

export const authConfig = z
  .object({
    SESSION_SECRET: z.string().min(1),
  })
  .transform(({ SESSION_SECRET }) => ({ sessionSecret: SESSION_SECRET }));
