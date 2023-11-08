import express from "express";
require("dotenv").config({
  path: "./config.env",
});
import mongoose from "mongoose";
import { UserRouter } from "./routes/user.route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.USER_SERVICE_PORT || 8001;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

app.use("/", UserRouter);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: User service is running at https://localhost:${PORT}`
  );
});
