import { Response } from "express";
import { db } from "../db.js";
import * as schema from "@shared/schema.js";
import { api } from "@shared/routes.js";
import { AuthRequest } from "../middleware/auth.js";
import { eq, and, desc, like, gte, lte } from "drizzle-orm";

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
    if (filters.category) {
      conditions.push(eq(schema.categories.name, filters.category));
    }
    if (filters.location) {
      conditions.push(like(schema.listings.location, `%${filters.location}%`));
    }
    if (filters.search) {
        conditions.push(like(schema.listings.title, `%${filters.search}%`));
    }
    if (filters.minPrice) {
        conditions.push(gte(schema.listings.price, filters.minPrice.toString()));
    }
    if (filters.maxPrice) {
        conditions.push(lte(schema.listings.price, filters.maxPrice.toString()));
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

    const [newListing] = await db.insert(schema.listings).values({ 
      ...input,
      userId: req.userId,
      images: imagePaths,
      isNegotiable: input.isNegotiable || false
    }).returning();

    res.status(201).json(newListing);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid input" });
  }
}

export async function update(req: AuthRequest, res: Response) {
    // Implementation for update
}

export async function del(req: AuthRequest, res: Response) {
    // Implementation for delete
}
