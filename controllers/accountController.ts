import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const accountController = {
  getAllAccounts: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement get all accounts
  }),

  getAccountById: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement get account by id
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
