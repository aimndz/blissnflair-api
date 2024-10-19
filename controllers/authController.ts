import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ msg: "Invalid email or password" });
      return;
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Successful login
    res.status(200).json({ msg: "Login successful", token });
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
