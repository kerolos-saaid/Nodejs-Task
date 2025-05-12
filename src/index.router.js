import { Router } from "express";

import userRoute from "./modules/User/user.route.js";
import authRoute from "./modules/auth/auth.route.js";
import postRoute from "./modules/Post/post.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/posts", postRoute);

export default router;
