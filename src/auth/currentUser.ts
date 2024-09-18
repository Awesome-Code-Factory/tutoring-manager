import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "./verifySession";

export async function currentUser() {
  const { userId } = await verifySession();
  if (userId === null) return null;
  try {
    const query = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        active: users.active,
        photoUrl: users.photoUrl,
        color: users.color,
      })
      .from(users)
      .where(eq(users.id, userId));
    if (query.length !== 0) {
      const user = query[0];
      if (user) return user;
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}
