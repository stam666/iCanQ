export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/myrestaurant", "/order/[orderId]", "/restaurant/[restaurantId]"],
};
