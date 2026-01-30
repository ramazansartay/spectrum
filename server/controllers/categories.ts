import { Response } from "express";
import { db } from "../db.js";
import { AuthRequest } from "../middleware/auth.js";

// List all categories
export async function list(req: AuthRequest, res: Response) {
  const result = await db.query.categories.findMany();
  res.json(result);
}
