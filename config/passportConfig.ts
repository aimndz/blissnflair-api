import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const cookieExtractor = (req: Request): string | null => {
  return req.cookies && req.cookies.token ? req.cookies.token : null;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.user.id,
        },
      });
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      console.error(error);
      done(error, false);
      return;
    }
  })
);

export default passport;
