import { Response } from "express";
import { db } from "../db";
import { listings } from "@shared/schema";
import { api } from "@shared/routes";
import { AuthRequest } from "../middleware/auth";
import { eq, and } from "drizzle-orm";

// List all listings with filters
export async function list(req: AuthRequest, res: Response) {
  try {
    const filters = api.listings.list.input.parse(req.query);
    const query = db.select().from(listings);
    // Add filtering logic here based on 'filters'
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
    where: eq(listings.id, id),
    with: { user: { columns: { name: true, email: true } } },
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

    const newListing = await db.insert(listings).values({ ...input, userId: req.userId }).returning();
    res.status(201).json(newListing[0]);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}

// Update a listing
export async function update(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const input = req.body; // Add validation later
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const [updatedListing] = await db.update(listings)
      .set(input)
      .where(and(eq(listings.id, id), eq(listings.userId, req.userId)))
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
export async function deleteFn(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const [deletedListing] = await db.delete(listings)
      .where(and(eq(listings.id, id), eq(listings.userId, req.userId)))
      .returning();

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found or you don't have permission to delete it" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
}

export { deleteFn as delete };
