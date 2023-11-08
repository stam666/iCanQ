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
async function getMyRestaurant(userId: string) {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL +
      `/restaurants/getRestaurant?userId=${userId}`,
  );
  if (!res) {
    throw new Error("Failed to get Restaurant");
  }
  return await res.data.data;
}
async function setMyRestaurantStatus(restaurantId: string, status: boolean) {
  const res = await axios.patch(
    process.env.NEXT_PUBLIC_API_URL +
      `/restaurants/setRestaurantStatus/${restaurantId}`,
    { openStatus: status },
  );
  if (!res) {
    throw new Error("Failed to set Restaurant status");
  }
  return await res.data.data;
}
const restaurantService = {
  getRestaurantMenu,
  getAllRestaurants,
  getMyRestaurant,
  setMyRestaurantStatus,
};
export default restaurantService;
