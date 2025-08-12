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
  numeric,
} from "drizzle-orm/pg-core";


export const ROLE_ENUM = pgEnum("role", ["ADMIN", "USER", "SELLER"]);

export const ORDER_STATUS_ENUM = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "FAILED",
]);

// Message sender enum for chat system
export const MESSAGE_SENDER_ENUM = pgEnum("message_sender", [
  "USER",
  "ADMIN",
]);


export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").unique(), // Clerk's user ID for authentication
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password"), // Optional for Clerk users
  refNo: text("ref_no").notNull(),
  status: text("status").default('active'),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

});


export const products = pgTable("products", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: numeric("price").notNull(),
  image1: text("image1"),
  image2: text("image2"),
  image3: text("image3"),
  image4: text("image4"),
  isFeatured: pgBoolean("is_featured").default(false).notNull(),
  isBanner: pgBoolean("is_banner").default(false).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  status: ORDER_STATUS_ENUM("status").default("PENDING"),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

// Chat messages between a buyer (user) and admins/sellers
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  // Buyer the thread belongs to (one thread per user)
  userId: uuid("user_id").notNull().references(() => users.id),
  // Who sent the message
  sender: MESSAGE_SENDER_ENUM("sender").notNull(),
  // Message body
  content: text("content").notNull(),
  // Simple read flags (optional usage)
  readByAdmin: pgBoolean("read_by_admin").notNull().default(false),
  readByUser: pgBoolean("read_by_user").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type Product = InferSelectModel<typeof products>;
export type Order = InferSelectModel<typeof orders>;
export type ChatMessage = InferSelectModel<typeof chatMessages>;
