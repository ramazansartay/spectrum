
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
    try {
      // Validate the query parameters
      const filters = api.listings.list.input.parse(req.query);
      
      const listings = await storage.getListings({
        ...filters,
        // Ensure `sort` is a single string and has a default value
        sort: filters.sort || 'recent', 
      });

      res.json(listings);
    } catch (e) {
      if (e instanceof z.ZodError) {
        // If validation fails, return a 400 Bad Request
        return res.status(400).json({ message: e.errors[0].message });
      }
      // For any other unexpected errors, return a 500 Internal Server Error
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
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
