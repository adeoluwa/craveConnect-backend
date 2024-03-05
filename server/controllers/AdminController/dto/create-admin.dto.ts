import Joi from "joi";

import { AdminAttributes } from "../../../interface/model.interface";

export const CreateAdminDto = Joi.object<AdminAttributes>({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  location: Joi.string().required(),
  stateOfResidence: Joi.string().required(),
});
