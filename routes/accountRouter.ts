import { Router } from "express";
const accountRouter = Router();

import accountController from "../controllers/accountController";

accountRouter.get("/", accountController.getAllAccounts);
accountRouter.get("/", accountController.getAccountById);
accountRouter.post("/", accountController.createAccount);
accountRouter.put("/:id", accountController.updateAccount);
accountRouter.delete("/:id", accountController.deleteAccount);

export default accountRouter;
