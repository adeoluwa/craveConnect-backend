import Joi from "joi";

import { AdminAttributes } from "../../../interface/model.interface";

export const EditAdminDto = Joi.object<AdminAttributes>({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone: Joi.string().optional(),
  location: Joi.string().optional(),
  stateOfResidence: Joi.string().optional(),
});
