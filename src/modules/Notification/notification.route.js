import { Router } from "express";
import * as NotificationController from "./notification.controller.js";
import * as NotificationValidation from "./notification.validation.js";
import auth from "../../middlewares/auth.js";
import ROLES from "../Auth/AccessControl/roles.js";
import { validation } from "../../middlewares/validation.js";

const router = Router();

router.post(
  "/send-notification",
  auth([ROLES.ADMIN]),
  validation(NotificationValidation.sendNotification),
  NotificationController.sendNotification
);

router.post(
  "/register-token",
  auth([]),
  NotificationController.registerPushToken
);

router.post(
  "/send-push",
  auth([ROLES.ADMIN]),
  NotificationController.sendPushNotification
);

export default router;
