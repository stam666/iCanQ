import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";

export default function ReviewCard({
  caption,
  star,
  panel,
  rid,
  nameRestaurant,
}: {
  caption: string;
  star: string;
  panel?: boolean;
  rid?: string;
  nameRestaurant?: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl flex flex-col p-4 shadow-lg space-y-4 mt-8">
      <div className="bg-brown-light p-2 rounded-lg">{caption}</div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-1">
          <StarIcon className="text-yellow" />
          <p className="text-white-normal-active">{star}</p>
          <p className="text-white-dark ">Rating and reviews</p>
        </div>
        {panel && rid && (
          <Link href={`/restaurants/${rid}/review?name=${nameRestaurant}`}>
            <KeyboardArrowRightIcon className="text-white-normal-active" />
          </Link>
        )}
      </div>
    </div>
  );
}
