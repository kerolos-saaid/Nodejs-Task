import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import * as TokenService from "../modules/shared/services/token.service.js";
import prisma from "../prisma/prisma.js";
import { userSockets } from "../modules/shared/services/notification.service.js";

const authenticateUser = async (token, roles = []) => {
  if (!token || !token.startsWith("Bearer ")) {
    throw new Error("Access denied. No token provided.");
  }

  const tokenValue = token.split(" ")[1];
  const decoded = TokenService.decodeAuthToken(tokenValue);

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw new Error("User associated with this token no longer exists");
  }

  if (roles.length && !roles.includes(user.role)) {
    throw new Error("Access denied. You do not have the required permissions.");
  }

  return user;
};

const auth = (roles = []) =>
  AsyncHandler(async (req, _, next) => {
    try {
      const user = await authenticateUser(req.headers.authorization, roles);
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, StatusCodes.UNAUTHORIZED);
    }
  });

export const socketAuth = (roles = []) => {
  return async (socket, next) => {
    try {
      const user = await authenticateUser(socket.handshake.auth.token, roles);
      socket.user = {
        id: user.id,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      };
      next();
    } catch (error) {
      next(error.message);
    }
  };
};
export default auth;
