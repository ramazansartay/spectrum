import express, { Router } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createServer$1 } from "http";
import morgan from "morgan";
import { z } from "zod";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { pgTable, timestamp, text, varchar, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { eq, desc, like, gte, lte, and, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { Server } from "socket.io";
import { defineConfig, createLogger, createServer } from "vite";
import react from "@vitejs/plugin-react";
import { nanoid } from "nanoid";
const listings$1 = {
  list: {
    path: "/api/listings",
    input: z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
      sort: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional()
    })
  },
  get: {
    path: "/api/listings/:id"
  },
  create: {
    path: "/api/listings",
    input: z.object({
      title: z.string(),
      description: z.string(),
      price: z.string(),
      location: z.string(),
      categoryId: z.number(),
      images: z.array(z.string()),
      isNegotiable: z.boolean().optional()
    })
  },
  update: {
    path: "/api/listings/:id"
  },
  delete: {
    path: "/api/listings/:id"
  }
};
const categories$1 = {
  list: {
    path: "/api/categories"
  }
};
const auth = {
  register: {
    path: "/api/auth/register",
    input: z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string()
    })
  },
  login: {
    path: "/api/auth/login",
    input: z.object({
      email: z.string().email(),
      password: z.string()
    })
  }
};
const users$1 = {
  me: {
    path: "/api/users/me"
  },
  get: {
    path: "/api/users/:id"
  },
  update: {
    path: "/api/users/me",
    input: z.object({
      name: z.string().optional(),
      email: z.string().email().optional()
    })
  }
};
const chats$1 = {
  list: {
    path: "/api/chats"
  },
  create: {
    path: "/api/chats",
    input: z.object({
      listingId: z.number()
    })
  },
  get: {
    path: "/api/chats/:id"
  },
  messages: {
    path: "/api/chats/:id/messages"
  },
  sendMessage: {
    path: "/api/chats/:id/messages",
    input: z.object({
      content: z.string()
    })
  }
};
const api = {
  listings: listings$1,
  categories: categories$1,
  auth,
  users: users$1,
  chats: chats$1
};
const JWT_SECRET$1 = process.env.JWT_SECRET || "your-super-secret-key";
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET$1);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
const __filename$3 = fileURLToPath(import.meta.url);
const __dirname$3 = path.dirname(__filename$3);
const uploadDir = path.join(__dirname$3, "..", "static", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
const users = pgTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique()
});
const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  location: text("location").notNull(),
  contactInfo: text("contact_info"),
  images: text("images").array(),
  isNegotiable: boolean("is_negotiable").default(false),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow()
});
const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.id, { onDelete: "cascade" }),
  buyerId: varchar("buyer_id").references(() => users.id, { onDelete: "cascade" }),
  sellerId: varchar("seller_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow()
});
const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false)
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories,
  chats,
  listings,
  messages,
  users
}, Symbol.toStringTag, { value: "Module" }));
const { Pool } = pg;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";
async function register(req, res) {
  try {
    const { email, password, name } = api.auth.register.input.parse(req.body);
    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = createId();
    await db.insert(users).values({
      id: userId,
      email,
      passwordHash,
      name
    });
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = api.auth.login.input.parse(req.body);
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.passwordHash) {
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
async function list$2(req, res) {
  try {
    const filters = api.listings.list.input.parse(req.query);
    const query = db.select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      price: listings.price,
      location: listings.location,
      images: listings.images,
      isNegotiable: listings.isNegotiable,
      createdAt: listings.createdAt,
      user: {
        id: users.id,
        name: users.name
      },
      category: {
        id: categories.id,
        name: categories.name
      }
    }).from(listings).leftJoin(users, eq(listings.userId, users.id)).leftJoin(categories, eq(listings.categoryId, categories.id)).orderBy(desc(listings.createdAt));
    const conditions = [];
    if (filters.category) {
      conditions.push(eq(categories.name, filters.category));
    }
    if (filters.location) {
      conditions.push(like(listings.location, `%${filters.location}%`));
    }
    if (filters.search) {
      conditions.push(like(listings.title, `%${filters.search}%`));
    }
    if (filters.minPrice) {
      conditions.push(gte(listings.price, filters.minPrice.toString()));
    }
    if (filters.maxPrice) {
      conditions.push(lte(listings.price, filters.maxPrice.toString()));
    }
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
    const result = await query;
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
}
async function get$2(req, res) {
  var _a;
  const id = Number(req.params.id);
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, id),
    with: {
      user: { columns: { name: true, id: true } },
      category: { columns: { name: true } }
    }
  });
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  const listingWithAbsoluteImageUrls = {
    ...listing,
    images: (_a = listing.images) == null ? void 0 : _a.map((p) => p.startsWith("http") ? p : `/static/uploads/${p}`)
  };
  res.json(listingWithAbsoluteImageUrls);
}
async function create$1(req, res) {
  try {
    const input = api.listings.create.input.parse(req.body);
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const imagePaths = req.files.map((file) => file.filename);
    const [newListing] = await db.insert(listings).values({
      ...input,
      userId: req.userId,
      images: imagePaths,
      isNegotiable: input.isNegotiable || false
    }).returning();
    res.status(201).json(newListing);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid input" });
  }
}
async function update$1(req, res) {
}
async function list$1(req, res) {
  const result = await db.query.categories.findMany();
  res.json(result);
}
async function me(req, res) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await db.query.users.findFirst({
    where: eq(users.id, req.userId),
    columns: { id: true, name: true, email: true, createdAt: true }
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}
async function get$1(req, res) {
  const id = req.params.id;
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { id: true, name: true, createdAt: true }
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}
async function update(req, res) {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const input = api.users.update.input.parse(req.body);
    const updatedResult = await db.update(users).set(input).where(eq(users.id, req.userId)).returning({ id: users.id, name: users.name, email: users.email });
    if (updatedResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedResult[0]);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
}
async function _sendMessage(chatId, content, senderId) {
  const chat = await db.query.chats.findFirst({
    where: and(
      eq(chats.id, chatId),
      or(eq(chats.buyerId, senderId), eq(chats.sellerId, senderId))
    )
  });
  if (!chat) {
    throw new Error("Chat not found or you don't have access");
  }
  const newMessage = await db.insert(messages).values({
    chatId,
    senderId,
    content
  }).returning();
  return newMessage[0];
}
async function _getMessages(chatId, userId) {
  const chat = await db.query.chats.findFirst({
    where: and(
      eq(chats.id, chatId),
      or(eq(chats.buyerId, userId), eq(chats.sellerId, userId))
    )
  });
  if (!chat) {
    throw new Error("Chat not found or you don't have access");
  }
  return db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    orderBy: (messages2, { asc }) => [asc(messages2.createdAt)]
  });
}
async function sendMessage(req, res) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const chatId = Number(req.params.id);
    const { content } = api.chats.sendMessage.input.parse(req.body);
    const newMessage = await _sendMessage(chatId, content, req.userId);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
}
async function getMessages(req, res) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const chatId = Number(req.params.id);
    const messages2 = await _getMessages(chatId, req.userId);
    res.json(messages2);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}
