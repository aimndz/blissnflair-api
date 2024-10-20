import { Router } from "express";
const systemRouter = Router();

import systemController from "../controllers/systemController";
import authenticateJWT from "../middlewares/authMiddleware";

systemRouter.get(
  "/",
  authenticateJWT(["ADMIN"]),
  systemController.getSystemInfo
);
systemRouter.post(
  "/",
  authenticateJWT(["ADMIN"]),
  systemController.createSystemInfo
);
systemRouter.post(
  "/",
  authenticateJWT(["ADMIN"]),
  systemController.updateSystemInfo
);

export default systemRouter;
