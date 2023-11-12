import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ReviewCard({
  caption,
  star,
  rid,
  nameRestaurant,
  reviewId,
  uid,
  handleEditReview,
  isRestaurant = false,
}: {
  caption: string;
  star: string;
  rid?: string;
  nameRestaurant?: string | null;
  uid: string | undefined;
  reviewId: string | undefined;
  handleEditReview?: () => void;
  isRestaurant?: boolean;
}) {
  const { data: session } = useSession();

  return (
    <div className="bg-white rounded-2xl flex flex-col p-4 shadow-lg space-y-4 mt-8">
      <div className="bg-brown-light p-2 rounded-lg">{caption}</div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-full justify-between">
          <div className="flex gap-2">
            <StarIcon className="text-yellow" />
            <p className="text-white-normal-active">{star}</p>
            <p className="text-white-dark ">Rating and reviews</p>
          </div>
          {handleEditReview && session?.user._id === uid && (
            <div
              className="px-4 text-[#3D79FE] cursor-pointer"
              onClick={handleEditReview}
            >
              Edit
            </div>
          )}
        </div>
        {(isRestaurant ? true : rid) && (
          <Link
            href={
              isRestaurant
                ? "/review"
                : `/restaurants/${rid}/review?name=${nameRestaurant}`
            }
          >
            <KeyboardArrowRightIcon className="text-white-normal-active" />
          </Link>
        )}
      </div>
    </div>
  );
}
