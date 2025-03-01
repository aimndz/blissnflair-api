import asyncHandler from "express-async-handler";
import e, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { supabase } from "../config/supabaseClient";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../@types/user";

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
        createdAt: true,
        imageUrl: true,
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
        imageUrl: true,
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

    body("phoneNumber")
      .optional()
      .custom((value) => {
        if (value && value.length > 0) {
          if (!/^\+639\d{9}$/.test(value)) {
            throw new Error("Invalid phone number format. Use +639XXXXXXXXX.");
          }
        }
        return true;
      }),

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

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          role: role,
          phoneNumber,
          password: hashedPassword,
        },
      });

      res.status(201).json({ msg: "User created successfully", user });
    }),
  ],

  updateAccount: [
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
      .custom(async (value, { req }) => {
        const userId = req.params?.id;

        const existingUser = await prisma.user.findUnique({
          where: { email: value },
        });

        // Check if email already exists and is not the current user's email
        if (existingUser && existingUser.id !== userId) {
          throw new Error("Email already exists");
        }

        return true;
      }),

    body("phoneNumber")
      .optional()
      .custom((value) => {
        if (value && value.length > 0) {
          if (!/^\+639\d{9}$/.test(value)) {
            throw new Error("Invalid phone number format. Use +639XXXXXXXXX.");
          }
        }
        return true;
      }),

    body("role").optional().isIn(["ADMIN", "USER"]),

    body("password")
      .optional()
      .custom((value, { req }) => {
        if (value) {
          // If password is provided, validate it
          if (value.length < 8) {
            throw new Error("Password must be at least 8 characters");
          }
          if (!/\d/.test(value)) {
            throw new Error("Password must contain a number");
          }
          if (!/[a-zA-Z]/.test(value)) {
            throw new Error("Password must contain a letter");
          }
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            throw new Error("Password must contain a special character");
          }
        }
        return true;
      }),

    body("currentPassword")
      .optional()
      .custom(async (value, { req }) => {
        const accountId = req.params?.id;

        // Fetch the user's current hashed password from the database
        const user = await prisma.user.findUnique({
          where: { id: accountId },
          select: { password: true },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Check if currentPassword matches the current stored password
        const isCurrentPasswordMatch = await bcrypt.compare(
          value,
          user.password
        );
        if (!isCurrentPasswordMatch) {
          throw new Error("Current password is incorrect");
        }

        return true;
      }),

    body("avatarImage")
      .optional()
      .custom((value, { req }) => {
        if (req.file) {
          const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
          if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error("File must be a valid image");
          }

          // max 5MB
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (req.file.size > maxSize) {
            throw new Error("File size must be less than 5MB");
          }
        }

        return true;
      }),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const accountId = req.params.id;
      const user = req.user as IUser;

      const userId = user?.id;
      const userRole = user?.role;

      if (userRole !== "ADMIN" && userId !== accountId) {
        res
          .status(403)
          .json({ error: "Forbidden: You can only update your own account" });
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

      const updatedData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: "ADMIN" | "USER";
        phoneNumber?: string;
        password?: string;
      } = {
        firstName,
        lastName,
        email,
        role,
        phoneNumber,
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      const updatedAccount = await prisma.user.update({
        where: {
          id: accountId,
        },
        data: updatedData,
      });

      const avatarImage = req.file;
      let updatedUser;

      if (avatarImage) {
        const folderPath = `avatar_img/${updatedAccount.id}/`;
        const filePath = `${folderPath}${
          avatarImage.originalname
        }-${Date.now()}`;

        // List existing files in the folder
        const { data: existingFiles, error: listError } = await supabase.storage
          .from("images")
          .list(folderPath);

        if (listError) {
          res.status(500).json({
            error: "Failed to check existing avatar images",
            message: listError.message,
          });
          return;
        }

        // Delete existing files in the folder
        if (existingFiles?.length) {
          const deletePaths = existingFiles.map(
            (file) => `${folderPath}${file.name}`
          );
          const { error: deleteError } = await supabase.storage
            .from("images")
            .remove(deletePaths);

          if (deleteError) {
            res.status(500).json({
              error: "Failed to delete existing avatar images",
              message: deleteError.message,
            });
            return;
          }
        }

        // Upload the new image
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, avatarImage.buffer, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          res.status(500).json({
            error: "Failed to upload avatar image",
            message: uploadError.message,
          });
          return;
        }

        const publicUrl = supabase.storage.from("images").getPublicUrl(filePath)
          .data.publicUrl;

        // Update the user with the `imageUrl`
        updatedUser = await prisma.user.update({
          where: { id: accountId },
          data: { imageUrl: publicUrl },
        });
      }

      res.status(200).json({
        msg: "User updated successfully",
        user: updatedUser || updatedAccount,
      });
    }),
  ],

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    const accountId = req.params.id;

    const account = await prisma.user.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      res.status(404).json({ msg: "Account not found" });
      return;
    }

    await prisma.user.delete({
      where: {
        id: accountId,
      },
    });

    res.status(200).json({ msg: "Account deleted successfully" });
  }),
};

export default accountController;
