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

export const deletePost = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await postService.getPostById(Number(postId), req.user.id);

  if (!post) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Post not found",
    });
  }

  // Check if the user has permission to delete the post
  const allowDelete =
    Number(req.user.id) == Number(post.authorId) || // Check if the user is the author of the post
    req.user.permissions.includes(PERMISSIONS.DELETE_ANY_POST); // Check if the user has the permission to delete any post

  if (!allowDelete) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "You do not have permission to delete this post",
    });
  }

  const deletedPost = await postService.deletePost(Number(postId));

  res.status(StatusCodes.OK).json({
    message: "Post deleted successfully",
    data: deletedPost,
  });
});
