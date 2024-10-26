import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
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

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // Successful login
    res.status(200).json({ msg: "Login successful" });
  }),

  signUp: [
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

    body("phoneNumber")
      .optional()
      .matches(/^\+639\d{9}$/)
      .withMessage("Invalid phone number format. Use +639XXXXXXXXX."),

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

      const { firstName, lastName, email, phoneNumber, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword,
        },
      });

      res.status(201).json({ msg: "User created successfully" });
    }),
  ],
};

export default authController;
