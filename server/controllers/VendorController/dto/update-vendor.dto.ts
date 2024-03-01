import Joi from "joi";
import { VendorAttributes } from "../../../interface/model.interface";

export const UpdateVendorDto = Joi.object<VendorAttributes>({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  password: Joi.string().optional(),
  stateOfResidence: Joi.string().optional(),
});
