import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import Admin from "../../models/Admin";
// import Food from "../../models/Food";
import Order from "../../models/Order";
import { AdminAuthGuard } from "../../guards/admin.guard";
import User from "../../models/User";
import Review from "../../models/Review";
import Vendor from "../../models/Vendor";
import { EditAdminDto } from "./dto";
import HttpStatusCode from "../../helpers/HttpsResponse";
// import User from "../../models/User";
// import Vendor from "../../models/Vendor";
import Food from "../../models/Food";

@Controller("/api/v1/admin")
// @UseGuard(AdminAuthGuard)
export default class AdminController extends RouteController {
  constructor() {
    super();
  }

  @Put("/update-profile/:adminId")
  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      // const adminId = req.params.id;
      const adminId = req.params.adminId;

      const admin = await Admin.findById({ _id: adminId });

      if (!admin) {
        return next(
          new Exception("Admin not found", HttpStatusCode.HTTP_NOT_FOUND)
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

  @Get("/list-admin")
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

  @Get("/")
  async adminStats(req: Request, res: Response, next: NextFunction) {
    try {
      const totalUser = await User.countDocuments();
      const Vendors = await Vendor.countDocuments();
      const Orders = await Order.countDocuments();
      const Reviews = await Review.countDocuments();
      const foods = await Food.countDocuments();

      const formattedResponse = {
        "Total Users": totalUser,
        "Total Vendor": Vendors,
        "Total User Review": Reviews,
        "Total Order": Orders,
        "Total Food": foods,
      };

      return super.sendSuccessResponse(
        res,
        formattedResponse,
        "Admin stats feteched",
        200
      );
    } catch (error) {
      return next(error);
    }
  }
}
