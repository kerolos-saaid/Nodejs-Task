import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import * as TokenService from "../modules/shared/services/token.service.js";
import prisma from "../prisma/prisma.js";

const auth = (roles = []) =>
  AsyncHandler(async (req, _, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        "Access denied. No token provided.",
        StatusCodes.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify and decode token
      const decoded = TokenService.decodeAuthToken(token);

      // Get user from token

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        throw new ApiError(
          "User associated with this token no longer exists",
          StatusCodes.NOT_FOUND
        );
      }

      // Check if user has the required role
      if (roles.length && !roles.includes(user.role)) {
        throw new ApiError(
          "Access denied. You do not have the required permissions.",
          StatusCodes.FORBIDDEN
        );
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        "Invalid or expired authentication token",
        StatusCodes.UNAUTHORIZED
      );
    }
  });

export default auth;
