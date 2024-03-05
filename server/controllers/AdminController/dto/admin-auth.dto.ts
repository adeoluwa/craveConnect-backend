import Joi from "joi";

export const LoginDto = Joi.object<{email:string; password:string}>({
    email:Joi.string().email().required(),
    password:Joi.string().required()
})