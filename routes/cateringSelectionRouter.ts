import { Router } from "express";
const cateringRouter = Router();

import cateringController from "../controllers/cateringSelectionController";
import authenticateJWT from "../middlewares/authMiddleware";

cateringRouter.get("/", authenticateJWT(), cateringController.getAllCatering);
cateringRouter.get(
  "/:id",
  authenticateJWT(),
  cateringController.getCateringById
);
cateringRouter.post("/", authenticateJWT(), cateringController.createCatering);
cateringRouter.put(
  "/:id",
  authenticateJWT(),
  cateringController.updateCatering
);
cateringRouter.delete(
  "/:id",
  authenticateJWT(),
  cateringController.deleteCatering
);

export default cateringRouter;
