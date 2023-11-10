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
  useEffect(() => {
    //fetch order details
  }, []);
  return (
    <Box
      sx={{
        backgroundColor: "orange",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 2 }}>
            Order Pending
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Your order is currently being processed.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait for further updates regarding your order status.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderPage;
