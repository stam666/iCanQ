"use client";
import ReviewCard from "@/components/ReviewCard";
import reviewService from "@/libs/reviewService";
import { IReview } from "@/models/review.model";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantReviewPage() {
  const params = useParams();
  const rid = params.rid as string;
  const urlParams = useSearchParams();
  const restaurantName = urlParams.get("name");
  const [review, setReview] = useState<IReview[]>([]);

  useEffect(() => {
    const fetchReview = async () => {
      if (rid) {
        try {
          const review = await reviewService.getReviewRestaurant(rid);
          setReview(review.data);
        } catch (error) {
          console.error("Error fetching restaurant menu: ", error);
        }
      }
    };
    fetchReview();
  }, []);

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="h-[25vh] w-full -m-8 z-0 bg-primary absolute"></div>
      <div className="relative z-10">
        <div className="flex flex-row justify-between pt-[60px] text-white">
          <Link
            href={`/restaurants/${rid}?name=${restaurantName}`}
            className=""
          >
            <ArrowBackIosNewIcon />
          </Link>
          <div className="text-2xl font-medium text-center">
            {restaurantName}
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
