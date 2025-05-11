import jwt from "jsonwebtoken";
import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

export const createToken = async (obj = {}, signature, expire_time) => {
  return jwt.sign(obj, signature, { expiresIn: expire_time }, (err, token) => {
    if (err) {
      throw new ApiError(
        "Error generating authentication token",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return token;
  });
};

export const decodeToken = async (token, signature) => {
  return jwt.verify(token, signature, (err, decoded) => {
    if (err) {
      throw new ApiError(
        "Invalid or expired authentication token",
        StatusCodes.UNAUTHORIZED
      );
    }
    return decoded;
  });
};
