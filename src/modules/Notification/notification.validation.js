import Joi from 'joi';

export const sendToUserSchema = Joi.object({
  userId: Joi.string().required(),
  eventName: Joi.string().required(),
  data: Joi.object().required(),
});

export const sendToMultipleUsersSchema = Joi.object({
  userIds: Joi.array().items(Joi.string()).min(1).required(),
  eventName: Joi.string().required(),
  data: Joi.object().required(),
});

export const sendToAllSchema = Joi.object({
  eventName: Joi.string().required(),
  data: Joi.object().required(),
});
