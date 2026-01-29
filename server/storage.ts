import { db } from "./db";
import { 
  users, listings, 
  type User, type InsertUser, 
  type Listing, type InsertListing 
} from "@shared/schema";
import { eq, desc, ilike, or, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  getListings(filters?: {
    search?: string;
    category?: string;
    city?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing & { userId: string }): Promise<Listing>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: string, update: Partial<InsertUser>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(update)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getListings(filters?: {
    search?: string;
    category?: string;
    city?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Listing[]> {
    let conditions = [];
    
    if (filters?.search) {
      conditions.push(or(
        ilike(listings.title, `%${filters.search}%`),
        ilike(listings.description, `%${filters.search}%`)
      ));
    }
    
    if (filters?.category) {
      conditions.push(eq(listings.category, filters.category));
    }
    
    if (filters?.city) {
      conditions.push(ilike(listings.location, `%${filters.city}%`));
    }
    
    // Price filters (simplified, prices are stored as text but we try to match)
    // In production, prices should be stored as integers/decimals
    
    let query = db.select().from(listings).where(and(...conditions));
    
    if (filters?.sort === 'price-asc') {
      return await query.orderBy(listings.price); // Simplified sort
    } else if (filters?.sort === 'price-desc') {
      return await query.orderBy(desc(listings.price));
    }
    
    return await query.orderBy(desc(listings.createdAt));
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(insertListing: InsertListing & { userId: string }): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }
}

export const storage = new DatabaseStorage();
