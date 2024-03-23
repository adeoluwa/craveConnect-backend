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

  @Post("/add-to-order")
  @UseGuard(UserAuthGuard)
  async addFoodToOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { foodItems } = req.body;

      let totalPrice = 0;

      const mappedFoodItems = await Promise.all(
        foodItems.map(async (item) => {
          const foodObjectId = item.foodId;
          const food = await Food.findById(foodObjectId);

          if (!food) {
            throw new Exception("Food not found", 404);
          }

          totalPrice += food.price * item.quantity;
          return { foodId: foodObjectId, quantity: item.quantity };
        })
      );

      const newOrder = new Order({
        userId,
        foodItems: mappedFoodItems,
        totalPrice,
        status: "pending",
      });

      await newOrder.save();

      return super.sendSuccessResponse(
        res,
        newOrder.toObject(),
        "Order created",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Put("/orders/:orderId")
  @UseGuard(UserAuthGuard)
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;
      const { status } = req.body;

      const order = await Order.findOneAndUpdate(
        {
          _id: orderId,
          userId: userId,
        },
        { status },
        { new: true }
      );

      if (!order) {
        return next(
          new Exception("Order not found or not owned by this user", 404)
        );
      }

      return super.sendSuccessResponse(
        res,
        order.toObject(),
        "Order updated successfully",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/orders/:orderId")
  @UseGuard(UserAuthGuard)
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;

      const result = await Order.deleteOne({
        _id: orderId,
        userId: userId,
      });

      if (result.deletedCount === 0) {
        return next(
          new Exception("Order not found or not owned by this user", 404)
        );
      }

      return super.sendSuccessResponse(
        res,
        null,
        "Order deleted successfully",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/orders/:orderId")
  @UseGuard(UserAuthGuard)
  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        userId: userId,
      });

      if (!order) {
        return next(
          new Exception("Order not found or owned by this user", 404)
        );
      }

      return super.sendSuccessResponse(
        res,
        order.toObject(),
        "Order retrieved successfully"
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/orders")
  @UseGuard(UserAuthGuard)
  async listUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;

      const orders = await Order.find({ userId: userId });

      if (!orders) {
        return next(new Exception("No order found for this user", 404));
      }

      return super.sendSuccessResponse(
        res,
        orders.map((order) => order.toObject()),
        "User orders retrived"
      );
    } catch (error) {
      return next(error);
    }
  }
}
