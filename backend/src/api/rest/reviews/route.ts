import { Router } from "express";
import { ReviewController } from "./controllers/review.controller";

const reviewRouter = Router();

reviewRouter
  .get("/getAllRestaurantReview/:restaurantId", ReviewController.getAllRestaurantReview)
  .post("/createRestaurantReview/:restaurantId", ReviewController.createRestaurantReview)
  .patch("/editReview/:reviewId", ReviewController.editReview)
  .delete("/deleteReview/:reviewId", ReviewController.deleteReview);

export default reviewRouter;
