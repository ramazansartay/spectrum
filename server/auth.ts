import { Router } from "express";

// This is a mock implementation of authentication.
// In a real application, you would use a library like Passport.js
// with a proper strategy (e.g., Google, email/password).

export const authRouter = Router();

const MOCK_USER = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  avatarUrl: "https://avatar.vercel.sh/test-user",
  password: "password123" // In a real app, this would be a hashed password
};

// /api/login handles user authentication via POST
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  // In a real app, you would look up the user in a database
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    (req as any).session.user = {
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      avatarUrl: MOCK_USER.avatarUrl
    };
    res.json((req as any).session.user);
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// /api/logout clears the session.
authRouter.get("/logout", (req, res, next) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
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
