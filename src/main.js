import express from "express";
import http from "http"; // Added
import { Server } from "socket.io"; // Added
import indexRouter from "./index.router.js";
import { globalErrorHandler } from "./utils/ErrorHandler.js";
import dotenv from "dotenv";
import { initSocketService } from "./modules/Notification/notification.service.js"; // Added

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

const server = http.createServer(app); // Added
const io = new Server(server, { // Added
  cors: { // Added basic CORS configuration
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

initSocketService(io); // Added

app.use(express.json());
app.use(indexRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.send("Hello World!"));
server.listen(port, () => console.log(`Example app listening on port ${port}!`)); // Modified
