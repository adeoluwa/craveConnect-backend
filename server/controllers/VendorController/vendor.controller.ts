import { Controller, Get, Post, Put, Delete, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import Vendor from "../../models/Vendor";
import Review from "../../models/Review";
import { VendorAuthGuard } from "../../guards/vendor.guard";
import { UpdateVendorDto } from "./dto";
import { AdminAuthGuard } from "../../guards/admin.guard";
import HttpStatusCode from "../../helpers/HttpsResponse";
import Food from "../../models/Food";
import User from "../../models/User";
import mongoose from "mongoose";

interface FoodItemResponse {
  foodId: {
    _id: string;
    name: string;
    price: string;
  };

  quantity: number;
}

interface OrderResponse {
  _id: string;
  foodItems: FoodItemResponse[];
}

interface UserResponse {
  _id: string;
  firstname: string;
  lastnamee: string;
  email: string;
  phone: string;
  orders: OrderResponse[];
}

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

  @Get("/list-food")
  @UseGuard(VendorAuthGuard)
  async listVendorsFoods(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.vendor?._id;

      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        return next(new Exception("Vendor does not exist", 404));
      }

      const foods = await Food.find({ vendorId: vendor._id });

      if (!foods) {
        return next(
          new Exception(
            "No Food record found for this vendor",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      return super.sendSuccessResponse(
        res,
        foods.map((food) => food.toObject()),
        "Vendor's food retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/list-reviews/:foodId")
  @UseGuard(VendorAuthGuard)
  async listFoodReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.vendor?._id;

      const { foodId } = req.params;

      if (!foodId) {
        return next(
          new Exception("FoodId is required", HttpStatusCode.HTTP_BAD_REQUEST)
        );
      }

      const food = await Food.find({ _id: foodId, vendorId: vendorId });
      if (!food) {
        return next(
          new Exception("Food Record not Found!", HttpStatusCode.HTTP_NOT_FOUND)
        );
      }

      const review = await Review.find({ food_id: foodId });

      return super.sendSuccessResponse(
        res,
        { FoodItem: food, review: review, vendorId },
        "Reviews Retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/list-customers/:vendorId")
  @UseGuard(VendorAuthGuard)
  async listCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.params.vendorId;
      console.log("Vendor ID", vendorId);

      const vendor = await Vendor.findById(vendorId);
      console.log(vendor);

      if (!vendor) {
        return next(new Exception("No such Vendor", 404));
      }

      const usersWithOrdersAndFoodItems = await User.find({})
        .populate({
          path: "orders",
          populate: {
            path: "foodItems.foodId",
            model: "Food",
            select: "name price vendorId",
          },
        })
        .exec();

      console.log(usersWithOrdersAndFoodItems);

      const transformedUsers = usersWithOrdersAndFoodItems.map((user) => ({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        orders: user.orders,
      }));

      return super.sendSuccessResponse(
        res,
        transformedUsers,
        "Customers data retrieved",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/vendor-dashboard/:vendorId")
  @UseGuard(VendorAuthGuard)
  async vendorDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.params.vendorId;

      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return next(new Exception("Vendor does not exisit", 404));
      }

      // console.log("vendorID: ", vendor._id)
      // console.log(vendorId)

      const foods = await Food.find({ vendorId: vendorId });

      if (!foods) {
        return next(
          new Exception(
            "No record found for this vendor",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      // const totalFood = await Food.countDocuments({ vendorId: vendor._id });
      const totalFood = foods.length;

      let totalCustomers = 0;

      // const uniqueCustomer = new Set();
      // foods.forEach((food) => {
      //   uniqueCustomer.add(food.boughtBy.toString());
      // });
      // const uniqueCustomer = new Set(foods.map(food => food.boughtBy))
      const uniqueCustomer = new Set();
      foods.forEach((food) => {
        uniqueCustomer.add(food.boughtBy.toString());
      });

      totalCustomers = uniqueCustomer.size;

      const totalReviews = await Review.countDocuments({
        foodId: { $in: foods.map((food) => food._id) },
      });

      const formattedResponse = {
        "Vendor's ID": vendorId,
        "Total Food": totalFood,
        Customers: totalCustomers,
        Reviews: totalReviews,
      };

      return super.sendSuccessResponse(
        res,
        formattedResponse,
        "Vendor's Stats retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/reviews/:vendorId")
  async listReviewsForVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.params.vendorId;

      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        return next(new Exception("Vendor does not exisit", 404));
      }

      const foods = await Food.find({ vendorId: vendorId });
      if (!foods || foods.length === 0) {
        return next(new Exception("No Food record found for this vendor", 404));
      }

      const reviews = await Review.find({
        foodId: { $in: foods.map((food) => food._id) },
      });

      const formattedResponse = {
        "Vendor's ID": vendor._id,
        Reviews: reviews.map((review) => ({
          "Review ID": review._id,
          "Food ID": review.foodId,
          Comment: review.comment,
          Rating: review.rating,
        })),
      };

      return super.sendSuccessResponse(
        res,
        formattedResponse,
        "Reviews for vendor's foods retrieved",
        200
      );
    } catch (error) {
      return next(error);
    }
  }
}
