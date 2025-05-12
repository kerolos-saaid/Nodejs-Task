import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validation } from "../../middlewares/validation.js";
import * as authValidations from "./auth.validation.js";

const router = Router();

router.post(
  "/signup",
  validation(authValidations.signup),
  authController.signup
);

router.post("/login", validation(authValidations.login), authController.login);

export default router;
