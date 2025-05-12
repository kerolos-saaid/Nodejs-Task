import AsyncHandler from "../../utils/AsyncHandler.js";
import * as userService from "../User/user.service.js";
import * as authService from "./auth.service.js";
import * as tokenService from "../shared/services/token.service.js";
import { StatusCodes } from "http-status-codes";

export const signup = AsyncHandler(async (req, res) => {
  const userExists = await userService.getUserByEmail(req.body.email);

  if (userExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User already exists",
    });
  }

  const user = await userService.createUser(req.body);
  const token = await tokenService.generateAuthToken(user);

  res.json({
    message: "User created successfully",
    user,
    token,
  });
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid email or password",
    });
  }

  const token = await tokenService.generateAuthToken(user);

  res.json({
    message: "Login successful",
    user,
    token,
  });
});
