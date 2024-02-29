import Joi from "joi";
import { UserAttributes } from "../../../interface/model.interface";

export const UpdateUserDto = Joi.object<UserAttributes>({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone: Joi.string().optional(),
  stateOfResidence: Joi.string().optional(),
  address: Joi.string().required(),
  password: Joi.string().required(),
});
