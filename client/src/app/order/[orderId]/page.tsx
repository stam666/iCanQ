"use client";
import { orderService } from "@/libs/orderService";
import { IOrder, OrderStatus } from "@/models/order.model";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

const statuses = ["pending", "cooking", "complete"];

const OrderPage = ({ params }: { params: { orderId: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const router = useRouter();
  const param = useParams();
  const orderId = param.orderId as string;
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    OrderStatus.Pending
  );
  const getMyorder = async () => {
    if (orderId) {
      const res = await orderService.getOrder(orderId);
      if (res.status === OrderStatus.Completed) {
        router.push("/review");
      }
      setOrderStatus(res.status);
      setTotalOrder(res.orderItems.length);
      setPrice(res.totalPrice);
    }
  };

  const handleCancelOrder = async () => {
    if (orderId) {
      const res = await orderService.cancelOrder(orderId);
      console.log(res);
      router.push("/");
    }
  };
  useEffect(() => {
    //fetch order details
    const interval = setInterval(getMyorder, 3000);
    return () => clearInterval(interval);
  }, []);

  let imageUrl = "https://media.giphy.com/media/QPQ3xlJhqR1BXl89RG/giphy.gif";

  // Change the image URL for the "Cooking" stage
  if (orderStatus === OrderStatus.Preparing) {
    imageUrl = "https://media.giphy.com/media/CNocEFcF9IBegtgW3q/giphy.gif";
  }
  return (
    <main className="min-h-screen bg-primary p-8 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-4 shadow-lg space-y-4 w-full text-center">
        <div className="text-2xl text-white-dark-hover p-2">
          {orderStatus}...
        </div>
        {orderStatus !== OrderStatus.Completed && (
          <div className="flex justify-center">
            {" "}
            {/* Flex container for horizontal centering */}
            <img src={imageUrl} alt="Loading GIF" />
          </div>
        )}
        <div className="flex flex-col text-white-dark-hover p-2 gap-3">
          <p>
            {orderStatus === OrderStatus.Pending
              ? "Wait for the restaurant to confirm your order"
              : orderStatus === OrderStatus.Preparing
              ? "Your order is being prepared"
              : orderStatus === OrderStatus.Completed
              ? "Your order is ready for pickup"
              : null}
          </p>
          {/* for cancel order */}
          {/* <div>
            <button
              className="border w-fit border-primary text-primary rounded-md p-1.5 py-0.5"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>
          </div> */}

          <div className="flex pt-2 text-primary justify-between text-xs font-medium">
            <p>Total: {totalOrder} menu</p>
            <p>Total Price: {price} baht</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderPage;
