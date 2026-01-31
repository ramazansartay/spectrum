import { z } from "zod";
import { listings, users } from "./schema";
import { createInsertSchema } from "drizzle-zod";


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