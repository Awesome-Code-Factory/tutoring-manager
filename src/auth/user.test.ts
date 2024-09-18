import { describe, expect, it } from "vitest";
import { comparePasswords, hashPassword } from "./user";

describe("hash function", () => {
  it.each(["P@ssw0rd", "hello", "super long string"])(
    "should hash and successfuly compare password: %s",
    async (key) => {
      await expect(
        comparePasswords(key, await hashPassword(key)),
      ).resolves.toBeTruthy();
    },
  );

  it("should fail with a password that similar to original one", async () => {
    const hashedPassword = await hashPassword("P@ssw0rd");
    await expect(
      comparePasswords("P@ssw0000rd", hashedPassword),
    ).resolves.toBeFalsy();
  });
});
