import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';
import { Listing } from './schema.js';
import config from './config.js';

const client = postgres(config.database.url, { ssl: 'require' });
const db = drizzle(client, { schema });

export class DatabaseStorage {
  async getListings() {
    return db.query.listings.findMany({
      with: {
        seller: true,
      },
    });
  }

  async getListing(id: number) {
    return db.query.listings.findFirst({
      where: (listings, { eq }) => eq(listings.id, id),
      with: {
        seller: true,
      },
    });
  }

  async createListing(listing: Listing) {
    const result = await db.insert(schema.listings).values(listing).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
