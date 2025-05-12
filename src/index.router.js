import { Router } from "express";

import userRoute from "./modules/User/user.route.js";
import authRoute from "./modules/auth/auth.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);

export default router;
