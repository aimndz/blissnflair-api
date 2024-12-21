import { Router } from "express";
const accountRouter = Router();
import multer from "multer";

import accountController from "../controllers/accountController";
import authenticateJWT from "../middlewares/authMiddleware";

const upload = multer({
  storage: multer.memoryStorage(),
});

accountRouter.get(
  "/",
  authenticateJWT(["ADMIN"]),
  accountController.getAllAccounts
);
accountRouter.get(
  "/:id",
  authenticateJWT(["ADMIN"]),
  accountController.getAccountById
);
accountRouter.post(
  "/",
  authenticateJWT(["ADMIN"]),
  accountController.createAccount
);
accountRouter.put(
  "/:id",
  authenticateJWT(),
  upload.single("avatarImage"),
  accountController.updateAccount
);
accountRouter.delete(
  "/:id",
  authenticateJWT(["ADMIN"]),
  accountController.deleteAccount
);

export default accountRouter;
