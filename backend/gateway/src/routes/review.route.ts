import express from "express";

import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ReviewService } from "services/review.service";
import { ReviewController } from "controllers/review.controller";

const router = express.Router();

router.get("restaurant/:restaurantId", ReviewController.getReviews);
router.post("restaurant/:restaurantId", AuthMiddleware.protect, ReviewController.createReview);
router.patch("/:reviewId", AuthMiddleware.protect, ReviewController.editReview);
router.delete("/:reviewId", AuthMiddleware.protect, ReviewController.deleteReview);

export const ReviewRouter = router;
