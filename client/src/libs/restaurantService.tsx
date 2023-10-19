import axios from "axios";

async function getAllRestaurants() {
  const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/restaurants");
  if (!res) {
    throw new Error("Failed to fetch restaurants");
  }
  return await res.data.data;
}

async function getRestaurantMenu(restaurantId: string) {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL +
      `/restaurants/getAllRestaurantMenu/${restaurantId}`,
  );
  if (!res) {
    throw new Error("Failed to fetch restaurantmenu");
  }
  return await res.data.data;
}

const restaurantService = { getRestaurantMenu, getAllRestaurants };
export default restaurantService;
