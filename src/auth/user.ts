import type { Brand } from "@/type-utils/brand";
import bcrypt from "bcrypt";

export type HashedPassword = Brand<string, "hashed">;

const saltRounds = 10;

export function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, saltRounds) as Promise<HashedPassword>;
}

export function comparePasswords(
  toVerify: string,
  hashedPassword: HashedPassword,
) {
  return bcrypt.compare(toVerify, hashedPassword);
}
