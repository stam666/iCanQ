"use client";
import { IOrder } from "@/models/order.model";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const OrderPage = ({ params }: { params: { orderId: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const [order, setOrder] = useState<IOrder>({});
  const [orderStatus, setOrderStatus] = useState("Pending");

  useEffect(() => {
    //fetch order details
    const statuses = ["Pending", "Cooking", "Complete"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setOrderStatus(statuses[currentIndex]);
      currentIndex = (currentIndex + 1) % statuses.length;
    }, 5000); // Update status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  let imageUrl = "https://media.giphy.com/media/QPQ3xlJhqR1BXl89RG/giphy.gif";

  // Change the image URL for the "Cooking" stage
  if (orderStatus === "Cooking") {
    imageUrl = "https://media.giphy.com/media/CNocEFcF9IBegtgW3q/giphy.gif";
  }
  return (
    // <Box
    //   sx={{
    //     backgroundColor: "orange",
    //     height: "100vh",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Card sx={{ minWidth: 275 }}>
    //     <CardContent>
    //       <Typography variant="h5" component="div" sx={{ mb: 2 }}>
    //         Order Pending
    //       </Typography>
    //       <Typography variant="body1" sx={{ mb: 1 }}>
    //         Your order is currently being processed.
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Please wait for further updates regarding your order status.
    //       </Typography>
    //     </CardContent>
    //   </Card>
    // </Box>
    <main className="min-h-screen bg-primary p-8 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-4 shadow-lg space-y-4 w-full text-center">
        <div className="text-2xl text-white-dark-hover p-2">
          {orderStatus}...
        </div>
        {orderStatus !== "Complete" && (
          <div className="flex justify-center">
            {" "}
            {/* Flex container for horizontal centering */}
            <img src={imageUrl} alt="Loading GIF" />
          </div>
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
};

export default OrderPage;
