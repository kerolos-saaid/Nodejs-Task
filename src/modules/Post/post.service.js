import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma.js";
import ApiError from "../../utils/ApiError.js";

export const createPost = async (userId, postData) => {
  const { title, content, _public } = postData;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      public: _public,
      authorId: userId,
    },
  });
  return post;
};

export const deletePost = async (postId) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new ApiError("Post not found", StatusCodes.NOT_FOUND);
  }

  const post = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return post;
};

export const getPostById = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return null;
  }

  return post;
};
