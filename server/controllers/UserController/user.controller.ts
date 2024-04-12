import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import User from "../../models/User";
import Food from "../../models/Food";
import Order from "../../models/Order";
import { UserAuthGuard } from "../../guards/user.guard";
import { UpdateUserDto } from "./dto";
import HttpStatusCode from "../../helpers/HttpsResponse";
import mongoose, { Types } from "mongoose";

@Controller("/api/v1/user")
// @UseGuard(UserAuthGuard)
export default class UserController extends RouteController {
  constructor() {
    super();
  }

  @Get("/users")
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
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/:id")
  // @UseGuard(UserAuthGuard)
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.userId);

      if (!user) {
        return next(new Exception("user not found", 404));
      }

      return super.sendSuccessResponse(res, user.toObject());
    } catch (error) {
      return next(error);
    }
  }

  @Put("/:userId")
  @UseGuard(UserAuthGuard)
  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UpdateUserDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const user = await User.findByIdAndUpdate(req.params.userId, value, {
        new: true,
      });

      if (!user) {
        return next(new Exception("User not found", 404));
      }

      return super.sendSuccessResponse(res, user.toObject());
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/:userId")
  @UseGuard(UserAuthGuard)
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);

      if (!deletedUser) {
        return next(new Exception("User not found", 404));
      }

      return super.sendSuccessResponse(res, null, null, 204);
    } catch (error) {
      return next(error);
    }
  }

  //TODO: Implement add food to user cart/order, user's food review, and report

}
