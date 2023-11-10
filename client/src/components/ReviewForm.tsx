"use client";
import reviewService from "@/libs/reviewService";
import StarIcon from "@mui/icons-material/Star";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
interface Props {
  variant: "Edit" | "Create";
  rating?: number;
  reviewText?: string;
  reviewId?: string;
  handleEditReview?: () => void;
}

export default function ReviewForm({
  variant,
  rating,
  reviewText,
  reviewId,
  handleEditReview,
}: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [star, setStar] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const restaurantId = "";
  const handleStarClick = (star: number) => {
    setStar(star);
  };

  useEffect(() => {
    rating && setStar(rating);
    reviewText && setReview(reviewText);
  }, []);

  const handleRoute = () => {
    if (variant === "Create") {
      router.push("/");
      return;
    } else {
      handleEditReview && handleEditReview();
    }
  };

  const handleSubmit = async () => {
    const userId = session?.user._id;
    if (userId) {
      if (variant === "Create") {
        const res = await reviewService.createReview(
          userId,
          restaurantId,
          review,
          star
        );
        router.push("/");
        return res;
      } else {
        if (reviewId) {
          const reviewText = review;
          const rating = star;
          const res = await reviewService.editReview(
            reviewId,
            userId,
            reviewText,
            rating,
            session.user.token
          );
          handleEditReview && handleEditReview();
          return res;
        }
      }
    }
  };

  return (
    <div className="bg-white space-y-4 w-full rounded-[32px] shadow-lg shadow-slate-400 p-4">
      <div className="flex justify-center">
        <p className="text-lg font-medium">
          {variant === "Create" ? "Complete!" : "Edit Review"}
        </p>
      </div>
      <div className="space-y-2.5">
        <p className="text-base">
          {variant === "Create" ? "review this restaurant" : "edit this review"}
        </p>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((object, index) => {
            return (
              <StarIcon
                key={`ster_${object}`}
                className={
                  object <= star
                    ? "text-5xl text-yellow"
                    : "text-5xl text-slate-300"
                }
                onClick={() => handleStarClick(object)}
              />
            );
          })}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            id="comment"
            placeholder="comment something..."
            value={review || ""}
            className="bg-white w-4/5 text-xs border border-[#D9D9D9] rounded-md px-1.5 py-2.5"
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="border border-[2px] border-[#3D79FE] rounded-md text-[#3D79FE] px-4"
            onClick={handleSubmit}
          >
            {variant === "Create" ? "Post" : "Edit"}
          </button>
        </div>
      </div>

      <button
        className={`w-full 
        ${variant === "Create" ? "bg-[#3D79FE]" : "bg-red"}
        bg-[#3D79FE] text-white border rounded-md py-3`}
        onClick={handleRoute}
      >
        {variant === "Create" ? "Got it!" : "Cancle"}
      </button>
    </div>
  );
}
