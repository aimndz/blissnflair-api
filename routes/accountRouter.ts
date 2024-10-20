import { Router } from "express";
const accountRouter = Router();

import accountController from "../controllers/accountController";
import authenticateJWT from "../middlewares/authMiddleware";

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
  authenticateJWT(["ADMIN"]),
  accountController.updateAccount
);
accountRouter.delete(
  "/:id",
  authenticateJWT(["ADMIN"]),
  accountController.deleteAccount
);

export default accountRouter;
