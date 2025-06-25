import { StatusCodes } from "http-status-codes";
import * as NotificationService from "./notification.service.js";
import { asyncHandler } from "../../utils/ErrorHandler.js";

export const sendNotification = asyncHandler(async (req, res, next) => {
  const { recipientUserIds, message } = req.body;
  await NotificationService.sendNotification(recipientUserIds, message);

  return res
    .status(StatusCodes)
    .json({ message: "Notification sent successfully." });
});

export const registerPushToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const userId = req.user.id;

  await NotificationService.registerPushToken(userId, token);

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Push token registered successfully." });
});

export const sendPushNotification = asyncHandler(async (req, res, next) => {
  const { recipientUserIds, message } = req.body;
  await NotificationService.sendNotification(recipientUserIds, message);

  return res
    .status(StatusCodes.OK)
    .json({ message: "Push notification sent successfully." });
});
