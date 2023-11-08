import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";

const router = Router();

router.get(
  "/getAllRestaurantReview/:restaurantId",
  ReviewController.getAllRestaurantReview
);
router.post(
  "/createRestaurantReview/:restaurantId",
  ReviewController.createRestaurantReview
);
router.patch("/editReview/:reviewId", ReviewController.editReview);
router.delete("/deleteReview/:reviewId", ReviewController.deleteReview);

export const ReviewRouter = router;
