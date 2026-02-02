import {db} from "./db";
import {
  users, listings,
  type User, type InsertUser,
  type Listing, type InsertListing,
} from "@shared/schema.js";
import {eq, desc, ilike, or, and} from "drizzle-orm";

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

/**
 * Implements the IStorage interface using a Drizzle ORM database connection.
 */
export class DatabaseStorage implements IStorage {
  /**
   * Retrieves a user by their ID.
   * @param {string} id The user's ID.
   * @return {Promise<User | undefined>} The user object or undefined.
   */
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Updates a user's information.
   * @param {string} id The user's ID.
   * @param {Partial<InsertUser>} update The user data to update.
   * @return {Promise<User>} The updated user object.
   */
  async updateUser(id: string, update: Partial<InsertUser>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(update)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  /**
   * Retrieves a list of listings based on optional filters.
   * @param {object} filters Optional filters for listings.
   * @return {Promise<Listing[]>} A list of listings.
   */
  async getListings(filters?: {
    search?: string;
    category?: string;
    city?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Listing[]> {
    const conditions = [];

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

    const query = db.select().from(listings).where(and(...conditions));

    if (filters?.sort === "price-asc") {
      return await query.orderBy(listings.price);
    } else if (filters?.sort === "price-desc") {
      return await query.orderBy(desc(listings.price));
    }

    return await query.orderBy(desc(listings.createdAt));
  }

  /**
   * Retrieves a single listing by its ID.
   * @param {number} id The listing's ID.
   * @return {Promise<Listing | undefined>} The listing or undefined.
   */
  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select()
      .from(listings).where(eq(listings.id, id));
    return listing;
  }

  /**
   * Creates a new listing.
   * @param {object} insertListing The listing data, including userId.
   * @return {Promise<Listing>} The newly created listing.
   */
  async createListing(
    insertListing: InsertListing & { userId: string }
  ): Promise<Listing> {
    const [listing] = await db.insert(listings)
      .values(insertListing).returning();
    return listing;
  }
}

export const storage = new DatabaseStorage();
