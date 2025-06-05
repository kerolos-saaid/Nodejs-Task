import { StatusCodes } from "http-status-codes";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const hasPermission = (user, permissions) => {
  const hasPermission = permissions.some((permission) =>
    user.permissions.includes(permission)
  );
  return hasPermission;
};

export const hasPermissionExpress = (permissions) => {
  return AsyncHandler((req, _, next) => {
    const hasPermissions = hasPermission(req.user, permissions);
    if (!hasPermissions) {
      throw new ApiError(
        "Access denied. You do not have the required permissions.",
        StatusCodes.FORBIDDEN
      );
    }
    next();
  });
};

export default hasPermissionExpress;