async function list(req, res) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  const userChats = await db.query.chats.findMany({
    where: or(eq(chats.buyerId, req.userId), eq(chats.sellerId, req.userId)),
    with: { listing: true, buyer: true, seller: true }
  });
  res.json(userChats);
}
async function create(req, res) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  const { listingId } = api.chats.create.input.parse(req.body);
  const listing = await db.query.listings.findFirst({ where: eq(listings.id, listingId) });
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (listing.userId === req.userId) {
    return res.status(400).json({ message: "You cannot start a chat with yourself." });
  }
  let chat = await db.query.chats.findFirst({
    where: and(eq(chats.listingId, listingId), eq(chats.buyerId, req.userId))
  });
  if (!chat) {
    const newChat = await db.insert(chats).values({
      listingId,
      buyerId: req.userId,
      sellerId: listing.userId
    }).returning();
    chat = newChat[0];
  }
  res.status(201).json(chat);
}
async function get(req, res) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  const id = Number(req.params.id);
  const chat = await db.query.chats.findFirst({
    where: and(
      eq(chats.id, id),
      or(eq(chats.buyerId, req.userId), eq(chats.sellerId, req.userId))
    ),
    with: { listing: true, buyer: true, seller: true }
  });
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  res.json(chat);
}
const router = Router();
router.post(api.auth.register.path, register);
router.post(api.auth.login.path, login);
router.get(api.listings.list.path, list$2);
router.get(api.listings.get.path, get$2);
router.post(api.listings.create.path, authMiddleware, upload.array("images", 5), create$1);
router.put(api.listings.update.path, authMiddleware, update$1);
router.get(api.categories.list.path, list$1);
router.get(api.users.me.path, authMiddleware, me);
router.get(api.users.get.path, get$1);
router.put(api.users.update.path, authMiddleware, update);
router.get(api.chats.list.path, authMiddleware, list);
router.post(api.chats.create.path, authMiddleware, create);
router.get(api.chats.get.path, authMiddleware, get);
router.get(api.chats.messages.path, authMiddleware, getMessages);
router.post(api.chats.sendMessage.path, authMiddleware, sendMessage);
const ChatMessageSchema = z.object({
  chatId: z.number(),
  message: z.string(),
  senderId: z.string()
});
const ChatIdSchema = z.number();
function handleChat(socket, io) {
  const userId = socket.handshake.auth.userId;
  socket.on("chat:join", (chatId) => {
    try {
      const parsedChatId = ChatIdSchema.parse(chatId);
      socket.join(String(parsedChatId));
      console.log(`User ${userId} joined chat: ${parsedChatId}`);
    } catch (error) {
      console.error("Invalid chatId for chat:join:", error);
    }
  });
  socket.on("chat:leave", (chatId) => {
    try {
      const parsedChatId = ChatIdSchema.parse(chatId);
      socket.leave(String(parsedChatId));
      console.log(`User ${userId} left chat: ${parsedChatId}`);
    } catch (error) {
      console.error("Invalid chatId for chat:leave:", error);
    }
  });
  socket.on("chat:message", async (data) => {
    try {
      const { chatId, message, senderId } = ChatMessageSchema.parse(data);
      const newMessage = await _sendMessage(chatId, message, senderId);
      io.to(String(chatId)).emit("chat:message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("chat:error", { message: "Failed to send message" });
    }
  });
  socket.on("chat:history", async (chatId) => {
    try {
      const parsedChatId = ChatIdSchema.parse(chatId);
      const messages2 = await _getMessages(parsedChatId, userId);
      socket.emit("chat:history", messages2);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      socket.emit("chat:error", { message: "Failed to fetch chat history" });
    }
  });
}
function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  io.on("connection", (socket) => {
    console.log("a user connected");
    handleChat(socket, io);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  return io;
}
const __filename$2 = fileURLToPath(import.meta.url);
const __dirname$2 = path.dirname(__filename$2);
const viteConfig = defineConfig({
  plugins: [react()],
  // Project root - 'client', all paths within it
  root: "client",
  build: {
    // Output directory relative to the project root
    outDir: "../dist-client",
    // Clear the public folder before each client build
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname$2, "client", "src"),
      "@shared": path.resolve(__dirname$2, "shared"),
      "@assets": path.resolve(__dirname$2, "attached_assets"),
      // FIX: Redirect the problematic import to the correct modern JSX runtime
      "./cjs/react-jsx-runtime.production.min.js": "react/jsx-runtime",
      // FIX: Redirect react-dom to fix build errors on Render
      "./cjs/react-dom.production.min.js": "react-dom",
      // FIX: Redirect react to fix build errors on Render
      "./cjs/react.production.min.js": "react"
    }
  }
});
const viteLogger = createLogger();
async function setupVite(server2, app2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server: server2, path: "/vite-hmr" },
    allowedHosts: true
  };
  const vite = await createServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const isProduction = process.env.NODE_ENV === "production";
const app = express();
const server = createServer$1(app);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", router);
if (isProduction) {
  const clientBuildPath = path.resolve(__dirname$1, "../client");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, "index.html"));
  });
} else {
  setupVite(server, app);
}
initializeSocket(server);
const PORT = process.env.PORT || 1e4;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
