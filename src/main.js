import express from "express";
import indexRouter from "./index.router.js";
import { globalErrorHandler } from "./utils/ErrorHandler.js";
import dotenv from "dotenv";
import { initNotificationService } from "./modules/Notification/notification.service.js";
import cors from "cors";
import corsOptions from "./config/cors.js";

dotenv.config();

const app = express();
const port = 3000;
app.use((req, res, next) => {
  // Skip ngrok browser warning
  if (req.headers["user-agent"]?.includes("ngrok")) {
    return res.status(200).send("OK");
  }
  next();
});
app.use(express.json());
app.use(cors(corsOptions));
app.use(indexRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.send("Hello World!"));
const httpServer = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

await initNotificationService(httpServer, "/notifications_server", corsOptions);
