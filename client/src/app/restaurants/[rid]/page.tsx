"use client";
import MenuPanel from "@/components/MenuPanel";
import { orderService } from "@/libs/orderService";
import { IOrderItem } from "@/models/order.model";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RestaurantDetailPage({
  params,
}: {
  params: { rid: string };
}) {
  const urlParams = useSearchParams();
  const restaurantName = urlParams.get("name");
  const router = useRouter();
  const [cart, setCart] = useState<IOrderItem[]>([]);
  const totalSum = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );
  const handleAddToCart = (order: IOrderItem) => {
    setCart((prevState) => [...prevState, order]);
  };
  const handleDeleteItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.menuId !== id);
    setCart(updatedCart);
  };
  const handlePlaceOrder = async () => {
    try {
      const res = await orderService.placeOrder(params.rid, cart);
      console.log(res);
      router.push("/order/" + res._id);
    } catch (err) {
      console.log(err);
    }
  };
  const [isSummary, setIsSummary] = useState(false);
  if (!isSummary)
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="h-1/4 w-full -m-8 z-0 bg-primary absolute"></div>
        <div className="relative z-10">
          <div className="flex flex-row justify-between pt-[60px] text-white">
            <Link href="/" className="">
              <ArrowBackIosNewIcon />
            </Link>
            <div className="text-2xl font-medium text-center">
              {restaurantName}
            </div>
            <div></div>
          </div>
          <div className="bg-white rounded-2xl flex flex-col p-4 shadow-lg space-y-4 mt-8">
            <div className="bg-brown-light p-2 rounded-lg">
              Caption is still a caption Caption is still a captionCaption is
              still a caption Caption is still a caption
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row space-x-1">
                <StarIcon className="text-yellow" />
                <p className="text-white-normal-active">4.5</p>
                <p className="text-white-dark ">Rating and reviews</p>
              </div>
              <KeyboardArrowRightIcon className="text-white-normal-active" />
            </div>
          </div>
          <div className="text-2xl font-medium mt-8">Menu</div>
          <MenuPanel params={params} addToCart={handleAddToCart} />
        </div>
        {cart.length != 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-8 rounded-t-3xl space-y-4 shadow-[rgba(0,0,0,0.1)_0px_0px_10px_4px]">
            <button
              className="p-4 font-medium text-white w-full bg-primary rounded-full flex flex-row justify-between hover:bg-brown-dark-hover transition-all duration-30"
              onClick={() => {
                setIsSummary(true);
                console.log(cart);
              }}
            >
              <div className="">Basket {cart.length} items</div>
              <ArrowForwardIcon />
            </button>
          </div>
        )}
      </main>
    );
  else
    return (
      <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-tr from-brown-light-active via-white to-brown-light-active space-y-8">
        <div className="flex flex-row justify-between pt-[60px] w-full">
          <button onClick={() => setIsSummary(false)}>
            <ArrowBackIosNewIcon />
          </button>
          <div className="text-2xl font-medium text-center">Summary</div>
          <div></div>
        </div>
        <div className="w-full space-y-6">
          {cart.map((order: IOrderItem, index: number) => (
            <div key={index}>
              <div className="flex flex-row rounded-2xl bg-white shadow-lg w-full">
                <div className="w-4/5 flex flex-col p-4 space-y-2">
                  <div className="flex flex-row space-x-4">
                    <div className="text-left text-primary">
                      x{order.amount}
                    </div>
                    <div className="text-left">{order.name}</div>
                  </div>
                  {order.note != "" ? <p>Note: {order.note}</p> : null}
                  <div className="text-2xl">{order.price * order.amount}฿</div>
                </div>
                <div className="bg-red text-white justify-center items-center text-center w-1/5 rounded-tr-2xl rounded-br-2xl">
                  <div
                    className="flex w-full h-full justify-center items-center text-center"
                    onClick={() => handleDeleteItem(order.menuId)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-8 rounded-t-2xl space-y-4 shadow-[rgba(0,0,0,0.1)_0px_0px_10px_4px]">
          <div className="flex flex-row justify-between">
            <div className="text-2xl">Total</div>
            <div className="text-2xl">{totalSum}฿</div>
          </div>
          <button
            disabled={cart.length === 0}
            className="p-4 font-medium text-white w-full bg-blue rounded-full transition-all duration-30 disabled:bg-white-normal-active"
            onClick={handlePlaceOrder}
          >
            <div className="text-center">Place Order</div>
          </button>
        </div>
      </main>
    );
}
