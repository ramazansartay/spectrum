import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Listings Table
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  location: text("location").notNull(),
  contactInfo: text("contact_info"),
  images: text("images").array(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chats Table
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.id, { onDelete: 'cascade' }),
  buyerId: varchar("buyer_id").references(() => users.id, { onDelete: 'cascade' }),
  sellerId: varchar("seller_id").references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages Table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id, { onDelete: 'cascade' }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});


// Zod Schemas for validation
export const insertListingSchema = createInsertSchema(listings).omit({ 
  id: true, 
  createdAt: true,
  userId: true 
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
}).omit({ id: true, createdAt: true });


// Types
export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type InsertListing = z.infer<typeof insertListingSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
