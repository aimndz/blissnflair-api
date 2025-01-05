import { Router } from "express";
const eventRouter = Router();

import multer from "multer";

import eventController from "../controllers/eventController";
import authenticateJWT from "../middlewares/authMiddleware";

const upload = multer({
  storage: multer.memoryStorage(),
});

eventRouter.get("/", authenticateJWT(), eventController.getAllEvents);
eventRouter.get("/:id", authenticateJWT(), eventController.getEventById);
eventRouter.post(
  "/",
  authenticateJWT(),
  upload.single("eventImage"),
  eventController.createEvent
);
eventRouter.put(
  "/:id",
  authenticateJWT(),
  upload.single("eventImage"),
  eventController.updateEvent
);
eventRouter.delete("/:id", authenticateJWT(), eventController.deleteEvent);

export default eventRouter;
