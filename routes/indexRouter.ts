import { Router } from "express";
const indexRouter = Router();

import indexController from "../controllers/indexController";

indexRouter.get("/", indexController.index);

export default indexRouter;
