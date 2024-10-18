import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement login
  }),

  adminLogin: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement admin login
  }),

  signUp: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement sign up
  }),

  logOut: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement log out
  }),
};

export default authController;
