import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 100 }).notNull(),
  active: boolean("active").default(true).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  photoUrl: varchar("photo_url", { length: 200 }),
  color: varchar("color", { length: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
