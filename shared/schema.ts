import { pgTable, varchar, text, timestamp, index, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Lucia ожидает text для id
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  hashedPassword: text('hashed_password'),
  avatarUrl: text('avatar_url'),
  githubId: text("github_id").unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
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
  sellerId: text('seller_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: varchar('price', { length: 256 }).notNull(),
  category: varchar('category', { length: 256 }).notNull(),
  location: varchar('location', { length: 256 }).notNull(),
  contactInfo: text('contact_info'),
  images: text('images').array(),
});

export const selectListingsSchema = createSelectSchema(listings);
export const insertListingSchema = createInsertSchema(listings);
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
