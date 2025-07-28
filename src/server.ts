import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Start Express server
    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server running on port ${envVars.PORT}`);
    });

    // Graceful shutdown on SIGINT/SIGTERM
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

const shutdown = async () => {
  // console.log("\n🛑 Shutting down server...");

  if (server) {
    server.close(() => {
      // console.log("🛑 HTTP server closed");
    });
  }

  await mongoose.disconnect();
  // console.log("🛑 MongoDB disconnected");

  process.exit(0);
};

startServer();
