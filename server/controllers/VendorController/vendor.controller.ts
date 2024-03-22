import { Controller, Get, Post, Put, Delete, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import Vendor from "../../models/Vendor";
import { VendorAuthGuard } from "../../guards/vendor.guard";
import { UpdateVendorDto } from "./dto";
import { AdminAuthGuard } from "../../guards/admin.guard";
import HttpStatusCode from "../../helpers/HttpsResponse";

@Controller("/api/v1/vendor")
export default class VendorController extends RouteController {
  constructor() {
    super();
  }

  @Get("/vendors")
  async listVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await Vendor.find({});

      if (vendors.length === 0) {
        return super.sendSuccessResponse(
          res,
          { vendors: vendors.length },
          "Vendor list is empty",
          HttpStatusCode.HTTP_OK
        );
      }

      console.log(vendors);

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

  @Put("/:vendorId")
  @UseGuard(VendorAuthGuard)
  async updateVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UpdateVendorDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const vendor = await Vendor.findByIdAndUpdate(
        req.params.vendorId,
        value,
        { new: true }
      );

      if (!vendor) {
        return next(new Exception("Vendor with that Id, does not exist", 404));
      }

      return super.sendSuccessResponse(res, vendor.toObject());
    } catch (error) {
      return next(error);
    }
  }

  @Get("/:vendorId")
  async getVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await Vendor.findById(req.params.vendorId);

      if (!vendor) {
        return next(new Exception("Vendor not found", 404));
      }

      return super.sendSuccessResponse(res, vendor.toObject());
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/:vendorId")
  @UseGuard(VendorAuthGuard)
  async deleteVendorProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedVendor = await Vendor.findByIdAndDelete(req.params.vendorId);

      if (!deletedVendor) {
        return next(new Exception("Vendor not found", 404));
      }

      return super.sendSuccessResponse(res, null, null, 204);
    } catch (error) {
      return next(error);
    }
  }

  // creating Food

  @Post("/creat-food")
  async createFood(req:Request, res:Response, next:NextFunction){
    try {
      
    } catch (error) {
      return next(error)
    }
  }
}
