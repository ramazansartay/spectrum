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
};

// When the client navigates to /api/login, we "log them in"
// by setting a user object on the session and redirecting.
authRouter.get("/login", (req, res) => {
  // In a real Passport.js flow, this would be done by passport.authenticate()
  (req as any).session.user = MOCK_USER;
  res.redirect("/");
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
    return res.json(null); // No user is logged in
  }
  res.json(user);
});
