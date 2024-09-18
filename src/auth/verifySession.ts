import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";

export const verifySession = cache(async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (session.isErr()) {
    return { isAuth: false, userId: null };
  }
  const { userId } = session.value;

  if (!session.value.userId) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId };
});
