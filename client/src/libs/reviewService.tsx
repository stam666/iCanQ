import axios from "axios";

async function getReviewRestaurant(restaurantId: string) {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `/review/restaurant/${restaurantId}`
  );
  return await res.data;
}

async function createReview(
  userId: string,
  restaurantId: string,
  reviewText: string,
  rating: number
) {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + `/review/restaurant/${restaurantId}`,
    { userId, restaurantId, reviewText, rating }
  );
  return await res.data;
}

async function deleteReview(userId: string, reviewId: string) {
  const res = await axios.delete(
    process.env.NEXT_PUBLIC_API_URL + `/review/${reviewId}`
  );
  return await res.data;
}

const reviewService = { getReviewRestaurant, createReview, deleteReview };
export default reviewService;
