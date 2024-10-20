import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { IUser } from "../@types/user";

const prisma = new PrismaClient();

const eventController = {
  getAllEvents: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const userRole = user?.role;
    const userId = user?.id;

    // If user is an admin, return all events
    if (userRole === "ADMIN") {
      const events = await prisma.event.findMany();

      res.status(200).json(events);
      return;
    }

    // If user is not an admin, return only events created by the user
    const events = await prisma.event.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json(events);
  }),

  getEventById: asyncHandler(async (req: Request, res: Response) => {
    const event = await prisma.event.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!event) {
      res.status(404).json({ msg: "Event not found" });
      return;
    }

    res.status(200).json(event);
  }),

  createEvent: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement ceate event
  }),

  updateEvent: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement update event
  }),

  deleteEvent: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement delete event
  }),
};

export default eventController;
