import { Router } from "express";

import cateringDetailsController from "../controllers/cateringDetailsController";
import authenticateJWT from "../middlewares/authMiddleware";

const cateringDetails = Router();

// Main Dishes Routes
cateringDetails.get(
  "/main-dishes",
  authenticateJWT(),
  cateringDetailsController.getAllMainDishes
);
cateringDetails.post(
  "/main-dishes",
  authenticateJWT(),
  cateringDetailsController.createMainDish
);
cateringDetails.put(
  "/main-dishes/:id",
  authenticateJWT(),
  cateringDetailsController.updateMainDish
);
cateringDetails.delete(
  "/main-dishes/:id",
  authenticateJWT(),
  cateringDetailsController.deleteMainDish
);

// Snack Corner Routes
cateringDetails.get(
  "/snack-corner",
  authenticateJWT(),
  cateringDetailsController.getAllSnackCorners
);
cateringDetails.post(
  "/snack-corner",
  authenticateJWT(),
  cateringDetailsController.createSnackCorner
);
cateringDetails.put(
  "/snack-corner/:id",
  authenticateJWT(),
  cateringDetailsController.updateSnackCorner
);
cateringDetails.delete(
  "/snack-corner/:id",
  authenticateJWT(),
  cateringDetailsController.deleteSnackCorner
);

// Add-Ons Routes
cateringDetails.get(
  "/add-ons",
  authenticateJWT(),
  cateringDetailsController.getAllAddOns
);
cateringDetails.post(
  "/add-ons",
  authenticateJWT(),
  cateringDetailsController.createAddOn
);
cateringDetails.put(
  "/add-ons/:id",
  authenticateJWT(),
  cateringDetailsController.updateAddOn
);
cateringDetails.delete(
  "/add-ons/:id",
  authenticateJWT(),
  cateringDetailsController.deleteAddOn
);

// Packages Routes
cateringDetails.get(
  "/packages",
  authenticateJWT(),
  cateringDetailsController.getAllPackages
);
cateringDetails.post(
  "/packages",
  authenticateJWT(),
  cateringDetailsController.createPackage
);
cateringDetails.put(
  "/packages/:id",
  authenticateJWT(),
  cateringDetailsController.updatePackage
);
cateringDetails.delete(
  "/packages/:id",
  authenticateJWT(),
  cateringDetailsController.deletePackage
);

// Inclusions Routes
cateringDetails.get(
  "/inclusions",
  authenticateJWT(),
  cateringDetailsController.getAllInclusions
);
cateringDetails.post(
  "/inclusions",
  authenticateJWT(),
  cateringDetailsController.createInclusion
);
cateringDetails.put(
  "/inclusions/:id",
  authenticateJWT(),
  cateringDetailsController.updateInclusion
);
cateringDetails.delete(
  "/inclusions/:id",
  authenticateJWT(),
  cateringDetailsController.deleteInclusion
);

export default cateringDetails;
