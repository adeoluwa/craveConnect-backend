import { Controller, Get, Post, Put, Delete, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import Vendor from "../../models/Vendor";
import { VendorAuthGuard } from "../../guards/vendor.guard";
import { CreateVendorDto, UpdateVendorDto, VendorSignInDto } from "./dto";
import Helper from "../../helpers";
import { AdminAuthGuard } from "../../guards/admin.guard";

@Controller("/api/v1/vendor")
export default class VendorController extends RouteController {
  constructor() {
    super();
  }

  @Post("/")
  async createVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = CreateVendorDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const vendor = await Vendor.create(value);
      return super.sendSuccessResponse(res, vendor.toObject(), null, 201);
    } catch (error) {
      return next(error);
    }
  }

  @Post("/login")
  async vendorLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = VendorSignInDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const vendor = await Vendor.findOne({ email: req.body.email }).select(
        "-createdAt -updatedAt"
      );

      if (!vendor) {
        return next(new Exception("Vendor not found", 404));
      }

      const isPasswordValid = await Helper.correctPassword(
        value.password,
        vendor.password
      );

      if (!isPasswordValid) {
        return next(
          new Exception("Invalid Credentials, pls check and try again")
        );
      }

      const { token } = Helper.signToken({
        email: vendor.email,
        _id: vendor._id,
      });

      console.log(vendor.toObject());

      return super.sendSuccessResponse(res, {
        accessToken: token,
        user: Helper.omitProperties(
          vendor.toObject(),
          "password",
          "createdAt",
          "updatedAt"
        ),
      });
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

  @Get("/list-vendor")
  async listVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await Vendor.find();

      if (vendors.length === 0) {
        return super.sendSuccessResponse(
          res,
          null,
          "Vendors list is currently empty, Onboard some will you?"
        );
      }

      return super.sendSuccessResponse(
        res,
        vendors.map((vendor) => vendor.toObject())
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/:vendorId")
  @UseGuard(AdminAuthGuard)
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
}
