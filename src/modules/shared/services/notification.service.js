import { Server } from "socket.io";
import { socketAuth } from "../../../middlewares/auth.js";
import { hasPermission } from "../../../middlewares/hasPermission.js";
import PERMESSIONS from "../../Auth/AccessControl/permissions.js";

let io = null;
export const userSockets = new Map();

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
    console.log(userSockets);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
      userSockets.delete(socket.user.id);
    });

    socket.on("sendNotification", (data) => {
      console.log(socket.user.permissions);

      if (!hasPermission(socket.user, [PERMESSIONS.SEND_NOTIFICATION])) {
        io.to(socket.id).emit("notification", {
          message: "You do not have permission to send notifications.",
        });
        return;
      }
      const { recipientUserId, message } = data;

      if (!recipientUserId || !message) {
        return socket.emit(
          "error",
          "Recipient user ID and message are required."
        );
      }

      const recipientSocketId = userSockets.get(recipientUserId);
      if (!recipientSocketId) {
        return socket.emit("error", "Recipient user is not connected.");
      }
      console.log(
        `Sending notification from ${socket.user.id} to ${recipientUserId}: ${message}`
      );

      io.to(recipientSocketId).emit("notification", {
        sender: socket.user.id,
        message,
      });
    });
  });
};
