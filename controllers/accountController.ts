import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const accountController = {
  getAllAccounts: asyncHandler(async (req: Request, res: Response) => {
    const accounts = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    res.status(200).json(accounts);
  }),

  getAccountById: asyncHandler(async (req: Request, res: Response) => {
    const accountId = req.params.id;

    const account = await prisma.user.findUnique({
      where: {
        id: accountId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    if (!account) {
      res.status(404).json({ msg: "Account not found" });
      return;
    }

    res.status(200).json(account);
  }),

  createAccount: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement create account
  }),

  updateAccount: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement update account
  }),

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement delete account
  }),
};

export default accountController;
