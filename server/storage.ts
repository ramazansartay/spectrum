import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { Listing } from './schema';
import config from './config';

const client = postgres(config.databaseUrl, { ssl: 'require' });
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
