"use client";
import ReviewCard from "@/components/ReviewCard";
import restaurantService from "@/libs/restaurantService";
import reviewService from "@/libs/reviewService";
import { IRestaurant } from "@/models/restaurant.model";
import { IReview } from "@/models/review.model";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [review, setReview] = useState<IReview[]>([]);
  useEffect(() => {
    const getMyRestaurant = async () => {
      if (session) {
        try {
          const restaurantData: IRestaurant =
            await restaurantService.getMyRestaurant(session.user._id);
          setRestaurant(restaurantData);
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      }
    };
    getMyRestaurant();
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      if (restaurant) {
        try {
          const review = await reviewService.getReviewRestaurant(
            restaurant?._id
          );
          setReview(review.data);
        } catch (error) {
          console.error("Error fetching restaurant menu: ", error);
        }
      }
    };
    fetchReview();
  }, [restaurant]);

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="h-[25vh] w-full -m-8 z-0 bg-primary absolute"></div>
      <div className="relative z-10">
        <div className="flex flex-row justify-between pt-[60px] text-white">
          <Link href="/myrestaurant" className="">
            <ArrowBackIosNewIcon />
          </Link>
          <div className="text-2xl font-medium text-center">
            {restaurant?.restaurantName}
          </div>
          <div></div>
        </div>
        <div>
          {review.length === 0 ? (
            <ReviewCard caption="ยังไม่ได้รับการรีวิว" star="-" />
          ) : (
            review.map((item, index) => {
              return (
                <ReviewCard
                  key={`review_${index}`}
                  caption={item?.reviewText || "ยังไม่ได้รับการรีวิว"}
                  star={item?.rating.toString() || "-"}
                />
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
