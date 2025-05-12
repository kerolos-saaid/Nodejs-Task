import { Router } from "express";
import auth from "../../middlewares/auth.js";
import hasPermission from "../../middlewares/hasPermission.js";
import PERMISSIONS from "../Auth/AccessControl/permissions.js";
import * as postController from "./post.controller.js";
import { validation } from "../../middlewares/validation.js";
import * as postValidation from "./post.validation.js";

const router = Router();

router.post(
  "/create",
  validation(postValidation.createPost),
  auth(),
  hasPermission([PERMISSIONS.CREATE_POST]),
  postController.createPost
);

router.delete(
  "/delete/:postId",
  validation(postValidation.deletePost),
  auth(),
  hasPermission([PERMISSIONS.DELETE_OWN_POST]),
  postController.deletePost
);

export default router;
