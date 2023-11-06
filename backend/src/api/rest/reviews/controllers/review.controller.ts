import { RequestHandler } from "express";
import Review from "../models/review.model";
import getUserId from "../../restaurants/controllers/restaurant.controller";

const getAllRestaurantReview: RequestHandler = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurantId: req.params.restaurantId,
    });

    if (reviews.length === 0) {
      res.status(404).json({
        success: false,
        data: "No reviews found for this restaurant",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};

const createRestaurantReview: RequestHandler = async (req, res) => {
  try {
    const { reviewText, rating } = req.body;
    const { restaurantId } = req.params;
    const userId = await getUserId(req);

    const newReview = await Review.create({
      userId,
      reviewText,
      rating,
      restaurantId,
    });

    res.status(200).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
    console.log(error);
  }
};

const editReview: RequestHandler = async (req, res) => {
  try {
    const { reviewText, rating } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const userId = await getUserId(req);

    if (!review) {
      res.status(404).json({
        success: false,
        data: "Review not found",
      });
      return;
    }

    if (review.userId !== userId) {
      res.status(403).json({
        success: false,
        data: "You are not the owner of this review",
      });
      return;
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        reviewText,
        rating,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
    console.log(err);
  }
};

const deleteReview: RequestHandler = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const userId = await getUserId(req);

    if (!review) {
      res.status(404).json({
        success: false,
        data: "Review not found",
      });
      return;
    }

    if (review.userId !== userId) {
      res.status(403).json({
        success: false,
        data: "You are not the owner of this review",
      });
      return;
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      data: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
    console.log(err);
  }
};

export const ReviewController = {
  getAllRestaurantReview,
  createRestaurantReview,
  editReview,
  deleteReview,
};
