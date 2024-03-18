import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import User from "../../models/User";
import { UserAuthGuard } from "../../guards/user.guard";
import { UpdateUserDto } from "./dto";


@Controller("/api/v1/user")
@UseGuard(UserAuthGuard)
export default class UserController extends RouteController {
  constructor() {
    super();
  }

  @Get("/:id")
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
  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UpdateUserDto.validate(req.body);

      if (!error) {
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
}
