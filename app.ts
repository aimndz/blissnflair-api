import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

import passport from "./config/passportConfig";

import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import accountRouter from "./routes/accountRouter";
import errorHandler from "./middlewares/errorMiddleware";
import utilsRouter from "./routes/utilsRouter";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/account", accountRouter);
app.use("/utils", utilsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
