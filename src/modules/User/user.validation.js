import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";
import PERMISSIONS from "../Auth/AccessControl/permissions.js";

export const updateUserPermissionsSchema = {
  params: joi.object().required().keys({
    userId: generalFields.id.required(),
  }),
  body: joi.object({
    permissions: joi
      .array()
      .items(
        joi.string().valid(...Object.keys(PERMISSIONS)) // Ensures each item is a string and is present in the PERMISSIONS array
      )
      .min(1)
      .required(),
  }),
  headers: joi
    .object({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};
