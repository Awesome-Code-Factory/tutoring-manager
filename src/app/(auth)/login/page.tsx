import { login } from "@/app/(auth)/login/login-action";

export default function LoginPage() {
  return (
    <form action={login}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}
