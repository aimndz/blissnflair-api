import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const systemController = {
  verifyToken: asyncHandler(async (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).json({ user: req.user });
    } else {
      res.status(401).json({ msg: "Unauthorized" });
    }
  }),
};

export default systemController;
