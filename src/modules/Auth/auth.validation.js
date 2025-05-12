import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const signup = {
  body: joi.object().required().keys({
    name: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};

export const login = {
  body: joi.object().required().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};
