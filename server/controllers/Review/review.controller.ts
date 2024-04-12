import { Controller, Post, Get, Put, Delete, UseGuard } from "../../decorators";

import RouteController from "..";
import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import Order from "../../models/Order";
import Food from "../../models/Food";
import Review from "../../models/Review";
import { UserAuthGuard } from "../../guards/user.guard";
import Exception from "../../utils/ExceptionHandler";
import { MakeReviewDto, UpdateReviewDto } from "./dto";
import Validator from "../../helpers/Validator";
import HttpStatusCode from "../../helpers/HttpsResponse";

@Controller("/api/v1/review")
@UseGuard(UserAuthGuard)
export default class ReviewController extends RouteController {
  constructor() {
    super();
  }

  @Post("/make-review")
  async makeReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = MakeReviewDto.validate(req.body);

      const userId = req.user?._id;
      value.userId = userId

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      // value.userId = userId;
      // console.log(value.user_Id)

      console.log(value)
      const review = await Review.create(value);

      await User.findByIdAndUpdate(
        userId,
        { $push: { reviews: review._id } },
        { new: true }
      );

      return super.sendSuccessResponse(
        res,
        review.toObject(),
        "review have been added",
        HttpStatusCode.HTTP_CREATED
      );
    } catch (error) {
      return next(error);
    }
  }

  @Put("/update-review/:id")
  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const reviewId = req.params.id;

      if (!reviewId) {
        return next(new Exception("Review ID is required", 400));
      }

      const { error, value } = UpdateReviewDto.validate(req.body);

      if (error) {
        return next(
          Validator.RequestValidatorError(
            error.details.map((error) => error.message)
          )
        );
      }

      // value.user_id = userId;

      const review = await Review.findOne({
        _id:reviewId,
        userId: value.userId,
        foodId: value.food_id,
      });

      // if (!review) {
      //   return next(new Exception("unauthorized access"));
      // }

      const updatedReview = await Review.findByIdAndUpdate(reviewId, value, {
        new: true,
      });


      if (!updatedReview) {
        return next(new Exception("review details not found"));
      }

      await User.findByIdAndUpdate(userId,{$set:{reviews:updatedReview}},{new:true})

      return super.sendSuccessResponse(
        res,
        updatedReview.toObject(),
        "Review details updated Successfully",
        200
      );
    } catch (error) {
      return next(error);
    }
  }

  @Delete("/delete-review/:reviewId")
  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const userId = req.user?._id;

      const review = await Review.findOne({ _id: reviewId, user_id: userId });

      if (!review) {
        return next(
          new Exception(
            "This review does not exist or unauthorized access",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }

      await User.findByIdAndUpdate(
        userId,
        { $pull: { reviews: reviewId } },
        { new: true }
      );

      const deletedReview = await Review.findByIdAndDelete(reviewId);

      return super.sendSuccessResponse(
        res,
        { deletedReview: deletedReview.toObject() },
        "your review have been deleted",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }

  @Get("/list-reviews")
  async listReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;

      const reviews = await Review.find({ userId: userId });

      if (!reviews) {
        return next(
          new Exception(
            "User haven't reviewed any food yet",
            HttpStatusCode.HTTP_NOT_FOUND
          )
        );
      }
  
      return super.sendSuccessResponse(
        res,
        reviews.map((review) => review.toObject()),
        "User's reviewes retrieved",
        HttpStatusCode.HTTP_OK
      );
    } catch (error) {
      return next(error);
    }
  }
}
