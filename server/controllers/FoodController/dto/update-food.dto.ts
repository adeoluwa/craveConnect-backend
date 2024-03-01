import Joi from "joi";
import { FoodAttributes } from "../../../interface/model.interface";

export const UpdateFoodDto = Joi.object<FoodAttributes>({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  recipes: Joi.string().optional(),
  price: Joi.number().optional(),
  avaliableFrom: Joi.date().optional(),
  avaliableTo: Joi.date().optional(),
  vendorId: Joi.string().required(),
});
