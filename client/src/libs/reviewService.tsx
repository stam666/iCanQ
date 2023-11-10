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

async function editReview(
  reviewId: string,
  userId: string,
  reviewText: string,
  rating: number,
  token: string
) {
  const axiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await axiosAuth.patch(`/review/${reviewId}`, {
    userId,
    reviewId,
    reviewText,
    rating,
  });
  return await res.data;
}

async function deleteReview(userId: string, reviewId: string) {
  const res = await axios.delete(
    process.env.NEXT_PUBLIC_API_URL + `/review/${reviewId}`
  );
  return await res.data;
}

const reviewService = {
  getReviewRestaurant,
  createReview,
  editReview,
  deleteReview,
};
export default reviewService;
