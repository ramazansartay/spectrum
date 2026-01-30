import express from "express";
import { createServer } from "http";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes.js";
import { initializeSocket } from "./socket.js";
import path from "path";
import { fileURLToPath } from "url";

// Since we are using ES Modules, __dirname is not available directly.
// This is the standard way to derive it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const app = express();
  const httpServer = createServer(app);
  const PgStore = connectPgSimple(session);

  // Serve static files from the 'public' directory relative to the 'dist' folder
  const publicPath = path.join(__dirname, 'public');

  app.use(express.static(publicPath));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(
    session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  const server = await registerRoutes(httpServer, app);
  initializeSocket(server);

  // SPA fallback: for any request that doesn't match a previous route,
  // send back the main index.html file.
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () =>
    console.log(`Server is listening on port ${port}!`)
  );
}

main();
