import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const sendNotification = {
  body: joi
    .object()
    .required()
    .keys({
      recipientUserIds: joi
        .array()
        .items(generalFields.id.required())
        .required(),
      message: joi.string().required(),
    }),
  headers: joi
    .object({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};

export const registerPushToken = {
  body: joi.object().required().keys({
    token: generalFields.token.required(),
  }),
  headers: joi
    .object({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};

export const sendPushNotification = {
  body: joi
    .object()
    .required()
    .keys({
      recipientUserIds: joi.array().items(joi.string()).required(),
      message: joi.string().required(),
    }),
  headers: joi
    .object({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};
