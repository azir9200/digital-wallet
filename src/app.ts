import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./app/routes";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors());

app.use("/api/v1", router);

export default app;
