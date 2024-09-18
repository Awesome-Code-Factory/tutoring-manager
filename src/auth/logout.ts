"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(redirectTo?: string) {
  cookies().delete("session");
  redirect(`/login?redirectTo=${redirectTo}`);
}