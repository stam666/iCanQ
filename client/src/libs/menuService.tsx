import axios from "axios";

async function createMenu(restaurantId: string, name: string, price: number) {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + `/menu/${restaurantId}/createMenu`,
    { name: name, price: price },
  );
  return await res.data;
}

async function deleteMenu(restaurantId: string, menuId: string) {
  await axios.delete(
    process.env.NEXT_PUBLIC_API_URL + `/menu/${restaurantId}/${menuId}`,
  );
}

const menuService = { createMenu, deleteMenu };
export default menuService;
