import { Response } from "express";
import { db } from "../db";
import * as schema from "@shared/schema";
import { api } from "@shared/routes";
import { AuthRequest } from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";

// List all listings with filters
export async function list(req: AuthRequest, res: Response) {
  try {
    const filters = api.listings.list.input.parse(req.query);
    
    const query = db.select({
      id: schema.listings.id,
      title: schema.listings.title,
      description: schema.listings.description,
      price: schema.listings.price,
      location: schema.listings.location,
      contactInfo: schema.listings.contactInfo,
      images: schema.listings.images,
      userId: schema.listings.userId,
      categoryId: schema.listings.categoryId,
      createdAt: schema.listings.createdAt,
      user: {
        id: schema.users.id,
        name: schema.users.name
      }
    })
    .from(schema.listings)
    .leftJoin(schema.users, eq(schema.listings.userId, schema.users.id))
    .orderBy(desc(schema.listings.createdAt));

    const conditions = [];
    if (filters.categoryId) {
      conditions.push(eq(schema.listings.categoryId, filters.categoryId));
    }
    if (filters.userId) {
      conditions.push(eq(schema.listings.userId, filters.userId));
    }
    if(conditions.length > 0) {
      query.where(and(...conditions));
    }

    const result = await query;
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
}

// Get a single listing by ID
export async function get(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const listing = await db.query.listings.findFirst({
    where: eq(schema.listings.id, id),
    with: { user: { columns: { name: true, id: true } } },
  });
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
}

// Create a new listing
export async function create(req: AuthRequest, res: Response) {
  try {
    const input = api.listings.create.input.parse(req.body);
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const newListing = await db.insert(schema.listings).values({ ...input, userId: req.userId }).returning();
    res.status(201).json(newListing[0]);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid input" });
  }
}

// Update a listing
export async function update(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const input = schema.insertListingSchema.partial().parse(req.body);
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const [updatedListing] = await db.update(schema.listings)
      .set(input)
      .where(and(eq(schema.listings.id, id), eq(schema.listings.userId, req.userId)))
      .returning();

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found or you don't have permission to update it" });
    }
    res.json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}

// Delete a listing
export async function deleteListing(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const [deletedListing] = await db.delete(schema.listings)
      .where(and(eq(schema.listings.id, id), eq(schema.listings.userId, req.userId)))
      .returning();

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found or you don't have permission to delete it" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
}

export { deleteListing as delete };
