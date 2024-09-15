import { z } from "zod";
import { zodBooleanWithDefault } from "./zod-boolean";

export const dbCredentialsSchema = z
  .object({
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PORT: z.string().transform(Number),
    DB_PASSWORD: z.string(),
    DB_SSL: zodBooleanWithDefault("false"),
  })
  .transform(
    ({
      DB_HOST: host,
      DB_NAME: database,
      DB_PASSWORD: password,
      DB_PORT: port,
      DB_SSL: ssl,
      DB_USER: user,
    }) => ({ host, database, password, port, user, ssl }),
  );
