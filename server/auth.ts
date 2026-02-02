import { Router } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage.js";

export const authRouter = Router();

// /api/signup handles user registration via POST
authRouter.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, password and name are required" });
  }

  try {
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({ email, name, hashedPassword });

    (req as any).session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };

    res.status(201).json((req as any).session.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// /api/login handles user authentication via POST
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await storage.getUserByEmail(email);
    if (!user || !user.hashedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    (req as any).session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };

    res.json((req as any).session.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// /api/logout clears the session.
authRouter.get("/logout", (req, res, next) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out" });
  });
});

// /api/users/me returns the current user from the session.
authRouter.get("/users/me", (req, res) => {
  const user = (req as any).session.user;
  if (!user) {
    return res.status(404).json({ message: "User not found" }); // No user is logged in, send 404
  }
  res.json(user);
});
