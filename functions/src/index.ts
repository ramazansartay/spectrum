
import * as functions from "firebase-functions";
import express from "express";
import {storage} from "./storage";
import {api} from "@shared/routes";
import {z} from "zod";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get(api.listings.list.path, async (req, res) => {
  const filters = {
    search: req.query.search as string,
    category: req.query.category as string,
    city: req.query.city as string,
    sort: req.query.sort as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
  };
  try {
    const listings = await storage.getListings(filters);
    return res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res.status(500).json({message: "Failed to fetch listings"});
  }
});

app.get(api.listings.get.path, async (req, res) => {
  try {
    const listing = await storage.getListing(Number(req.params.id));
    if (!listing) {
      return res.status(404).json({message: "Listing not found"});
    }
    return res.json(listing);
  } catch (error) {
    console.error(`Error fetching listing ${req.params.id}:`, error);
    return res.status(500).json({message: "Failed to fetch listing"});
  }
});

app.post(api.listings.create.path, async (req, res) => {
  const userId = "1"; // Placeholder user ID

  try {
    const input = api.listings.create.input.parse(req.body);
    const listing = await storage.createListing({
      ...input,
      userId: userId,
    });
    return res.status(201).json(listing);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({message: e.errors[0].message});
    }
    console.error("Error creating listing:", e);
    return res.status(400).json({message: "Validation error"});
  }
});

app.get(api.users.me.path, async (req, res) => {
  return res.json(null);
});

app.put(api.users.update.path, async (req, res) => {
  try {
    const input = api.users.update.input.parse(req.body);
    return res.json(input);
  } catch (e) {
    console.error("Error updating user:", e);
    return res.status(400).json({message: "Update failed"});
  }
});

export const apiHandler = functions.https.onRequest(app);
