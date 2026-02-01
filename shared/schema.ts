import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  contactInfo: text("contact_info"),
  images: text("images").array(),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertListingSchema = createInsertSchema(listings).omit({ 
  id: true, 
  createdAt: true,
  userId: true 
});

export const insertUserSchema = createInsertSchema(users);

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export { users };
export type { User } from "./models/auth";
