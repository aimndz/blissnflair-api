import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { supabase } from "../config/supabaseClient";

import { IUser } from "../@types/user";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const eventController = {
  getAllEvents: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const userRole = user?.role;
    const userId = user?.id;

    // If user is an admin, return all events with bookedId details
    if (userRole === "ADMIN") {
      const events = await prisma.event.findMany({
        include: {
          user: true,
        },
      });

      res.status(200).json(events);
      return;
    }

    // If user is not an admin, return only events created by the user with bookedId details
    const events = await prisma.event.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    res.status(200).json(events);
  }),

  getEventById: asyncHandler(async (req: Request, res: Response) => {
    const event = await prisma.event.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: true,
      },
    });

    if (!event) {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    res.status(200).json(event);
  }),

  createEvent: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 50 })
      .withMessage("Title must be less than 50 characters")
      .custom(async (value, { req }) => {
        const userId = req.user.id;

        const existingEvent = await prisma.event.findFirst({
          where: {
            title: value,
            userId: userId,
          },
        });

        if (existingEvent) {
          throw new Error("You already have an event with this title");
        }

        return true;
      }),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 255 })
      .withMessage("Description must be less than 255 characters"),

    body("venue").trim().notEmpty().withMessage("Venue is required"),

    body("eventImage")
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

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isLength({ max: 50 })
      .withMessage("Category must be less than 50 characters"),

    body("date")
      .trim()
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Date must be a valid date"),

    body("startTime")
      .trim()
      .notEmpty()
      .withMessage("Start time is required")
      .isISO8601()
      .withMessage("Start time must be a valid time"),

    body("endTime")
      .trim()
      .notEmpty()
      .withMessage("End time is required")
      .isISO8601()
      .withMessage("End time must be a valid time")
      .custom((endTime, { req }) => {
        const startTime = req.body.startTime;

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
          throw new Error("End time must be after the start time");
        }

        const diffInHours =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
          throw new Error(
            "End time must be at least 1 hour after the start time"
          );
        }

        return true;
      }),

    body("hasInHouseCatering")
      .optional()
      .isBoolean()
      .withMessage("In-house catering must be a boolean value"),

    body("additionalHours")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Additional hours must be a non-negative integer"),

    body("additionalNotes")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Additional notes must be less than 500 characters"),

    body("hasCleaningFee")
      .optional()
      .isBoolean()
      .withMessage("Cleaning fee must be a boolean value"),

    asyncHandler(async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = req.user as IUser;

      const {
        title,
        description,
        organizer,
        category,
        date,
        startTime,
        endTime,
        additionalHours,
        additionalNotes,
        hasCleaningFee,
        venue,
      } = req.body;

      const newEvent = await prisma.event.create({
        data: {
          title,
          description,
          organizer,
          category,
          date,
          startTime,
          endTime,
          additionalHours: additionalHours ? Number(additionalHours) : 0,
          additionalNotes,
          hasCleaningFee: hasCleaningFee ?? false,
          userId: user.id,
          venue,
        },
      });

      const eventImage = req.file;

      let updatedEvent;

      if (eventImage) {
        const filePath = `event_img/${newEvent.id}/${
          eventImage.originalname
        }-${Date.now()}`;

        // Upload the image to Supabase
        const { error, data } = await supabase.storage
          .from("images")
          .upload(filePath, eventImage.buffer, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          res.status(500).json({
            error: "Failed to upload event image",
            message: error.message,
          });
          return;
        }

        const publicUrl = supabase.storage.from("images").getPublicUrl(filePath)
          .data.publicUrl;

        // Update the event with the `imageUrl`
        updatedEvent = await prisma.event.update({
          where: { id: newEvent.id },
          data: { imageUrl: publicUrl },
        });
      }

      res.status(201).json({
        msg: "Event created successfully",
        event: updatedEvent ?? newEvent,
      });
    }),
  ],

  updateEvent: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 50 })
      .withMessage("Title must be less than 50 characters")
      .custom(async (value, { req }) => {
        const userId = req.user.id;
        const eventId = req.params?.id;
        const eventDate = req.body.startTime;

        const existingEvent = await prisma.event.findFirst({
          where: {
            title: value,
            userId: userId,
            date: eventDate,
            NOT: { id: eventId }, // not updating the event title for the same event is allowed
          },
        });

        if (existingEvent && existingEvent.id !== eventId) {
          throw new Error("You already have an event with this title");
        }

        return true;
      }),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 255 })
      .withMessage("Description must be less than 255 characters"),

    body("venue").trim().notEmpty().withMessage("Venue is required"),

    body("eventImage")
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

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isLength({ max: 50 })
      .withMessage("Category must be less than 50 characters"),

    body("date")
      .trim()
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Date must be a valid date"),

    body("startTime")
      .trim()
      .notEmpty()
      .withMessage("Start time is required")
      .isISO8601()
      .withMessage("Start time must be a valid time"),

    body("endTime")
      .trim()
      .notEmpty()
      .withMessage("End time is required")
      .isISO8601()
      .withMessage("End time must be a valid time")
      .custom((endTime, { req }) => {
        const startTime = req.body.startTime;

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
          throw new Error("End time must be after the start time");
        }

        const diffInHours =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
          throw new Error(
            "End time must be at least 1 hour after the start time"
          );
        }

        return true;
      }),

    body("hasInHouseCatering")
      .optional()
      .isBoolean()
      .withMessage("In-house catering must be a boolean value"),

    body("additionalHours")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Additional hours must be a non-negative integer"),

    body("additionalNotes")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Additional notes must be less than 500 characters"),

    body("hasCleaningFee")
      .optional()
      .isBoolean()
      .withMessage("Cleaning fee must be a boolean value"),

    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["PENDING", "APPROVED", "CANCELLED", "REJECTED", "COMPLETED"])
      .withMessage(
        "Status must be PENDING, CANCELLED, APPROVED, REJECTED or COMPLETED"
      ),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = req.user as IUser;
      const eventId = req.params.id; // Assuming the event ID is passed in the URL parameters

      const {
        title,
        description,
        organizer,
        category,
        date,
        startTime,
        endTime,
        additionalHours,
        additionalNotes,
        hasCleaningFee,
        venue,
        status,
        deletedAt,
      } = req.body;

      // Find the existing event
      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!existingEvent) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      // Update the event details
      const updatedEventData = {
        title,
        description,
        organizer,
        category,
        date,
        startTime,
        endTime,
        additionalHours: additionalHours ? Number(additionalHours) : 0,
        additionalNotes,
        hasCleaningFee: hasCleaningFee ?? false,
        venue,
        status,
        deletedAt,
      };

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: updatedEventData,
      });

      const eventImage = req.file;

      if (eventImage) {
        const filePath = `event_img/${updatedEvent.id}/${
          eventImage.originalname
        }-${Date.now()}`;

        // Upload the image to Supabase
        const { error } = await supabase.storage
          .from("images")
          .upload(filePath, eventImage.buffer, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          res.status(500).json({
            error: "Failed to upload event image",
            message: error.message,
          });
          return;
        }

        const publicUrl = supabase.storage.from("images").getPublicUrl(filePath)
          .data.publicUrl;

        // Update the event with the `imageUrl`
        await prisma.event.update({
          where: { id: updatedEvent.id },
          data: { imageUrl: publicUrl },
        });

        // Return the updated event with the new image URL
        res.status(200).json({
          msg: "Event updated successfully with new image",
          event: { ...updatedEvent, imageUrl: publicUrl },
        });
      } else {
        // Return the updated event without the image URL
        res.status(200).json({
          msg: "Event updated successfully without new image",
          event: updatedEvent,
        });
      }
    }),
  ],

  deleteEvent: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const eventId = req.params.id;

    // If user is an admin, allow them to delete any event
    if (user.role === "ADMIN") {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        res.status(404).json({ msg: "Event not found" });
        return;
      }

      await prisma.event.delete({
        where: { id: eventId },
      });

      res.status(200).json({ msg: "Event deleted successfully" });
      return;
    }

    // If user is not an admin, allow them to delete only their own events
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: user.id,
      },
    });

    if (!event) {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    res.status(200).json({ msg: "Event deleted successfully" });
  }),
};

export default eventController;
