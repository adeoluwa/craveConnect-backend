import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../helpers/HttpsResponse";
import { AdminAttributes } from "../interface/model.interface";
import Helper from "../helpers";
import Admin from "../models/Admin";
import Exception from "../utils/ExceptionHandler";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminAttributes;
    }
  }
}

export class AdminAuthGuard {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return next(new Exception("Unauthorized access", 401));
      }

      const verifiedToken = Helper.verifyToken(token);

      const admin = await Admin.findOne({
        email: verifiedToken.token.email,
      });

      if (!admin) {
        return next(
          new Exception("Forbidden Access", HttpStatusCode.HTTP_FORBIDDEN)
        );
      }

      req.admin = admin as AdminAttributes;
    } catch (error) {
      return next(error);
    }
  }
}
