import Joi from "joi";
import { UserReviewsAttributes } from "../../../interface/model.interface";

export const MakeReviewDto = Joi.object<UserReviewsAttributes>({
  userId: Joi.string().required(),
  foodId: Joi.string().required(),
  comment: Joi.string().required(),
  rating: Joi.number().required(),
}).options({ abortEarly: false });

export const UpdateReviewDto = Joi.object<UserReviewsAttributes>({
  foodId: Joi.string().required(),
  userId: Joi.string().required(),
  comment: Joi.string().optional(),
  rating: Joi.number().optional(),
}).options({ abortEarly: false });
