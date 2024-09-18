import type { HashedPassword } from "@/auth/user";
import type { Brand } from "@/type-utils/brand";
import type { StrictOmit } from "@/type-utils/strict-omit";
import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export type UserId = Brand<number, "userId">;

export const users = pgTable("users", {
  id: serial("id").primaryKey().$type<UserId>(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 100 })
    .notNull()
    .$type<HashedPassword>(),
  active: boolean("active").default(true).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  photoUrl: varchar("photo_url", { length: 200 }),
  color: varchar("color", { length: 6 }).notNull(),
});

export type User = StrictOmit<typeof users.$inferSelect, "hashedPassword">;
