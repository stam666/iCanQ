import express from "express";
import { ReviewController } from "./controllers/review.controller";
import mongoose from "mongoose";

require("dotenv").config({
  path: "../../../../config.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.REVIEW_SERVICE_PORT || 8005;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

app
  .get(
    "/getAllRestaurantReview/:restaurantId",
    ReviewController.getAllRestaurantReview
  )
  .post(
    "/createRestaurantReview/:restaurantId",
    ReviewController.createRestaurantReview
  )
  .patch("/editReview/:reviewId", ReviewController.editReview)
  .delete("/deleteReview/:reviewId", ReviewController.deleteReview);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Review service is running at https://localhost:${PORT}`
  );
});
