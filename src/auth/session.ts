import "server-only";
import { authConfig } from "@/config/auth";
import { getConfig } from "@/config/getter";
import type { UserId } from "@/db/schema";
import { InternalServerError } from "@/errors/server";
import { Unauthorized } from "@/errors/unauthorized";
import { SignJWT, jwtVerify } from "jose";
import { err, ok, Result, ResultAsync } from "neverthrow";
import { cookies } from "next/headers";
import { z } from "zod";

const getEncodedKey = Result.fromThrowable(
  () => {
    const configResult = getConfig(authConfig);
    if (configResult.isErr()) throw configResult.error;

    const { sessionSecret } = configResult.value;
    return new TextEncoder().encode(sessionSecret);
  },
  (e) => {
    if (e instanceof InternalServerError) return e;
    if (e instanceof Error) {
      const error = new InternalServerError(e.message);
      error.cause = e;
      return error;
    }
    return new InternalServerError("Unknown Error");
  },
);

const payloadSchema = z.object({
  userId: z.number(),
  expiresAt: z.number(),
});

const safeJwtVerify = ResultAsync.fromThrowable(
  (session: string, encodedKey) =>
    jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    }),
  (error) => {
    if (error instanceof Error) {
      const newError = new Unauthorized(error.message);
      newError.cause = error;
      return newError;
    }
    return new Unauthorized("Failed to verify session");
  },
);

export async function encrypt(payload: { userId: UserId; expiresAt: number }) {
  const encodedKeyResult = getEncodedKey();
  if (encodedKeyResult.isErr()) return err(encodedKeyResult.error);

  const encrypted = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKeyResult.value);

  return ok(encrypted);
}

export async function decrypt(session: string | undefined = "") {
  const encodedKeyResult = getEncodedKey();
  if (encodedKeyResult.isErr()) return err(encodedKeyResult.error);

  const verifyResult = await safeJwtVerify(session, encodedKeyResult.value);
  if (verifyResult.isErr()) {
    return err(verifyResult.error);
  }
  const {
    value: { payload },
  } = verifyResult;

  const payloadResult = payloadSchema.safeParse(payload);
  if (!payloadResult.success) {
    const error = new InternalServerError("Payload has invalid shape");
    error.cause = payloadResult.error;
    return err(error);
  }
  const {
    data: { userId, expiresAt },
  } = payloadResult;

  return ok({
    userId: userId as UserId,
    expiresAt,
  });
}

export async function createSession(userId: UserId) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const session = await encrypt({ userId, expiresAt });
  if (session.isErr()) return err(session.error);

  cookies().set("session", session.value, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return ok("session created!" as const);
}
