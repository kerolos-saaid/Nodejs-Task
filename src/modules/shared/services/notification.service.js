import { Server } from "socket.io";
import { socketAuth } from "../../../middlewares/auth";
import AsyncHandler from "../../../utils/AsyncHandler";

let io = null;
const userSockets = new Map();

const initNotificationService = (app, route, cors) => {
  io = new Server(app, {
    path: route,
    cors: {
      origin: cors.origin,
      methods: cors.methods,
      allowedHeaders: cors.allowedHeaders,
      credentials: cors.credentials,
    },
  });
};

io.on(
  "connection",
  socketAuth,
  AsyncHandler((socket) => {
    userSockets.set(socket.user.id, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
      userSockets.delete(socket.user.id);
    });

    socket.on("sendNotification", (data) => {
      const { recipientId, message } = data;
      const recipientSocket = userSockets.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit("notification", {
          senderId: socket.user.id,
          message,
        });
      }
    });
  })
);
