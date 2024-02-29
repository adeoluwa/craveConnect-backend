import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { Request } from "express";
import path from "path";

import bcrypt from "bcryptjs";
import Exception from "../utils/ExceptionHandler";
import HttpStatusCode from "./HttpsResponse";

export default class Helper {
  static signToken(payload: any): { token: string } {
    const token = jwt.sign(payload, (<any>process.env).USER_SECRET, {
      expiresIn: (<any>process).env.JWT_EXPIRES_IN,
    });

    return { token };
  }

  static verifyToken(payload: any): { token: any } {
    const token = jwt.verify(payload, (<any>process.env).USER_SECRET);
    return { token };
  }

  static async hash(value: string, saltValue = 10) {
    return bcrypt.hashSync(value, saltValue);
  }

  static async correctPassword(inputPassword: string, userPassword: string) {
    return bcrypt.compareSync(inputPassword, userPassword);
  }

  static omitProperties(
    obj: Record<string, any>,
    ...propsToOmit: string[]
  ): Record<string, any> {
    const result = { ...obj };
    propsToOmit.forEach((prop) => {
      delete result[prop];
    });

    return result;
  }
}
