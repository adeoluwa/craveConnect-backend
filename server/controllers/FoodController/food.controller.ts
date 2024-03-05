import { Request, Response, NextFunction } from "express";
import { Controller, Delete, Post, Put, Get, UseGuard } from "../../decorators";
import Validator from "../../helpers/Validator";
import Exception from "../../utils/ExceptionHandler";
import { VendorAuthGuard, AdminAuthGuard } from "../../guards/index.guard";
import RouteController from "..";
import { CreateFoodDto, UpdateFoodDto } from "./dto";
import Food from "../../models/Food";

@Controller("/api/v1/food")
@UseGuard(VendorAuthGuard, AdminAuthGuard)
export default class FoodController extends RouteController {
  constructor() {
    super();
  }

  @Post("/upload-food")
  async uploadFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = CreateFoodDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const food = await Food.create(value);

      return super.sendSuccessResponse(
        res,
        food.toObject(),
        "Food Uploaded successfully",
        201
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/")
  async listFoods(req: Request, res: Response, next: NextFunction) {
    try {
      const foods = await Food.find();

      if (foods.length === 0) {
        return super.sendSuccessResponse(
          res,
          null,
          "food list is currently empty"
        );
      }

      return super.sendSuccessResponse(
        res,
        foods.map((food) => food.toObject())
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/:id")
  async getFood(req: Request, res: Response, next: NextFunction) {
    try {
      const food = await Food.findById(req.params.id);

      if (!food) {
        return next(new Exception("Food not found"));
      }

      return super.sendSuccessResponse(
        res,
        food.toObject(),
        "food details retrieved",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Put("/:id")
  async editFood(req: Request, res: Response, next: NextFunction) {
    try {
      const foodId = req.params.id;

      if (!foodId) {
        return next(new Exception("Id is required", 400));
      }
      const { error, value } = UpdateFoodDto.validate(req.body);

      if (!error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      const updatedFoodDetails = await Food.findByIdAndUpdate(foodId, value, {
        new: true,
      });

      if (!updatedFoodDetails) {
        return next(new Exception("food details not found", 404));
      }

      return super.sendSuccessResponse(
        res,
        updatedFoodDetails.toObject(),
        "Food Details Updated Successfully",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/:id")
  async deleteFood(req: Request, res: Response, next: NextFunction) {
    try {
      const foodId = req.params.id;
      const deletedFood = await Food.findByIdAndDelete(foodId);

      if (!deletedFood) {
        return next(new Exception("Food not found", 404));
      }
      return super.sendSuccessResponse(res, null, "food details deleted", 204);
    } catch (error) {
      return next(error);
    }
  }
}
