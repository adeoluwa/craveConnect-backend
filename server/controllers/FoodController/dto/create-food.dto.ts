import Joi from "joi";
import { FoodAttributes } from "../../../interface/model.interface";

export const CreateFoodDto = Joi.object<FoodAttributes>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  recipes: Joi.string().required(),
  price: Joi.number().required(),
  avaliableFrom: Joi.date().required(),
  avaliableTo: Joi.date().required(),
  vendorId: Joi.string().required(),
});
