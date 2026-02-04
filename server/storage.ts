import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { listings, NewListing } from "../shared/schema.js";
import { users } from "../shared/schema.js";
import config from "./config.js";
import { db } from "./db.js";
import { eq } from 'drizzle-orm';

const s3 = new S3Client({
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
    },
});

export async function getListings() {
    return db.select().from(listings);
}

export async function getListing(id: number) {
    return db.query.listings.findFirst({ where: eq(listings.id, id) });
}

export async function createListing(listing: NewListing) {
    const result = await db.insert(listings).values(listing).returning();
    return result[0];
}
