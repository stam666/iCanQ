const axios = require("axios");

const REVIEW_URL = process.env.REVIEW_SERVICE_URI || "http://localhost:8005";

const getReviews = async (restaurantId: string) => {
  try {
    const response = await axios.get(
      `${REVIEW_URL}/getAllRestaurantReview/${restaurantId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const createReview = async (
  userId: string,
  restaurantId: string,
  reviewText: string,
  rating: number
) => {
  try {
    const response = await axios.post(
      `${REVIEW_URL}/createRestaurantReview/${restaurantId}`,
      {
        userId,
        reviewText,
        rating,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const editReview = async (
  userId: string,
  reviewId: string,
  reviewText: string,
  rating: number
) => {
  try {
    const response = await axios.patch(`${REVIEW_URL}/editReview/${reviewId}`, {
      userId,
      reviewText,
      rating,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteReview = async (userId: string, reviewId: string) => {
  try {
    const response = await axios.delete(
      `${REVIEW_URL}/deleteReview/${reviewId}`,
      {
        userId,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const ReviewService = {
  getReviews,
  createReview,
  editReview,
  deleteReview,
};
