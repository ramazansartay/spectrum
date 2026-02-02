
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";

// A middleware to check if the user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
  if ((req.session as any).user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.listings.list.path, async (req, res) => {
    // Ensure `sort` is a single string, not an array
    const sortQuery = Array.isArray(req.query.sort) ? req.query.sort[0] : req.query.sort;

    const filters = {
      search: req.query.search as string,
      category: req.query.category as string,
      city: req.query.city as string,
      sort: sortQuery as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };
    const listings = await storage.getListings(filters);
    res.json(listings);
  });

  app.get(api.listings.get.path, async (req, res) => {
    const listing = await storage.getListing(Number(req.params.id));
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  });

  // This route is now protected.
  app.post(api.listings.create.path, isAuthenticated, async (req, res) => {
    const user = (req.session as any).user;
    
    try {
      const input = api.listings.create.input.parse(req.body);
      const listing = await storage.createListing({
        ...input,
        userId: user.id // Use the authenticated user's ID
      });
      res.status(201).json(listing);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(400).json({ message: "Validation error" });
    }
  });

  // The /api/users/me route is now handled in auth.ts

  app.put(api.users.update.path, isAuthenticated, async (req, res) => {
    const user = (req.session as any).user;
    try {
      const input = api.users.update.input.parse(req.body);
      // In a real app, you would update the user in the database.
      // For now, we just return the input.
      res.json({ ...user, ...input });
    } catch (e) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  return httpServer;
}
