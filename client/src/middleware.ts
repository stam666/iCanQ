export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/order/[orderId]", "/restaurant/[restaurantId]"],
};
