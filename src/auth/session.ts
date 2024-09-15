import { authConfig } from "@/config/auth";
import { getConfig } from "@/config/getter";
import type { UserId } from "@/db/schema";
import { InternalServerError } from "@/errors/server";
import { Unauthorized } from "@/errors/unauthorized";
import { SignJWT, jwtVerify } from "jose";
import { err, ok, ResultAsync } from "neverthrow";
import { cookies } from "next/headers";
import { z } from "zod";

const configResult = getConfig(authConfig);
if (configResult.isErr()) throw configResult.error;

const { sessionSecret } = configResult.value;
const encodedKey = new TextEncoder().encode(sessionSecret);

const payloadSchema = z.object({
  userId: z.number(),
  expiresAt: z.number(),
});

const safeJwtVerify = ResultAsync.fromThrowable(
  (session: string) =>
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

async function encrypt(payload: { userId: UserId; expiresAt: number }) {
  return ok(
    await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey),
  );
}

export async function decrypt(session: string | undefined = "") {
  const verifyResult = await safeJwtVerify(session);
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
  const tokenResult = await encrypt({ userId, expiresAt });

  if (tokenResult.isErr()) {
    return err(tokenResult.error);
  }

  const { value: session } = tokenResult;

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return ok("session created!" as const);
}
