import { pgTable, varchar, serial, text, pgEnum, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  hashedPassword: text('hashed_password'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  sellerId: varchar('seller_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: varchar('price', { length: 256 }).notNull(),
  category: varchar('category', { length: 256 }).notNull(),
  location: varchar('location', { length: 256 }).notNull(),
  contactInfo: text('contact_info'),
  images: jsonb('images'),
});

export const selectListingsSchema = createSelectSchema(listings);
export const insertListingSchema = createInsertSchema(listings);
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

export type Listing = z.infer<typeof selectListingsSchema>;
export type NewListing = z.infer<typeof insertListingSchema>;
