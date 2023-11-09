import express from "express";
require("dotenv").config({
  path: "./config.env",
});

import mongoose from "mongoose";
import { ReviewRouter } from "./routes/review.route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.REVIEW_SERVICE_PORT || 8005;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

app.use("/", ReviewRouter);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Review service is running at https://localhost:${PORT}`
  );
});
