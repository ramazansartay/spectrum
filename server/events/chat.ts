import { Server, Socket } from "socket.io";
import { getMessages, sendMessage } from "../controllers/chats.js";

export function handleChat(socket: Socket, io: Server) {
  socket.on("chat:join", (chatId: string) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("chat:leave", (chatId: string) => {
    socket.leave(chatId);
    console.log(`User left chat: ${chatId}`);
  });

  socket.on("chat:message", async (data: { chatId: string; message: string; senderId: string }) => {
    try {
      const newMessage = await sendMessage(data.chatId, data.message, data.senderId);
      io.to(data.chatId).emit("chat:message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, emit an error event back to the sender
      socket.emit("chat:error", { message: "Failed to send message" });
    }
  });

  socket.on("chat:history", async (chatId: string) => {
    try {
      const messages = await getMessages(chatId);
      socket.emit("chat:history", messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      socket.emit("chat:error", { message: "Failed to fetch chat history" });
    }
  });
}
