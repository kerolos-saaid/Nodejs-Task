import * as notificationService from './notification.service.js';
import AsyncHandler from '../../utils/AsyncHandler.js'; // Assuming this path

export const httpSendToUser = AsyncHandler(async (req, res, next) => {
  const { userId, eventName, data } = req.body;
  notificationService.sendToUser(userId, eventName, data);
  res.status(200).json({ message: `Notification attempt to user ${userId} was successful.` });
});

export const httpSendToMultipleUsers = AsyncHandler(async (req, res, next) => {
  const { userIds, eventName, data } = req.body;
  notificationService.sendToMultipleUsers(userIds, eventName, data);
  res.status(200).json({ message: 'Notification attempt to multiple users was successful.' });
});

export const httpSendToAll = AsyncHandler(async (req, res, next) => {
  const { eventName, data } = req.body;
  notificationService.sendToAll(eventName, data);
  res.status(200).json({ message: 'Notification attempt to all users was successful.' });
});
