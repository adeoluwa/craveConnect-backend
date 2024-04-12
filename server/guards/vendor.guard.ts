import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../helpers/HttpsResponse";
import { VendorAttributes } from "../interface/model.interface";
import Helper from "../helpers";
import Vendor from "../models/Vendor";
import Exception from "../utils/ExceptionHandler";

declare global {
  namespace Express {
    interface Request {
      vendor?: VendorAttributes;
    }
  }
}

export class VendorAuthGuard {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return next(new Exception("Unauthorized access", 401));
      }

      const verifyToken = Helper.verifyToken(token);

      if (!verifyToken || !verifyToken.token || !verifyToken.token.email) {
        return next(new Exception("Invalid token", 401));
      }

      const vendor = await Vendor.findOne({
        email: verifyToken.token.email,
      });
      console.log("Vendor object: ", vendor);

      if (!vendor) {
        return next(
          new Exception("Forbidden Access", HttpStatusCode.HTTP_FORBIDDEN)
        );
      }

      req.vendor = vendor as VendorAttributes;

      console.log(req.vendor._id);
      return next();
    } catch (error) {
      return next(error);
    }
  }
}
