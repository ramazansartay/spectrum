import { Response } from "express";
import { db } from "../db.js";
import * as schema from "@shared/schema.js";
import { AuthRequest } from "../middleware/auth.js";
import { eq, and, or } from "drizzle-orm";
import { api } from "@shared/routes.js";

// Internal function to send a message
export async function _sendMessage(chatId: number, content: string, senderId: string) {
    const chat = await db.query.chats.findFirst({
        where: and(
            eq(schema.chats.id, chatId),
            or(eq(schema.chats.buyerId, senderId), eq(schema.chats.sellerId, senderId))
        )
    });

    if (!chat) {
        throw new Error("Chat not found or you don't have access");
    }

    const newMessage = await db.insert(schema.messages).values({
        chatId,
        senderId,
        content,
    }).returning();

    return newMessage[0];
}

// Internal function to get messages for a chat
export async function _getMessages(chatId: number, userId: string) {
    const chat = await db.query.chats.findFirst({
        where: and(
            eq(schema.chats.id, chatId),
            or(eq(schema.chats.buyerId, userId), eq(schema.chats.sellerId, userId))
        )
    });

    if (!chat) {
        throw new Error("Chat not found or you don't have access");
    }

    return db.query.messages.findMany({
        where: eq(schema.messages.chatId, chatId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });
}


// Express handler to send a message
export async function sendMessage(req: AuthRequest, res: Response) {
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


// Express handler to get messages for a chat
export async function getMessages(req: AuthRequest, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    try {
        const chatId = Number(req.params.id);
        const messages = await _getMessages(chatId, req.userId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}

// List all chats for the current user
export async function list(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const userChats = await db.query.chats.findMany({
    where: or(eq(schema.chats.buyerId, req.userId), eq(schema.chats.sellerId, req.userId)),
    with: { listing: true, buyer: true, seller: true },
  });
  res.json(userChats);
}

// Create a new chat
export async function create(req: AuthRequest, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const { listingId } = api.chats.create.input.parse(req.body);

    const listing = await db.query.listings.findFirst({ where: eq(schema.listings.id, listingId) });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.userId === req.userId) {
        return res.status(400).json({ message: "You cannot start a chat with yourself." });
    }
    
    let chat = await db.query.chats.findFirst({
        where: and(eq(schema.chats.listingId, listingId), eq(schema.chats.buyerId, req.userId))
    });

    if (!chat) {
        const newChat = await db.insert(schema.chats).values({
            listingId,
            buyerId: req.userId,
            sellerId: listing.userId,
        }).returning();
        chat = newChat[0];
    }

    res.status(201).json(chat);
}

// Get a single chat by ID
export async function get(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  const id = Number(req.params.id);

  const chat = await db.query.chats.findFirst({
    where: and(
        eq(schema.chats.id, id),
        or(eq(schema.chats.buyerId, req.userId), eq(schema.chats.sellerId, req.userId))
    ),
    with: { listing: true, buyer: true, seller: true },
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  res.json(chat);
}
