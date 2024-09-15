import { LoginFormSchema, type FormState } from "./definitions";
import { comparePasswords } from "@/auth/user";
import { err, ok } from "neverthrow";
import { WrongInput } from "@/errors/wrong-input";
import { Unauthorized } from "@/errors/unauthorized";
import { createSession } from "@/auth/session";
import { redirect } from "next/navigation";
import { getUser } from "@/db/user/select";

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
