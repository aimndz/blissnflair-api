import { Router } from "express";
const authRouter = Router();

import passport from "../config/passportConfig";
import { Request, Response } from "express";
import authController from "../controllers/authController";
import { IUser } from "../@types/user";

// User routes
authRouter.post("/login", authController.login);
authRouter.post("/sign-up", authController.signUp);
authRouter.post("/logout", authController.logout);
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  (req: Request, res: Response) => {
    const { token } = req.user as { user: IUser; token: string };

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

export default authRouter;
