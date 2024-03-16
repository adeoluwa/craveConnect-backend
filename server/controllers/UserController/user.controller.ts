import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import User from "../../models/User";
import { UserAuthGuard } from "../../guards/user.guard";
import { CreateUserDto, SignInDto, UpdateUserDto } from "./dto";
import Helper from "../../helpers";
import { AdminAuthGuard } from "../../guards/admin.guard";

@Controller("/api/v1/user")
export default class UserController extends RouteController {
  constructor() {
    super();
  }

  @Post("/")
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
      return super.sendSuccessResponse(res, user.toObject(), null, 201);
    } catch (error) {
      return next(error);
    }
  }

  @Post("/login")
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
        return next(new Exception("User not found", 404));
      }

      const isPasswordValid = await Helper.correctPassword(
        value.password,
        user.password
      );

      if (!isPasswordValid) {
        return next(
          new Exception("Invalid credentials, pls check and try again")
        );
      }

      const { token } = Helper.signToken({
        email: user.email,
        _id: user._id,
      });

      console.log(user.toObject());

      return super.sendSuccessResponse(res, {
        accessToken: token,
        user: Helper.omitProperties(
          user.toObject(),
          "password",
          "createdAt",
          "updateAt"
        ),
      });
    } catch (error) {
      return next(error);
    }
  }

  @Get("/:id")
  @UseGuard(UserAuthGuard)
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

  @Get("/list-users")
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find();

      if (users.length === 0) {
        return super.sendSuccessResponse(
          res,
          null,
          "users list is currently empty"
        );
      }

      return super.sendSuccessResponse(
        res,
        users.map((user) => user.toObject())
      );
    } catch (error) {
      return next(error);
    }
  }

  @Put("/:userId")
  @UseGuard(UserAuthGuard)
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
  @UseGuard(AdminAuthGuard)
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
