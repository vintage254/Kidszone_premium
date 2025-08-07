import { createId } from "@paralleldrive/cuid2";
import type { InferSelectModel } from "drizzle-orm";
import {
  varchar,
  uuid,
  integer,
  text,
  pgTable,
  date,
  pgEnum,
  timestamp,
  boolean as pgBoolean,
  foreignKey,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);


export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  refNo: text("ref_no").notNull(),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

});


export type User = InferSelectModel<typeof users>;
