import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.listings.list.path, async (req, res) => {
    const filters = {
      search: req.query.search as string,
      category: req.query.category as string,
      city: req.query.city as string,
      sort: req.query.sort as string,
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

  app.post(api.listings.create.path, async (req, res) => {
    const userId = "mock-user-id";
    
    try {
      const input = api.listings.create.input.parse(req.body);
      const listing = await storage.createListing({
        ...input,
        userId: userId
      });
      res.status(201).json(listing);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.get(api.users.me.path, async (req, res) => {
    const dbUser = await storage.getUser("mock-user-id");
    res.json(dbUser || null);
  });

  app.put(api.users.update.path, async (req, res) => {
    try {
      const input = api.users.update.input.parse(req.body);
      const updated = await storage.updateUser("mock-user-id", input);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  return httpServer;
}
