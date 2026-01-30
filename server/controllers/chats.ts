import { Response } from "express";
import { db } from "../db";
import * as schema from "@shared/schema";
import { AuthRequest } from "../middleware/auth";
import { eq, and, or } from "drizzle-orm";
import { api } from "@shared/routes";

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

    // Check if a chat already exists
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

// Get messages for a chat
export async function getMessages(chatId: number) {
    // First, verify user has access to this chat
    const chat = await db.query.chats.findFirst({
        where: eq(schema.chats.id, chatId),
    });

    if (!chat) {
        throw new Error("Chat not found or you don\'t have access");
    }

    const messageList = await db.query.messages.findMany({
        where: eq(schema.messages.chatId, chatId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });
    return messageList;
}

// Send a message in a chat
export async function sendMessage(chatId: number, content: string, senderId: number) {
     // Verify user has access to this chat
    const chat = await db.query.chats.findFirst({
        where: and(
            eq(schema.chats.id, chatId),
            or(eq(schema.chats.buyerId, senderId), eq(schema.chats.sellerId, senderId))
        )
    });

    if (!chat) {
        throw new Error("Chat not found or you don\'t have access");
    }

    const newMessage = await db.insert(schema.messages).values({
        chatId,
        senderId: senderId,
        content,
    }).returning();

    return newMessage[0];
}
