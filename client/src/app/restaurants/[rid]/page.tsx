"use client";
import MenuPanel from "@/components/MenuPanel";
import ReviewCard from "@/components/ReviewCard";
import reviewService from "@/libs/reviewService";
import { IOrder } from "@/models/order.model";
import { IReview } from "@/models/review.model";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantDetailPage({
  params,
}: {
  params: { rid: string };
}) {
  //const param = useParams();
  const urlParams = useSearchParams();
  const restaurantName = urlParams.get("name");
  const [cart, setCart] = useState<IOrder[]>([]);
  const [review, setReview] = useState<IReview[]>([]);
  const totalSum = cart.reduce(
    (accumulator, order) => accumulator + parseInt(order.totalPrice),
    0
  );
  const handleAddToCart = (order: IOrder) => {
    setCart((prevState) => [...prevState, order]);
  };
  const handleDeleteItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const review = await reviewService.getReviewRestaurant(params.rid);
        setReview(review.data);
      } catch (error) {
        console.error("Error fetching restaurant review: ", error);
      }
    };
    fetchReview();
  }, []);

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
          <ReviewCard
            caption={review[0]?.reviewText || "ยังไม่ได้รับการรีวิว"}
            star={review[0]?.rating.toString() || "-"}
            reviewId={review[0]?._id}
            uid={review[0]?.userId}
            nameRestaurant={restaurantName}
            rid={`${params.rid}`}
          />
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
          {cart.map((order: IOrder, index: number) => (
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
                  <div className="text-2xl">{order.totalPrice}฿</div>
                </div>
                <div className="bg-red text-white justify-center items-center text-center w-1/5 rounded-tr-2xl rounded-br-2xl">
                  <div
                    className="flex w-full h-full justify-center items-center text-center"
                    onClick={() => handleDeleteItem(order.id)}
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
            onClick={() => {
              // Place Order
            }}
          >
            <div className="text-center">Place Order</div>
          </button>
        </div>
      </main>
    );
}
