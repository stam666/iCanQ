"use client";
import { orderService } from "@/libs/orderService";
import { IOrder, OrderStatus } from "@/models/order.model";
import { useSession } from "next-auth/react";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const imgUrl = {
  pending: "https://media.giphy.com/media/QPQ3xlJhqR1BXl89RG/giphy.gif",
  preparing: "https://media.giphy.com/media/CNocEFcF9IBegtgW3q/giphy.gif",
};

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
  const restaurantId = param.rid as string;
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    OrderStatus.Pending
  );
  const [img, setImg] = useState<string>(imgUrl.pending);

  const [restaurant, setRestaurant] = useState<string>("");

  const fetchOrder = async () => {
    if (orderId) {
      const res = await orderService.getOrder(orderId);
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

  const handleStatusChanged = (newStatus: OrderStatus) => {
    let redirectPath: string = "";
    if (newStatus === OrderStatus.Completed) {
      redirectPath = `/review/${restaurantId}`;
    }
    if (newStatus === OrderStatus.Cancelled) {
      redirectPath = "/";
    }
    setOrderStatus(newStatus);
    if (redirectPath !== "") {
      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchOrder();
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      query: { token: session?.user.token },
    });

    socket.on("connect", () => {
      console.log("Connected to the server");

      socket.on("orderUpdated", (order: IOrder) => {
        if (order._id === orderId && order.status) {
          handleStatusChanged(order.status);
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  useEffect(() => {
    if (
      orderStatus === OrderStatus.Preparing ||
      orderStatus === OrderStatus.Completed
    )
      setImg(imgUrl.preparing);
  }, [orderStatus]);

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
            <img src={img} alt="Loading GIF" />
          </div>
        )}
        <div className="flex flex-col text-white-dark-hover p-2 gap-3">
          <p>
            {orderStatus === OrderStatus.Pending
              ? "Wait for the restaurant to confirm your order"
              : orderStatus === OrderStatus.Preparing
              ? "Your order is being prepared"
              : null}
          </p>
          {/* for cancel order */}
          <div>
            <button
              className="border w-fit border-primary text-primary rounded-md p-1.5 py-0.5"
              onClick={() => handleCancelOrder()}
            >
              Cancel Order
            </button>
          </div>

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
