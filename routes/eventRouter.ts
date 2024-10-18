import { Router } from "express";
const eventRouter = Router();

import eventController from "../controllers/eventController";

eventRouter.get("/", eventController.getAllEvents);
eventRouter.get("/:id", eventController.getEventById);
eventRouter.post("/", eventController.createEvent);
eventRouter.put("/:id", eventController.updateEvent);
eventRouter.delete("/:id", eventController.deleteEvent);

export default eventRouter;
