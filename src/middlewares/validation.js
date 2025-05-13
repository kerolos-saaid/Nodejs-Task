import joi from "joi";
const dataMethods = ["body", "params", "query", "headers", "file", "files"];

export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      // tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi.string().min(8).max(30),
  name: joi.string().min(3).max(30),
  // token validation regex for JWT with Bearer prefix
  token: joi
    .string()
    .regex(/^Bearer [A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/),
  id: joi
    .number()
    .required()
    .custom((value, helpers) => {
      if (isNaN(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationError.push(validationResult.error.details);
        }
      }
    });

    if (validationError.length) {
      return res.json({ message: "Validation Error", validationError });
    }
    return next();
  };
};
