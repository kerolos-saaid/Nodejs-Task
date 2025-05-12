import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";
import { StatusCodes } from "http-status-codes";

export const createToken = (obj = {}, signature, expire_time) => {
  try {
    return jwt.sign(obj, signature, {
      expiresIn: expire_time,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Token creation failed",
      error
    );
  }
};

export const decodeToken = (token, signature) => {
  try {
    return jwt.verify(token, signature);
  } catch (error) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Token verification failed",
      error
    );
  }
};
