import { Response } from "express";
import { db } from "../db";
import { chats, messages } from "@shared/schema";
import { AuthRequest } from "../middleware/auth";
import { eq, and, or } from "drizzle-orm";
import { api } from "@shared/routes";

// List all chats for the current user
export async function list(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const userChats = await db.query.chats.findMany({
    where: or(eq(chats.buyerId, req.userId), eq(chats.sellerId, req.userId)),
    with: { listing: true, buyer: true, seller: true },
  });
  res.json(userChats);
}

// Create a new chat
export async function create(req: AuthRequest, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const { listingId } = api.chats.create.input.parse(req.body);

    const listing = await db.query.listings.findFirst({ where: eq(listings.id, listingId) });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Check if a chat already exists
    let chat = await db.query.chats.findFirst({
        where: and(eq(chats.listingId, listingId), eq(chats.buyerId, req.userId))
    });

    if (!chat) {
        [chat] = await db.insert(chats).values({
            listingId,
            buyerId: req.userId,
            sellerId: listing.userId,
        }).returning();
    }

    res.status(201).json(chat);
}

// Get a single chat by ID
export async function get(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  const id = Number(req.params.id);

  const chat = await db.query.chats.findFirst({
    where: and(
        eq(chats.id, id),
        or(eq(chats.buyerId, req.userId), eq(chats.sellerId, req.userId))
    ),
    with: { listing: true, buyer: true, seller: true },
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  res.json(chat);
}

// Get messages for a chat
export async function messages(req: AuthRequest, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const chatId = Number(req.params.id);

    // First, verify user has access to this chat
    const chat = await db.query.chats.findFirst({
        where: and(
            eq(chats.id, chatId),
            or(eq(chats.buyerId, req.userId), eq(chats.sellerId, req.userId))
        )
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found or you don't have access" });
    }

    const messageList = await db.query.messages.findMany({
        where: eq(messages.chatId, chatId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });
    res.json(messageList);
}

// Send a message in a chat
export async function sendMessage(req: AuthRequest, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const chatId = Number(req.params.id);
    const { content } = api.chats.sendMessage.input.parse(req.body);

     // Verify user has access to this chat
    const chat = await db.query.chats.findFirst({
        where: and(
            eq(chats.id, chatId),
            or(eq(chats.buyerId, req.userId), eq(chats.sellerId, req.userId))
        )
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found or you don't have access" });
    }

    const [newMessage] = await db.insert(messages).values({
        chatId,
        senderId: req.userId,
        content,
    }).returning();

    // Here you would typically broadcast the message via WebSockets

    res.status(201).json(newMessage);
}
