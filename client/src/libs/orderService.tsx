import { IOrder, IOrderItem } from "@/models/order.model";
import axios from "axios";
import { getSession } from "next-auth/react";

const placeOrder = async (restaurantId: string, orderItems: IOrderItem[]) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const orderBody = {
    restaurantId,
    orderItems,
    totalPrice: orderItems.reduce(
      (sum, item) => sum + item.price * item.amount,
      0
    ),
  };
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/order",
    orderBody,
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );
  if (!res) {
    throw new Error("Failed to place order");
  } 
  return res.data;
};

const getOrder = async (orderId: string) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );
  if (!res) {
    throw new Error("Failed to get order");
  }

  return await res.data.data;
};

export const orderService = {
  placeOrder,
};
