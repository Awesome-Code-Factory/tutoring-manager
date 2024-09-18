// @vitest-environment node
import type { UserId } from "@/db/schema";
import { describe, it, vi, expect } from "vitest";
import { login } from "./login-action";
import type { HashedPassword } from "@/auth/user";
import * as navigation from "next/navigation";
import * as headers from "next/headers";
import { ok } from "neverthrow";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

vi.mock("next/navigation");
vi.mock("../../../db/user/select", () => ({
  getUser: vi.fn().mockImplementation(async () => {
    const { hashPassword } = await import("../../../auth/user");
    return ok({
      id: 1234 as UserId,
      hashedPassword: (await hashPassword("P@ssw0rd")) as HashedPassword,
    });
  }),
}));
vi.mock("next/headers");

describe("login action", async () => {
  const redirect = vi.spyOn(navigation, "redirect");

  const cookieSetter = vi.fn();
  vi.spyOn(headers, "cookies").mockImplementation(
    () =>
      ({
        set: cookieSetter,
      }) as unknown as ReadonlyRequestCookies,
  );

  process.env.SESSION_SECRET = "totally secret";

  it("should redirect if form is filled correctly", async () => {
    const form = new FormData();
    form.append("email", "john@doe.com");
    form.append("password", "P@ssw0rd");
    const result = await login(undefined, form);

    expect(result).toBeUndefined();

    expect(redirect).toHaveBeenCalled();
  });

  describe("wrong form input", () => {
    it("should return errors for both fields if empty", async () => {
      const result = await login(undefined, new FormData());
      expect(result.errors).toBeDefined();
      expect(result.errors.email).not.toHaveLength(0);
      expect(result.errors.password).not.toHaveLength(0);
    });

    it("should return error for password if only email passed", async () => {
      const formData = new FormData();
      formData.append("email", "firstname@lastname.com");
      const result = await login(undefined, formData);
      expect(result.errors.email).toBeUndefined();
      expect(result.errors.password).not.toHaveLength(0);
    });

    it("should return error for email if only password passed", async () => {
      const formData = new FormData();
      formData.append("password", "P@ssw0rd");
      const result = await login(undefined, formData);
      expect(result.errors.email).not.toHaveLength(0);
      expect(result.errors.password).toBeUndefined();
    });

    it("should fail for invalid email", async () => {
      const formData = new FormData();
      formData.append("email", "invalid email");
      const result = await login(undefined, formData);
      expect(result.errors.email).toContain("Please enter a valid email.");
    });
  });
});
