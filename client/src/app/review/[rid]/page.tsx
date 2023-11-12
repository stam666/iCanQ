"use client";
import ReviewForm from "@/components/ReviewForm";
import { useParams } from "next/navigation";

export default function ReviewPage() {
  const param = useParams();
  const rid = param.rid as string;
  return (
    <main className="h-screen flex bg-primary justify-center items-center">
      <div className="w-[300px]">
        <ReviewForm restaurantId={rid} variant="Create" />
      </div>
    </main>
  );
}
