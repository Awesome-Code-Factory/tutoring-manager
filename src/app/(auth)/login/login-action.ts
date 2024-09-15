import { db } from "@/db/db";
import { users } from "@/db/schema";
import { LoginFormSchema, type FormState } from "./definitions";
import { comparePasswords } from "@/auth/user";
import { eq } from "drizzle-orm";
import { err, ok, Result, ResultAsync } from "neverthrow";
import { WrongInput } from "@/errors/wrong-input";
import { NotFound } from "@/errors/not-found";
import { InternalServerError } from "@/errors/server";
import { Unauthorized } from "@/errors/unauthorized";
import { createSession } from "@/auth/session";
import { redirect } from "next/navigation";

export async function login(state: FormState, formData: FormData) {
  "use server";
  const loginResult = await tryLogin(formData);

  if (loginResult.isErr()) {
    const error = loginResult.error;
    if (error.code === 400) {
      return {
        errors: error.fields,
      };
    }

    throw error;
  }

  redirect("/dashboard");
}

async function tryLogin(formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return err(new WrongInput(validatedFields.error.flatten().fieldErrors));
  }

  const { email, password } = validatedFields.data;

  const userResult = await getUser(email);

  if (userResult.isErr()) {
    return err(userResult.error);
  }
  const { value: user } = userResult;

  if (!comparePasswords(password, user.hashedPassword)) {
    return err(new Unauthorized("Wrong password"));
  }

  const sessionResult = await createSession(user.id);
  if (sessionResult.isErr()) {
    return err(sessionResult.error);
  }

  return ok("user logged in!" as const);
}

async function getUser(email: string) {
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
