import express from "express";
import http from "http"; // Added
import { Server } from "socket.io"; // Added
import indexRouter from "./index.router.js";
import { globalErrorHandler } from "./utils/ErrorHandler.js";
import dotenv from "dotenv";
import { initSocketService } from "./modules/Notification/notification.service.js"; // Added
import envVariables from "./config/envVariables.js"; // Added

dotenv.config();

const app = express();
const port = envVariables.PORT; // Use from envVariables

const server = http.createServer(app); // Added
const socketCorsOrigins = envVariables.SOCKET_CORS_ORIGIN.split(','); // Added

const io = new Server(server, { // Added
  cors: { // Added basic CORS configuration
    origin: socketCorsOrigins.length === 1 && socketCorsOrigins[0] === "*" ? "*" : socketCorsOrigins, // Modified
    methods: ["GET", "POST"]
    // credentials: true // Add if you need to handle cookies/sessions via Socket.IO
  }
});

initSocketService(io); // Added

app.use(express.json());
app.use(indexRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.send("Hello World!"));
server.listen(port, () => console.log(`Example app listening on port ${port}!`)); // Modified
