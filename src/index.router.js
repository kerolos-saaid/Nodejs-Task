import { Router } from "express";

import userRoute from "./modules/User/user.route.js";
import authRoute from "./modules/auth/auth.route.js";
import postRoute from "./modules/Post/post.route.js";
import notificationRoute from "./modules/Notification/notification.route.js"; // Added

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/posts", postRoute);
router.use("/notifications", notificationRoute); // Added

export default router;
