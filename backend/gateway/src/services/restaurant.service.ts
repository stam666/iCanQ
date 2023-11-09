import axios from "axios";

const RESTAURANT_SERVICE_URI =
  process.env.RESTAURANT_SERVICE_URI || "http://localhost:8002";

const getRestaurantByUserId = async (userId: string) => {
  try {
    const response = await axios.get(
      `${RESTAURANT_SERVICE_URI}/getRestaurant?userId=${userId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const RestaurantService = {
  getRestaurantByUserId,
};
