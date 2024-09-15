import type { UserId } from "@/db/schema";
import { describe, it, vi, expect } from "vitest";
import { login } from "./login-action";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/auth/user", () => ({ comparePasswords: vi.fn() }));
vi.mock("@/auth/session", () => ({ createSession: vi.fn() }));
vi.mock("@/db/user/select", () => ({
  getUser: vi.fn().mockResolvedValue({
    id: 123 as UserId,
    hashedPassword: "asdfiuhaweifuas",
  }),
}));

describe("login action", () => {
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

    it("should fail for invalid password", async () => {
      const formData = new FormData();
      formData.append("password", "invalid");
      const result = await login(undefined, formData);
      expect(result.errors.password).toContain("Be at least 8 characters long");
      expect(result.errors.password).toContain("Contain at least one number.");
      expect(result.errors.password).toContain(
        "Contain at least one special character.",
      );
    });

    it("should fail for only numerical password", async () => {
      const formData = new FormData();
      formData.append("password", "1234556798123987");
      const result = await login(undefined, formData);
      expect(result.errors.password).toContain("Contain at least one letter.");
    });
  });
});
