"use client";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import reviewService from "@/libs/reviewService";
import { IReview } from "@/models/review.model";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSession } from "next-auth/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantReviewPage() {
  const params = useParams();
  const router = useRouter();
  const rid = params.rid as string;
  const urlParams = useSearchParams();
  const restaurantName = urlParams.get("name");
  const { data: session } = useSession();

  const [isEditReview, setIsEditReview] = useState<boolean>(false);
  const [review, setReview] = useState<IReview[]>([]);
  const [myReview, setMyReview] = useState<IReview>();

  const AllReviewComponent = () => {
    return (
      <div>
        {review.length === 0 ? (
          <ReviewCard
            caption="ยังไม่ได้รับการรีวิว"
            star="-"
            uid={undefined}
            reviewId={undefined}
          />
        ) : (
          review.map((item, index) => {
            return (
              <ReviewCard
                key={`review_${index}`}
                uid={item.userId}
                reviewId={item._id}
                caption={item?.reviewText || "ยังไม่ได้รับการรีวิว"}
                star={item?.rating.toString() || "-"}
                handleEditReview={handleEditReview}
              />
            );
          })
        )}
      </div>
    );
  };

  const handleEditReview = () => {
    setIsEditReview((isEditReview) => !isEditReview);
  };

  useEffect(() => {
    setIsEditReview(false);
  }, []);

  useEffect(() => {
    const userReview = review.find((item) => session?.user._id === item.userId);
    if (userReview) {
      setMyReview(userReview);
    }
  }, [review, session?.user._id]);

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
  }, [isEditReview]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-brown-light-active via-white to-brown-light-active p-8">
      <div className="h-[25vh] w-full -m-8 z-0 bg-primary absolute"></div>
      <div className="relative">
        <div className="flex flex-row justify-between pt-[60px] text-white">
          <ArrowBackIosNewIcon
            onClick={() => {
              if (isEditReview) {
                setIsEditReview(false);
              } else {
                router.push(`/restaurants/${rid}?name=${restaurantName}`);
              }
            }}
          />
          <div className="text-2xl font-medium text-center">
            {restaurantName}
          </div>
          <div></div>
        </div>
        {isEditReview ? (
          <div className="pt-16">
            <ReviewForm
              variant="Edit"
              reviewText={myReview?.reviewText}
              rating={myReview?.rating}
              reviewId={myReview?._id}
              handleEditReview={handleEditReview}
            />
          </div>
        ) : (
          <AllReviewComponent />
        )}
      </div>
    </main>
  );
}
