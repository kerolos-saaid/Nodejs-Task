import { StatusCodes } from "http-status-codes";
import AsyncHandler from "../../utils/AsyncHandler.js"; // Added .js extension
import * as userService from "./user.service.js"; // Added import for userService

export const grantPermissions = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { permissions } = req.body;
  const user = await userService.grantPermissions(userId, permissions);
  res
    .status(StatusCodes.OK)
    .json({ message: "Permissions granted successfully", user });
});

export const revokedPermissions = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { permissions } = req.body;
  const user = await userService.revokePermissions(userId, permissions); // Assuming takePermissions service exists
  res
    .status(StatusCodes.OK)
    .json({ message: "Permissions revoked successfully", user });
});
