import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const indexController = {
  index: asyncHandler(async (req: Request, res: Response) => {
    res.send("hello");
  }),
};

export default indexController;
