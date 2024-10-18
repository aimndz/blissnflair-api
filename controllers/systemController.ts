import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const systemController = {
  getSystemInfo: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement get system info
  }),

  createSystemInfo: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement create system info
  }),

  updateSystemInfo: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement update system info
  }),
};

export default systemController;
