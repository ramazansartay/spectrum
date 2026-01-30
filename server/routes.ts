import type { Express } from "express";
import { Server } from "http";
import { api } from "@shared/routes";
import { authMiddleware } from "./middleware/auth.js";
import { upload } from "./storage.js";

import * as auth from "./controllers/auth.js";
import * as listings from "./controllers/listings.js";
import * as categories from "./controllers/categories.js";
import * as users from "./controllers/users.js";
import * as chats from "./controllers/chats.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth
  app.post(api.auth.register.path, auth.register);
  app.post(api.auth.login.path, auth.login);

  // Listings
  app.get(api.listings.list.path, listings.list);
  app.get(api.listings.get.path, listings.get);
  app.post(api.listings.create.path, authMiddleware, upload.array('images', 5), listings.create);
  app.put(api.listings.update.path, authMiddleware, listings.update);
  // app.delete(api.listings.delete.path, authMiddleware, listings.del);

  // Categories
  app.get(api.categories.list.path, categories.list);

  // Users
  app.get(api.users.me.path, authMiddleware, users.me);
  app.get(api.users.get.path, users.get);
  app.put(api.users.update.path, authMiddleware, users.update);

  // Chats
  app.get(api.chats.list.path, authMiddleware, chats.list);
  app.post(api.chats.create.path, authMiddleware, chats.create);
  app.get(api.chats.get.path, authMiddleware, chats.get);
  app.get(api.chats.messages.path, authMiddleware, chats.getMessages);
  app.post(api.chats.sendMessage.path, authMiddleware, chats.sendMessage);

  return httpServer;
}
