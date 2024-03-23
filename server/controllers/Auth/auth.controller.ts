import { Controller, Delete, Put, Get, Post } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Admin from "../../models/Admin";
import User from "../../models/User";
import Vendor from "../../models/Vendor";
import { CreateAdminDto, LoginDto } from "../AdminController/dto";
import { CreateUserDto, SignInDto } from "../UserController/dto";
import { CreateVendorDto, VendorSignInDto } from "../VendorController/dto";
import Helper from "../../helpers";
import Exception from "../../utils/ExceptionHandler";
import HttpStatusCode from "../../helpers/HttpsResponse";

@Controller("/api/v1/auth")
export default class AuthController extends RouteController {
  constructor() {
    super();
  }

  /// User
  @Post("/user")
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = CreateUserDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const user = await User.create(value);
      return super.sendSuccessResponse(
        res,
        user.toObject(),
        null,
        HttpStatusCode.HTTP_CREATED
      );
    } catch (error) {
      return next(error);
    }
  }

  @Post("/user-login")
  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = SignInDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const user = await User.findOne({ email: req.body.email }).select(
        "-createAt -updatedAt"
      );

      if (!user) {
        return next(
          new Exception("User not found", HttpStatusCode.HTTP_NOT_FOUND)
        );
      }

      const isPasswordValid = await Helper.correctPassword(
        value.password,
        user.password
      );

      if (!isPasswordValid) {
        return next(new Exception("Invalid Credentials"));
      }

      const { token } = Helper.signToken({
        email: user.email,
        id: user._id,
      });

      console.log(user.toObject());

      return super.sendSuccessResponse(
        res,
        {
          accessToken: token,
          user: Helper.omitProperties(
            user.toObject(),
            "password",
            "createdAt",
            "updatedAt"
          ),
        },
        "User logged In successfully",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  // Vendor

  @Post("/vendor")
  async createvendor(req: Request, res: Response, next: NextFunction) {
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

      return super.sendSuccessResponse(
        res,
        vendor.toObject(),
        "Vendor's account created successfully",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Post("/vendor-login")
  async VendorLogin(req: Request, res: Response, next: NextFunction) {
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
        return next(
          new Exception(
            "Vendor account not found",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      const isPasswordValid = await Helper.correctPassword(
        value.password,
        vendor.password
      );

      if (!isPasswordValid) {
        return next(
          new Exception("Invalid Credentials", HttpStatusCode.HTTP_BAD_REQUEST)
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

  // Admin
  @Post("/admin")
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = CreateAdminDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const admin = await Admin.create(value);
      return super.sendSuccessResponse(
        res,
        admin.toObject(),
        "Admin profile created",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Post("/admin-login")
  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = LoginDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const admin = await Admin.findOne({ email: req.body.email });

      if (!admin) {
        return next(
          new Exception(
            "Admin account not found",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      const isPasswordValid = await Helper.correctPassword(
        value.password,
        admin.password
      );

      if (!isPasswordValid) {
        return next(
          new Exception("Invalid credentials", HttpStatusCode.HTTP_BAD_REQUEST)
        );
      }

      const { token } = Helper.signToken({
        email: admin.email,
        _id: admin._id,
      });

      console.log(admin.toObject());

      return super.sendSuccessResponse(res, {
        accessToken: token,
        admin: Helper.omitProperties(
          admin.toObject(),
          "password",
          "createdAt",
          "updatedAt"
        ),
      });
    } catch (error) {
      return next(error);
    }
  }
}

// 