import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../helpers/HttpsResponse";
import { UserAttributes } from "../interface/model.interface";
import Helper from "../helpers/";
import User from "../models/User";
import Exception from "../utils/ExceptionHandler";

declare global {
  namespace Express {
    interface Request {
      user?:UserAttributes;
    }
  }
}

export class UserAuthGuard {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return next(new Exception("Unauthorized access", 401));
      }

      const verifyToken = Helper.verifyToken(token);

      const user = await User.findOne({
        email: verifyToken.token.email,
      });

      if (!user) {
        return next(
          new Exception("Forbidden Access", HttpStatusCode.HTTP_FORBIDDEN),
        );
      }

      req.user = user as UserAttributes;
      return next();
    } catch (error) {
      return next(error)
    }
  }
}
