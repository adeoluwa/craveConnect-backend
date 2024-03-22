import Joi from "joi";

export const SignInDto = Joi.object<{ email: string; password: string }>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });
