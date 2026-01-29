import { Request, Response } from "express";
import { db } from "../db";
import * as schema from "@shared/schema";
import { api } from "@shared/routes";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = api.auth.register.input.parse(req.body);
    const existingUser = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = createId();

    await db.insert(schema.users).values({
      id: userId,
      email,
      passwordHash,
      name,
    });

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token });

  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = api.auth.login.input.parse(req.body);
    const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });

  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}
