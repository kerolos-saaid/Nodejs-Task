import express from "express";
import indexRouter from "./index.router.js";
import { globalErrorHandler } from "./utils/ErrorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(indexRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
