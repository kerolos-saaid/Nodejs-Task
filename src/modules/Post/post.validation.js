import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const createPost = {
  body: joi.object().required().keys({
    title: joi.string().required(),
    content: joi.string().required(),
    public: joi.boolean().strict().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};

export const deletePost = {
  params: joi
    .object()
    .required()
    .keys({
      postId: joi
        .number()
        .required()
        .custom((value, helpers) => {
          if (isNaN(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};
