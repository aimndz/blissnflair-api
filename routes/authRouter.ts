import { Router } from "express";
const authRouter = Router();

import authController from "../controllers/authController";

// User routes
authRouter.post("/login", authController.login);
authRouter.post("/sign-up", authController.signUp);

// Admin routes
authRouter.post("/admin/login", authController.adminLogin);

// Log out
authRouter.get("/log-out", authController.logOut);

export default authRouter;
