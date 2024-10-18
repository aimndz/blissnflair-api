import express, { Request, Response } from "express";

import indexRouter from "./routes/indexRouter";
import adminRouter from "./routes/adminRouter";

const app = express();

app.use("/", indexRouter);
app.use("/admin", adminRouter);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
