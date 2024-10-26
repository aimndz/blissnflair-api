import { Router } from "express";
const utilsRouter = Router();

import utilsController from "../controllers/utilsController";
import authenticateJWT from "../middlewares/authMiddleware";

utilsRouter.get(
  "/verify-token",
  authenticateJWT([]),
  utilsController.verifyToken
);

export default utilsRouter;
