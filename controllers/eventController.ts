import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const eventController = {
  getAllEvents: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement get all events
  }),

  getEventById: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement get event by id
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
