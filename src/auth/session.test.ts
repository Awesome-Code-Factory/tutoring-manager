// @vitest-environment node
import type { UserId } from "@/db/schema";
import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "./session";
import { InternalServerError } from "@/errors/server";

describe("JWT encryption", () => {
  process.env.SESSION_SECRET = "totally secret";
  it("should encrypt and decrypt payload", async () => {
    const payload = {
      userId: 1234 as UserId,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    };

    const encrypted = await encrypt(payload);
    if (encrypted.isErr()) throw new Error("should not happen");

    const decrypted = await decrypt(encrypted.value);
    if (decrypted.isErr()) throw new Error("should not happen");

    expect(decrypted.value.userId).toBe(1234);
  });

  it("should fail to encrypt if no SESSION_SECRET is set", async () => {
    delete process.env.SESSION_SECRET;

    const payload = {
      userId: 1234 as UserId,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    };
    const encrypted = await encrypt(payload);
    if (encrypted.isOk()) throw new Error("should not happen");

    expect(encrypted.error).toBeInstanceOf(InternalServerError);
  });
});
