import { err, ok, ResultAsync } from "neverthrow";
import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { InternalServerError } from "@/errors/server";
import { NotFound } from "@/errors/not-found";

export async function getUser(email: string) {
  const safeSelectFromDb = ResultAsync.fromThrowable(
    () =>
      db
        .select({ id: users.id, hashedPassword: users.hashedPassword })
        .from(users)
        .where(eq(users.email, email)),
    (error) => {
      if (error instanceof Error) {
        const newError = new InternalServerError(error.message);
        newError.cause = error;
        return newError;
      }
      return new InternalServerError("Database failed to respond");
    },
  );
  const userList = await safeSelectFromDb();

  if (userList.isErr()) {
    return err(userList.error);
  }

  const user = userList.value[0];

  if (!user) {
    return err(new NotFound("No such user in database"));
  }

  return ok(user);
}
