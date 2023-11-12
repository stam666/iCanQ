import { IOrder, IOrderItem, OrderStatus } from "@/models/order.model";
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

  return await res.data;
};

const updateOrder = async (orderId: string, status: OrderStatus) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/order/restaurant/status/${orderId}`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );
  if (!res) {
    throw new Error("Failed to update order");
  }

  return await res.data;
};

const cancelOrder = async (orderId: string) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/order/cancel/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );
  if (!res) {
    throw new Error("Failed to cancel order");
  }

  return await res.data;
};

const restaurantGetAllOrder = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/order/restaurant`,
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );
  if (!res) {
    throw new Error("Failed to get all restaurant order");
  }

  return await res.data;
};

const cancelOrder = async (orderId: string) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/order/cancel/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );
  if (!res) {
    throw new Error("Failed to cancel order");
  }

  return await res.data;
}

export const orderService = {
  getOrder,
  placeOrder,
  updateOrder,
  cancelOrder,
};
