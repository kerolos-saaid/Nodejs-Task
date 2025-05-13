import AsyncHandler from "../../utils/AsyncHandler.js";
import * as postService from "./post.service.js";
import { StatusCodes } from "http-status-codes";
import PERMISSIONS from "../Auth/AccessControl/permissions.js";

export const createPost = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { title, content, public: _public } = req.body;

  const post = await postService.createPost(userId, {
    title,
    content,
    _public,
  });

  res.status(StatusCodes.CREATED).json({
    message: "Post created successfully",
    data: post,
  });
});

export const delete_own = AsyncHandler(async (req, res) => {
  const { postId } = req.params;

  const deletedPost = await postService.deletePost(Number(postId), req.user.id);

  res.status(StatusCodes.OK).json({
    message: "Post deleted successfully",
    data: deletedPost,
  });
});

export const delete_privileged = AsyncHandler(async (req, res) => {
  const { postId } = req.params;

  const deletedPost = await postService.deletePost(Number(postId));

  res.status(StatusCodes.OK).json({
    message: "Post deleted successfully",
    data: deletedPost,
  });
});
