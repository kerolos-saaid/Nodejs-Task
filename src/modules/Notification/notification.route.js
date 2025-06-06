import express from 'express';
import * as notificationController from './notification.controller.js';
import { validationMiddleware } from '../../middlewares/validation.js'; // Assuming this path
import * as schemas from './notification.validation.js';
import auth from '../../middlewares/auth.js'; // Added
import { hasPermission } from '../../middlewares/hasPermission.js'; // Added


const router = express.Router();

router.post(
  '/send-to-user',
  auth(), // Added
  hasPermission(['send_notifications']), // Added
  validationMiddleware(schemas.sendToUserSchema),
  notificationController.httpSendToUser
);

router.post(
  '/send-to-multiple-users',
  auth(), // Added
  hasPermission(['send_notifications']), // Added
  validationMiddleware(schemas.sendToMultipleUsersSchema),
  notificationController.httpSendToMultipleUsers
);

router.post(
  '/send-to-all',
  auth(), // Added
  hasPermission(['send_notifications']), // Added
  validationMiddleware(schemas.sendToAllSchema),
  notificationController.httpSendToAll
);

export default router;
