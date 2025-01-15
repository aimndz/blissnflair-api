import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }); // 30 days

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

  logout: asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ msg: "Logged out successfully" });
  }),

  // Handling the request logic
  forgotPassword: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .custom(async (value) => {
        const user = await prisma.user.findUnique({
          where: { email: value },
        });

        if (!user) {
          throw new Error("Email not registered");
        }
        return true;
      }),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email } = req.body;

      const existingCode = await prisma.verificationCode.findUnique({
        where: { email },
      });

      if (existingCode) {
        if (existingCode.expiry > new Date()) {
          res.status(400).json({
            message: "A verification code has already been sent to this email.",
          });
          return;
        }

        // Optionally, delete the old expired code and create a new one
        await prisma.verificationCode.delete({
          where: { email },
        });
      }

      // Generate verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

      // Hash the code before storing
      const hashedCode = await bcrypt.hash(verificationCode, 10);

      try {
        // Store the verification code in the database
        await prisma.verificationCode.create({
          data: {
            email,
            code: hashedCode,
            expiry: expiresAt,
          },
        });

        // Send email with the verification code
        const htmlMessage = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="text-align: center;">Password Reset Verification Code</h2>
            <p>Your verification code is:</p>
            <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">${verificationCode}</div>
            <p style="color: #FF0000; text-align: center;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `;

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Password Reset Verification Code",
          html: htmlMessage,
        };

        await transporter.sendMail(mailOptions);

        res
          .status(200)
          .json({ message: "Verification code sent to your email." });
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email." });
      }
    }),
  ],

  verifyCode: [
    body("email"),
    body("verificationCode")
      .trim()
      .notEmpty()
      .withMessage("Verification code is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("Verification code must be 6 digits")
      .custom(async (value, { req }) => {
        const { email } = req.body;

        // Retrieve the stored verification code from the database
        const storedCode = await prisma.verificationCode.findUnique({
          where: { email },
        });

        if (!storedCode) {
          throw new Error("Verification code not found or expired");
        }

        // Compare the submitted code with the stored hash
        const isValid = await bcrypt.compare(value, storedCode.code);

        if (!isValid) {
          throw new Error("Invalid verification code");
        }

        if (Date.now() > storedCode.expiry.getTime()) {
          throw new Error("Verification code has expired");
        }

        return true;
      }),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email } = req.body;

      try {
        await prisma.verificationCode.delete({
          where: { email },
        });

        res.status(200).json({ message: "Your verification code is valid." });
      } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Error resetting password" });
      }
    }),
  ],

  resetPassword: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

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

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        // Update the user's password
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });

        res.status(200).json({ message: "Password successfully updated." });
      } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Error resetting password." });
      }
    }),
  ],
};

export default authController;
