import { Router } from "express";
import * as userController from "./user.controller.js";
import auth from "../../middlewares/auth.js";
import ROLES from "../Auth/AccessControl/roles.js";
import { validation } from "../../middlewares/validation.js";
import * as userValidation from "./user.validation.js";

const router = Router();

router.put(
  "/grant_permissions/:userId",
  validation(userValidation.updateUserPermissionsSchema),
  auth(ROLES.ADMIN),
  userController.grantPermissions
);

router.put(
  "/revoke_permissions/:userId",
  validation(userValidation.updateUserPermissionsSchema),
  auth(ROLES.ADMIN),
  userController.revokedPermissions
);

export default router;
