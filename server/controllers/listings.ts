import { Response } from "express";
import { db } from "../db";
import * as schema from "@shared/schema";
import { api } from "@shared/routes";
import { AuthRequest } from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";


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
      images: schema.listings.images,
      isNegotiable: schema.listings.isNegotiable,
      userId: schema.listings.userId,
      categoryId: schema.listings.categoryId,
      createdAt: schema.listings.createdAt,
      user: {
        id: schema.users.id,
        name: schema.users.name
      },
      category: {
        id: schema.categories.id,
        name: schema.categories.name
      }
    })
    .from(schema.listings)
    .leftJoin(schema.users, eq(schema.listings.userId, schema.users.id))
    .leftJoin(schema.categories, eq(schema.listings.categoryId, schema.categories.id))
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
    with: { 
      user: { columns: { name: true, id: true } },
      category: { columns: { name: true } }
    },
  });

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // Make sure image URLs are absolute
  const listingWithAbsoluteImageUrls = {
    ...listing,
    images: listing.images?.map(p => p.startsWith('http') ? p : `/static/uploads/${p}`)
  }

  res.json(listingWithAbsoluteImageUrls);
}

// Create a new listing
export async function create(req: AuthRequest, res: Response) {
  try {
    const input = api.listings.create.input.parse(req.body);
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.filename);

    const newListing = await db.insert(schema.listings).values({ 
      ...input,
      userId: req.userId,
      images: imagePaths,
      isNegotiable: Boolean(input.isNegotiable)
    }).returning();

    res.status(201).json(newListing[0]);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid input" });
  }
}

// ... (update and delete functions remain the same) ...
