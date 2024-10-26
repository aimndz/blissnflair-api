import passport from "passport";
import { Request, Response, NextFunction } from "express";

import { IUser } from "../@types/user";

const cookieExtractor = (req: Request): string | null => {
  return req.cookies && req.cookies.token ? req.cookies.token : null;
};

const authenticateJWT = (
  roles: string[] = []
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = cookieExtractor(req);

    if (!token) {
      // res.clearCookie("token");
      res.status(401).json({ msg: "Unauthorized" });
      return;
    }

    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: IUser | false) => {
        if (err) {
          res.clearCookie("token");
          return res.status(500).json({ msg: "Internal server error" });
        }

        if (!user) {
          // res.clearCookie("token");
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
