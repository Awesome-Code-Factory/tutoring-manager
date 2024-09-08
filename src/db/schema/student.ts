import { pgTable, serial, varchar, text, smallint } from "drizzle-orm/pg-core";
import { parent } from "./parent";

export const student = pgTable("student", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).unique(),
  phone: varchar("phone", { length: 15 }).unique(),
  grade: smallint("grade").notNull(),
  comment: text("comment"),
  parentId: serial("parent_id")
    .notNull()
    .references(() => parent.id),
});
