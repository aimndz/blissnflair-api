import express, { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

import passport from "./config/passportConfig";

import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import accountRouter from "./routes/accountRouter";
import errorHandler from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/account", accountRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
