import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import Admin from "../../models/Admin";
import { EditAdminDto } from "./dto";
import HttpStatusCode from "../../helpers/HttpsResponse";
// import User from "../../models/User";
// import Vendor from "../../models/Vendor";
import Food from "../../models/Food";

@Controller("/api/v1/admin")
export default class AdminController extends RouteController {
  constructor() {
    super();
  }

  @Put("/:id")
  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.params.id;

      if (!adminId) {
        return next(
          new Exception(
            "Id is a required params",
            HttpStatusCode.HTTP_BAD_REQUEST
          )
        );
      }
      const { error, value } = EditAdminDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(adminId, value, {
        new: true,
      });

      return super.sendSuccessResponse(
        res,
        updatedAdmin.toObject(),
        "Admin details successfully updated",
        HttpStatusCode.HTTP_CREATED
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/")
  async listAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await Admin.find();

      if (admin.length === 0) {
        return super.sendSuccessResponse(
          res,
          null,
          "admin list is empty, try creating one.",
          HttpStatusCode.HTTP_OK
        );
      }

      return super.sendSuccessResponse(res, admin, "Admin details fetch", 200);
    } catch (error) {
      return next(error);
    }
  }

  @Get("/:adminId")
  async getAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await Admin.findById(req.params.adminId);

      if (!admin) {
        return next(
          new Exception(
            "Admin details not found",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      return super.sendSuccessResponse(
        res,
        admin.toObject(),
        "Admin details Fetched",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/:adminId")
  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedAdmin = await Admin.findByIdAndDelete(req.params.adminId);

      if (!deletedAdmin) {
        return next(
          new Exception("Admin not found", HttpStatusCode.HTTP_NOT_FOUND)
        );
      }

      return super.sendSuccessResponse(
        res,
        null,
        "Admin deleted successfully",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

}
