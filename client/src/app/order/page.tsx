"use client";
import { useState, useEffect } from "react";
import { IOrder } from "@/models/order.model";
import { useSearchParams } from "next/navigation";

export default function OrderDetailPage({
  params,
}: {
  params: { rid: string };
}) {
  const urlParams = useSearchParams();
  const restaurantName = urlParams.get("name");
  const [cart, setCart] = useState<IOrder[]>([]);
  const totalSum = cart.reduce(
    (accumulator, order) => accumulator + parseInt(order.totalPrice),
    0
  );
  const [orderStatus, setOrderStatus] = useState("Pending");

  // Simulate changing order status over time
  useEffect(() => {
    const interval = setInterval(() => {
      // Here, you can fetch the actual order status from your API
      // For demonstration purposes, let's simulate changing the status
      const statuses = ["Pending", "Cooking", "Complete"];
      const randomIndex = Math.floor(Math.random() * statuses.length);
      setOrderStatus(statuses[randomIndex]);
    }, 5000); // Update status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  let imageUrl = "https://media.giphy.com/media/QPQ3xlJhqR1BXl89RG/giphy.gif";

  // Change the image URL for the "Cooking" stage
  if (orderStatus === "Cooking") {
    imageUrl = "https://media.giphy.com/media/CNocEFcF9IBegtgW3q/giphy.gif";
  }

  return (
    <main className="min-h-screen bg-primary p-8 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-4 shadow-lg space-y-4 w-full text-center">
        <div className="text-2xl text-white-dark-hover p-2">
          {orderStatus}...
        </div>
        {orderStatus != "Complete" && (
          <img src={imageUrl} alt="Loading GIF" className="mb-2" />
        )}
        <div className="text-white-dark-hover p-2">
          {orderStatus === "Pending"
            ? "Wait for the restaurant to confirm your order"
            : orderStatus === "Cooking"
            ? "Your order is being prepared"
            : orderStatus === "Complete"
            ? "Your order is ready for pickup"
            : null}
        </div>
      </div>
    </main>
  );
}
