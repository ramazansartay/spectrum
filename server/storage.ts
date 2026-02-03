
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  listings as listingsSchema,
  insertListingSchema,
} from '../shared/models/listings';
import { users as usersSchema, UpsertUser } from '../shared/models/auth';
import { eq } from 'drizzle-orm';
import config from './config';

const pool = new Pool({
    connectionString: config.database.url,
    ssl: {
        rejectUnauthorized: false,
    },
});

const db = drizzle(pool);

export class DatabaseStorage {
  async getUserByEmail(email: string): Promise<UpsertUser | undefined> {
    return await db.query.usersSchema.findFirst({
      where: eq(usersSchema.email, email),
    });
  }

  async getUserById(id: string): Promise<any> {
    return await db.query.usersSchema.findFirst({
      where: eq(usersSchema.id, id),
    });
  }

  async getListings(search?: string): Promise<any[]> {
    if (search) {
      return await db
        .select()
        .from(listingsSchema)
        .where(eq(listingsSchema.title, search));
    }
    return await db.select().from(listingsSchema);
  }

  async createListing(listing: any): Promise<any> {
    const newListing = insertListingSchema.parse(listing);
    return await db.insert(listingsSchema).values(newListing).returning();
  }

  async createUser(user: UpsertUser): Promise<any> {
    return await db.insert(usersSchema).values(user).returning();
  }
}
