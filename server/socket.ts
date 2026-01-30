import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { handleChat } from "./events/chat.js";

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    handleChat(socket, io);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
}
