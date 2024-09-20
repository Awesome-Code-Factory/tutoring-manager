"use server";
import { LoginFormSchema, type FormState } from "./definitions";
import { comparePasswords } from "@/auth/user";
import { err, ok, ResultAsync } from "neverthrow";
import { WrongInput } from "@/errors/wrong-input";
import { Unauthorized } from "@/errors/unauthorized";
import { createSession } from "@/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { InternalServerError } from "@/errors/server";
import { NotFound } from "@/errors/not-found";
import { cookies } from "next/headers";

export async function login(state: FormState, formData: FormData) {
  const loginResult = await tryLogin(formData);

  if (loginResult.isErr()) {
    const error = loginResult.error;
    if (error.code === 400) {
      return {
        errors: error.fields,
      };
    }
    if (error.code === 401) {
      return {
        errors: {
          password: ["Incorrect password"],
        },
      };
    }
    if (error.code === 404) {
      return {
        errors: { email: ["this user does not exist"] },
      };
    }

    throw error;
  }

  cookies().set(...loginResult.value);

  const redirectTo = formData.get("redirectTo") as string;

  if (redirectTo) redirect(redirectTo);

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

  const isPasswordCorrect = await comparePasswords(
    password,
    user.hashedPassword,
  );

  if (!isPasswordCorrect) {
    return err(new Unauthorized("Wrong password"));
  }

  return createSession(user.id);
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
