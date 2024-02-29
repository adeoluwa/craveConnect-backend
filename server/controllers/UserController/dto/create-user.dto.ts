import Joi from "joi";
import { UserAttributes } from "../../../interface/model.interface";

export const CreateUserDto = Joi.object<UserAttributes>({
    firstname:Joi.string().required(),
    lastname:Joi.string().required(),
    email:Joi.string().required(),
    phone:Joi.string().required(),
    stateOfResidence:Joi.string().required(),
    address:Joi.string().required(),
    password:Joi.string().required()
})