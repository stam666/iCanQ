"use client";
import ReviewForm from "@/components/ReviewForm";
import { useParams } from "next/navigation";

export default function RestaurantReviewPage() {
  const param = useParams();
  const restaurantId = param.rid as string;
  return (
    <main className="h-screen flex bg-primary justify-center items-center">
      <div className="w-[300px]">
        <ReviewForm variant="Create" restaurantId={restaurantId} />
      </div>
    </main>
  );
}
