import { Router } from "express";

import { userController } from "./modules/User/user.router.js";

const router = Router();

router.use("/users", userController);

export default router;
