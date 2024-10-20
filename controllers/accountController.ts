import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

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

  createAccount: [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ max: 35 })
      .withMessage("First name must be less than 35 characters"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ max: 35 })
      .withMessage("Last name must be less than 35 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .custom(async (value) => {
        const existingUser = await prisma.user.findUnique({
          where: { email: value },
        });
        if (existingUser) {
          throw new Error("Email already exists");
        }
        return true;
      }),

    body("phoneNumber").optional(),

    body("role").optional().isIn(["ADMIN", "USER"]),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[a-zA-Z]/)
      .withMessage("Password must contain a letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain a special character"),

    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        firstName,
        lastName,
        email,
        role = "USER",
        phoneNumber,
        password,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          role: role,
          phoneNumber,
          password: hashedPassword,
        },
      });

      res.status(201).json({ msg: "User created successfully" });
    }),
  ],

  updateAccount: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement update account
  }),

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement delete account
  }),
};

export default accountController;
