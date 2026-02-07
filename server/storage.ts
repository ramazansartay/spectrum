import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { listings, NewListing } from "../shared/schema.js";
import { users } from "../shared/schema.js";
import config from "./config.js";
import { db } from "./db.js";
import { eq } from 'drizzle-orm';

let s3: S3Client | null = null;

if (config.s3 && config.s3.region && config.s3.credentials?.accessKeyId && config.s3.credentials?.secretAccessKey) {
    s3 = new S3Client({
        region: config.s3.region,
        credentials: {
            accessKeyId: config.s3.credentials.accessKeyId,
            secretAccessKey: config.s3.credentials.secretAccessKey,
        },
    });
}

export async function getListings() {
    return db.select().from(listings);
}

export async function getListing(id: string) {
    return db.query.listings.findFirst({ where: eq(listings.id, id) });
}

export async function createListing(listing: NewListing) {
    if (!s3) {
        throw new Error("S3 client is not initialized");
    }
    const result = await db.insert(listings).values(listing).returning();
    return result[0];
}
