import { pgTable, varchar, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  hashed_password: text('hashed_password'),
  avatar_url: text('avatar_url'),
  github_id: text("github_id").unique(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'date' }).notNull(),
});

export const listings = pgTable('listings', {
  id: integer('id').primaryKey(),
  seller_id: text('seller_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: varchar('price', { length: 256 }).notNull(),
  category: varchar('category', { length: 256 }).notNull(),
  location: varchar('location', { length: 256 }).notNull(),
  contact_info: text('contact_info'),
  images: text('images').array(),
});

export const selectListingsSchema = createSelectSchema(listings);
export const insertListingSchema = createInsertSchema(listings);
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
