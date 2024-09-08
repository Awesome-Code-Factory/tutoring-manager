import { pgTable, serial, varchar, text, smallint } from "drizzle-orm/pg-core";

export const parent = pgTable("parent", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).unique(),
  phone: varchar("phone", { length: 15 }).unique(),
  comment: text("comment"),
});
