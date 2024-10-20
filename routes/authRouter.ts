import { Router } from "express";
const authRouter = Router();

import authController from "../controllers/authController";

// User routes
authRouter.post("/login", authController.login);
authRouter.post("/sign-up", authController.signUp);

export default authRouter;
