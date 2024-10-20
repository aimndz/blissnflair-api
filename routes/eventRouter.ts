import { Router } from "express";
const eventRouter = Router();

import eventController from "../controllers/eventController";
import authenticateJWT from "../middlewares/authMiddleware";

eventRouter.get("/", authenticateJWT(), eventController.getAllEvents);
eventRouter.get("/:id", authenticateJWT(), eventController.getEventById);
eventRouter.post("/", authenticateJWT(), eventController.createEvent);
eventRouter.put("/:id", authenticateJWT(), eventController.updateEvent);
eventRouter.delete("/:id", authenticateJWT(), eventController.deleteEvent);

export default eventRouter;
