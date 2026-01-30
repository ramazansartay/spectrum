import { Router } from "express";
import { api } from "../shared/routes.js";
import { authMiddleware } from "./middleware/auth.js";
import { upload } from "./storage.js";

import * as auth from "./controllers/auth.js";
import * as listings from "./controllers/listings.js";
import * as categories from "./controllers/categories.js";
import * as users from "./controllers/users.js";
import * as chats from "./controllers/chats.js";

export const router = Router();

// Auth
router.post(api.auth.register.path, auth.register);
router.post(api.auth.login.path, auth.login);

// Listings
router.get(api.listings.list.path, listings.list);
router.get(api.listings.get.path, listings.get);
router.post(api.listings.create.path, authMiddleware, upload.array('images', 5), listings.create);
router.put(api.listings.update.path, authMiddleware, listings.update);
// router.delete(api.listings.delete.path, authMiddleware, listings.del);

// Categories
router.get(api.categories.list.path, categories.list);

// Users
router.get(api.users.me.path, authMiddleware, users.me);
router.get(api.users.get.path, users.get);
router.put(api.users.update.path, authMiddleware, users.update);
	
// Chats
router.get(api.chats.list.path, authMiddleware, chats.list);
router.post(api.chats.create.path, authMiddleware, chats.create);
router.get(api.chats.get.path, authMiddleware, chats.get);
router.get(api.chats.messages.path, authMiddleware, chats.getMessages);
router.post(api.chats.sendMessage.path, authMiddleware, chats.sendMessage);
