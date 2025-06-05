import express from "express";
import indexRouter from "./index.router.js";
import { globalErrorHandler } from "./utils/ErrorHandler.js";
import dotenv from "dotenv";
import { initNotificationService } from "./modules/shared/services/notification.service.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(indexRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.send("Hello World!"));
const httpServer = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

initNotificationService(httpServer, "/notifications", {
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
});
