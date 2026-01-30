import { Server, Socket } from "socket.io";
import { _sendMessage, _getMessages } from "../controllers/chats.js";
import { z } from "zod";

const ChatMessageSchema = z.object({
  chatId: z.number(),
  message: z.string(),
  senderId: z.string(),
});

const ChatIdSchema = z.number();

export function handleChat(socket: Socket, io: Server) {
  const userId = socket.handshake.auth.userId as string; 

  socket.on("chat:join", (chatId: unknown) => {
    try {
      const parsedChatId = ChatIdSchema.parse(chatId);
      socket.join(String(parsedChatId));
      console.log(`User ${userId} joined chat: ${parsedChatId}`);
    } catch (error) {
      console.error("Invalid chatId for chat:join:", error);
    }
  });

  socket.on("chat:leave", (chatId: unknown) => {
    try {
      const parsedChatId = ChatIdSchema.parse(chatId);
      socket.leave(String(parsedChatId));
      console.log(`User ${userId} left chat: ${parsedChatId}`);
    } catch (error) {
      console.error("Invalid chatId for chat:leave:", error);
    }
  });

  socket.on("chat:message", async (data: unknown) => {
    try {
      const { chatId, message, senderId } = ChatMessageSchema.parse(data);
      const newMessage = await _sendMessage(chatId, message, senderId);
      io.to(String(chatId)).emit("chat:message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("chat:error", { message: "Failed to send message" });
    }
  });

  socket.on("chat:history", async (chatId: unknown) => {
    try {
      const parsedChatId = ChatIdSchema.parse(chatId);
      const messages = await _getMessages(parsedChatId, userId);
      socket.emit("chat:history", messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      socket.emit("chat:error", { message: "Failed to fetch chat history" });
    }
  });
}
