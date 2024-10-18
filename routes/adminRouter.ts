import { Router } from "express";
const adminRouter = Router();

import adminController from "../controllers/adminController";

adminRouter.get("/", adminController.index);

export default adminRouter;
