import { Router } from "express";
const systemRouter = Router();

import systemController from "../controllers/systemController";

systemRouter.get("/", systemController.getSystemInfo);
systemRouter.post("/", systemController.createSystemInfo);
systemRouter.post("/", systemController.updateSystemInfo);

export default systemRouter;
