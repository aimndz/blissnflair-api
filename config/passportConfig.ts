import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Request } from "express";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import { IGoogleProfile } from "../@types/user";
const prisma = new PrismaClient();

const cookieExtractor = (req: Request): string | null => {
  return req.cookies && req.cookies.token ? req.cookies.token : null;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

//// JWT STRATEGY
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
      done(error, false);
      return;
    }
  })
);

//// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: IGoogleProfile,
      done: (error: any, user?: any) => void
    ) {
      try {
        let user = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              id: profile.id,
              firstName: profile.given_name,
              lastName: profile.family_name,
              email: profile.email,
              password: "",
              role: "USER",
            },
          });
        }

        const payload = {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return done(null, { user, token });
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error);
      }
    }
  )
);

export default passport;
