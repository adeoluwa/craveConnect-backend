import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import Admin from "../../models/Admin";
import { AdminAuthGuard } from "../../guards/index.guard";
import { EditAdminDto } from "./dto";
import HttpStatusCode from "../../helpers/HttpsResponse";
import User from "../../models/User";
import Vendor from "../../models/Vendor";
import Food from "../../models/Food";

@Controller("/api/v1/admin")
@UseGuard(AdminAuthGuard)
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

  // lIST  Actions

  @Get("/list-users")
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find();

      if (users.length === 0) {
        return super.sendSuccessResponse(res, null, "users list is empty");
      }

      return super.sendSuccessResponse(
        res,
        users.map((user) => user.toObject()),
        "users details retrived",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/list-vendor")
  async listVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await Vendor.find();

      if (vendors.length === 0) {
        return super.sendSuccessResponse(
          res,
          { vendors: vendors.length },
          "Vendor list is empty",
          HttpStatusCode.HTTP_OK
        );
      }

      return super.sendSuccessResponse(
        res,
        vendors.map((vendor) => vendor.toObject()),
        "Vendors details retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/list-food")
  async listFood(req: Request, res: Response, next: NextFunction) {
    try {
      const foods = await Food.find();

      if (foods.length === 0) {
        return super.sendSuccessResponse(
          res,
          { avaliable_foods_for_order: foods.length },
          "Foods details successfully retrieved",
          HttpStatusCode.HTTP_OK
        );
      }

      return super.sendSuccessResponse(
        res,
        foods.map((food) => food.toObject()),
        "Foods details retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }
}
