import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const adminController = {
  index: asyncHandler(async (req: Request, res: Response) => {
    res.send("hello admin");
  }),
};

export default adminController;
