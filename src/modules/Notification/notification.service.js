import { Server } from "socket.io";
import { socketAuth } from "../../middlewares/auth.js";
import ApiError from "../../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma.js";

let io = null;
const userSockets = new Map();

export const sendNotification = async (recipientUserIds, message) => {
  if (!io) {
    throw new ApiError(
      "Notification service is not initialized.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const socketsToNotify = [];
  recipientUserIds.forEach((userId) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
      socketsToNotify.push(socketId);
    }
  });
  console.log(`Sending notification to sockets: ${socketsToNotify.join(", ")}`);

  if (socketsToNotify.length === 0) {
    throw new ApiError("No active users found.", StatusCodes.NOT_FOUND);
  }

  io.to(socketsToNotify).emit("notification", {
    message,
    timestamp: new Date().toISOString(),
  });
};

export const registerPushToken = async (userId, deviceType, token) => {
  if (!io) {
    throw new ApiError(
      "Notification service is not initialized.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const pushToken = await prisma.pushToken.create({
    data: {
      userId,
      token,
    },
  });

  return pushToken;
};

export const initNotificationService = async (app, route, cors) => {
  io = new Server(app, {
    path: route,
    cors: {
      origin: cors.origin,
      methods: cors.methods,
      allowedHeaders: cors.allowedHeaders,
      credentials: cors.credentials,
    },
  });
  io.use(socketAuth());
  io.on("connection", (socket) => {
    userSockets.set(socket.user.id, socket.id);

    socket.on("disconnect", () => {
      userSockets.delete(socket.user.id);
    });
  });
};
