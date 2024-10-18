import express, { Request, Response } from "express";

import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import accountRouter from "./routes/accountRouter";

const app = express();

app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/account", accountRouter);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
