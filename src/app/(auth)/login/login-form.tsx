"use client";

import { useActionState } from "react";
import { login } from "@/app/(auth)/login/login-action";
import { SubmitButton } from "@/components/submit-button";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <form action={action}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}
      {redirectTo && (
        <input name="redirectTo" type="hidden" value={redirectTo} />
      )}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && <p>{state.errors.password}</p>}
      <SubmitButton />
    </form>
  );
}
