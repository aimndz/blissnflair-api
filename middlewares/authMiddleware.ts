import passport from "passport";
import { Request, Response, NextFunction } from "express";

import { IUser } from "../@types/user";

const authenticateJWT = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: IUser | false) => {
        if (err) {
          return res.status(500).json({ msg: "Internal server error" });
        }

        if (!user) {
          return res.status(401).json({ msg: "Unauthorized" });
        }

        if (roles.length && !roles.includes(user.role)) {
          return res.status(403).json({ msg: "Forbidden" });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export default authenticateJWT;
