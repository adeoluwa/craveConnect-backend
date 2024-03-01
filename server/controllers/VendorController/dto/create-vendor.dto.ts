import Joi from "joi";
import { VendorAttributes } from "../../../interface/model.interface";

export const CreateVendorDto = Joi.object<VendorAttributes>({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  stateOfResidence: Joi.string().required(),
  password: Joi.string().required(),
});
