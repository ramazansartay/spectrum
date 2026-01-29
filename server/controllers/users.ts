import { Response } from "express";
import { db } from "../db";
import * as schema from "@shared/schema";
import { AuthRequest } from "../middleware/auth";
import { eq } from "drizzle-orm";
import { api } from "@shared/routes";

// Get current user's profile
export async function me(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, req.userId),
    columns: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}

// Get a user's public profile by ID
export async function get(req: AuthRequest, res: Response) {
  const id = req.params.id;
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
    columns: { id: true, name: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}

// Update current user's profile
export async function update(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const input = api.users.update.input.parse(req.body);

    const [updatedUser] = await db.update(schema.users)
      .set(input)
      .where(eq(schema.users.id, req.userId))
      .returning({ id: true, name: true, email: true });
      
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}
