// project-summer

import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import express from "express";
import app from "./app";

// const app = express();
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT} `);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Failed to connect:", err.message);
  }
};

startServer();
