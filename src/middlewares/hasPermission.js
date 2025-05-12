import { StatusCodes } from "http-status-codes";
import AsyncHandler from "../utils/AsyncHandler.js";

const hasPermission = (permissions) => {
  return AsyncHandler(async (req, res, next) => {
    const user = req.user;
    const hasPermission = permissions.some((permission) =>
      user.permissions.includes(permission)
    );
    if (!hasPermission) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  });
};

export default hasPermission;
