import { Controller, Post, Get, Put, Delete, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import Food from "../../models/Food";
import Order from "../../models/Order";
import { UserAuthGuard } from "../../guards/user.guard";
import HttpStatusCode from "../../helpers/HttpsResponse";
import Exception from "../../utils/ExceptionHandler";

@Controller("/api/v1/order")
@UseGuard(UserAuthGuard)
export default class OrderController extends RouteController {
  constructor() {
    super();
  }

  @Post("/make-order")
  async makeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const { foodItems } = req.body;

      let totalPrice = 0;

      const exisitingOrder = await Order.findOne({ userId, status: "pending" });

      /* This block of code is handling the logic for updating an existing order if one is found for the
      user. Here's a breakdown of what it does: */

      if (exisitingOrder) {
        for (const item of foodItems) {
          /* This line of code is finding an existing item in the `foodItems` array of the
          `exisitingOrder` object based on a condition. */
          const exisitingItem = exisitingOrder.foodItems.find(
            (i) => String(i.foodId) === String(item.foodId)
          );

          if (exisitingItem) {
            exisitingItem.quantity += item.quantity;
            const food = await Food.findById(item.foodId);

            if (!food) {
              return next(
                new Exception("Food not Found", HttpStatusCode.HTTP_NOT_FOUND)
              );
            }

            totalPrice += food.price * item.quantity;
          } else {
            const food = await Food.findById(item.foodId);

            if (!food) {
              return next(
                new Exception("Food not found", HttpStatusCode.HTTP_NOT_FOUND)
              );
            }

            exisitingOrder.foodItems.push({
              foodId: item.foodId,
              quantity: item.quantity,
            });
            totalPrice += food.price * item.quantity;
          }
        }

        exisitingOrder.totalPrice += totalPrice;
        await exisitingOrder.save();

        return super.sendSuccessResponse(
          res,
          exisitingOrder.toObject(),
          "Order updated",
          HttpStatusCode.HTTP_OK
        );
      }

      const mappedFoodItems = await Promise.all(
        foodItems.map(async (item) => {
          const foodObjectId = item.foodId;
          const food = await Food.findById(foodObjectId);

          if (!food) {
            throw new Exception("Food not Found", 404);
          }

          totalPrice += food.price * item.quantity;
          return { foodId: foodObjectId, quantity: item.quantity };
        })
      );

      const newOrder = await Order.create({
        userId,
        foodItems: mappedFoodItems,
        totalPrice,
        status: "pending",
      });

      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: newOrder._id } },
        { new: true }
      );

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

  @Get("/list-orders")
  async listUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;

      const user = await User.findById(userId);

      console.log("Present User:", user);

      const userOrder = await Order.find({ userId: user });

      console.log("user's order: ", userOrder);

      if (!userOrder) {
        return next(
          new Exception(
            "No order found for this user",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      return super.sendSuccessResponse(
        res,
        userOrder,
        "User's Orders retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/get-order/:orderId")
  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user?._id;

      const order = await Order.findOne({ _id: orderId, userId: userId });

      if (!order) {
        return next(
          new Exception("Order not found or owned by this user", 404)
        );
      }

      return super.sendSuccessResponse(
        res,
        { userOrder: order.toObject() },
        "User Order retrieved successfully",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {}
  }

  @Put("/update-order/:orderId")
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;
      const { foodItems } = req.body;

      let totalPrice = 0;

      const order = await Order.findOne({
        _id: orderId,
        userId,
        status: "pending",
      });

      if (!order) {
        return next(
          new Exception("Order does not exisit", HttpStatusCode.HTTP_NOT_FOUND)
        );
      }

      for (const item of foodItems) {
        const exisitingItemIndex = order.foodItems.findIndex(
          (i) => String(i.foodId) === String(item.foodId)
        );

        if (exisitingItemIndex !== -1) {
          const food = await Food.findById(item.foodId);
          if (!food) {
            return next(
              new Exception("Food not Found", HttpStatusCode.HTTP_NOT_FOUND)
            );
          }

          totalPrice += food.price * item.quantity;
          order.foodItems[exisitingItemIndex].quantity = item.quantity;
        } else {
          const food = await Food.findById(item.foodId);
          if (!food) {
            return next(
              new Exception("Food not Found", HttpStatusCode.HTTP_NOT_FOUND)
            );
          }

          totalPrice += food.price * item.quantity;
          order.foodItems.push({
            foodId: item.foodId,
            quantity: item.quantity,
          });
        }
      }

      order.totalPrice = totalPrice;
      await order.save();

      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { orders: order._id } },
        { new: true }
      );

      return super.sendSuccessResponse(
        res,
        order.toObject(),
        "Order updated successfully",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/remove-orderItem/:orderId")
  async removeItemFromOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const { orderId } = req.params;
      const { foodId } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        userId,
        status: "pending",
      });

      if (!order) {
        return next(
          new Exception("Order not found", HttpStatusCode.HTTP_NOT_FOUND)
        );
      }

      const index = order.foodItems.findIndex(
        (item) => String(item.foodId) === foodId
      );

      if (index === -1) {
        return next(new Exception("Item not found in order", 404));
      }

      const removedItem = order.foodItems.splice(index, 1)[0];

      const food = await Food.findById(removedItem.foodId);

      if (!food) {
        return next(new Exception("Food not found", 404));
      }

      order.totalPrice -= removedItem.quantity * food.price;

      await order.save();

      await User.findByIdAndUpdate(
        userId,
        { $pull: { orders: orderId } },
        { new: true }
      );

      return super.sendSuccessResponse(
        res,
        { updatedOrder: order.toObject() },
        "Order deleted successfully",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/:orderId")
  async deleteUserOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user?._id;

      const order = await Order.findOne({
        _id: orderId,
        userId,
        status: "pending",
      });

      if (!order) {
        return next(new Exception("Order not Found", 404));
      }

      await User.findByIdAndUpdate(
        userId,
        { $pull: { orders: order?._id } },
        { new: true }
      );

      const result = await Order.deleteOne({
        _id: orderId,
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
}
