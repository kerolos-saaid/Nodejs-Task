import { Server } from "socket.io";
import { socketAuth } from "../../../middlewares/auth.js";
import { hasPermission } from "../../../middlewares/hasPermission.js";
import PERMESSIONS from "../../Auth/AccessControl/permissions.js";
import Joi from "joi";

let io = null;
export const userSockets = new Map();

// Joi validation schemas
const notificationSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
  recipientUserId: Joi.number().when("broadcast", {
    is: Joi.exist(),
    otherwise: Joi.when("recipientUserIds", {
      is: Joi.exist(),
      then: Joi.forbidden(),
      otherwise: Joi.required(),
    }),
  }),
  recipientUserIds: Joi.array().items(Joi.string()).min(1).when("broadcast", {
    is: Joi.exist(),
    then: Joi.forbidden(),
  }),
  broadcast: Joi.boolean(),
}).xor("recipientUserId", "recipientUserIds", "broadcast");

// Helper functions
const validateNotificationData = (data) => {
  const { error, value } = notificationSchema.validate(data);
  if (error) {
    return { isValid: false, error: error.details[0].message };
  }
  return { isValid: true, data: value };
};

const validateNotificationPermission = (socket) => {
  if (!hasPermission(socket.user, [PERMESSIONS.SEND_NOTIFICATION])) {
    io.to(socket.id).emit("notification", {
      message: "You do not have permission to send notifications.",
    });
    return false;
  }
  return true;
};

const handleBroadcast = (socket, message) => {
  socket.broadcast.emit("notification", {
    sender: socket.user.id,
    message,
    type: "broadcast",
  });
};

const handleMultipleRecipients = (socket, recipientUserIds, message) => {
  if (recipientUserIds.length === 0) {
    return socket.emit("error", "At least one recipient user ID is required.");
  }

  const { connectedRecipients, disconnectedRecipients } =
    categorizeRecipients(recipientUserIds);

  if (connectedRecipients.length === 0) {
    return socket.emit("error", "No recipient users are currently connected.");
  }

  sendToMultipleUsers(socket, connectedRecipients, message);
  notifyAboutDisconnectedUsers(socket, disconnectedRecipients);
};

const categorizeRecipients = (recipientUserIds) => {
  const connectedRecipients = [];
  const disconnectedRecipients = [];

  recipientUserIds.forEach((userId) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
      connectedRecipients.push(socketId);
    } else {
      disconnectedRecipients.push(userId);
    }
  });

  return { connectedRecipients, disconnectedRecipients };
};

const sendToMultipleUsers = (socket, connectedRecipients, message) => {
  connectedRecipients.forEach((socketId) => {
    io.to(socketId).emit("notification", {
      sender: socket.user.id,
      message,
      type: "multiple",
    });
  });
};

const notifyAboutDisconnectedUsers = (socket, disconnectedRecipients) => {
  if (disconnectedRecipients.length > 0) {
    socket.emit("info", {
      message: `${disconnectedRecipients.length} recipient(s) are not connected.`,
      disconnectedUsers: disconnectedRecipients,
    });
  }
};

const handleSingleRecipient = (socket, recipientUserId, message) => {
  const recipientSocketId = userSockets.get(recipientUserId);
  if (!recipientSocketId) {
    return socket.emit("error", "Recipient user is not connected.");
  }

  io.to(recipientSocketId).emit("notification", {
    sender: socket.user.id,
    message,
    type: "single",
  });
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
      console.log(`User disconnected: ${socket.user.id}`);
      userSockets.delete(socket.user.id);
    });

    socket.on("sendNotification", (data) => {
      if (!validateNotificationPermission(socket)) return;

      const validation = validateNotificationData(data);
      if (!validation.isValid) {
        return socket.emit("error", validation.error);
      }

      const { recipientUserId, recipientUserIds, broadcast, message } =
        validation.data;

      if (broadcast) {
        return handleBroadcast(socket, message);
      }

      if (recipientUserIds) {
        return handleMultipleRecipients(socket, recipientUserIds, message);
      }

      handleSingleRecipient(socket, recipientUserId, message);
    });
  });
};
