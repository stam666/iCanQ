import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";

export default function RestaurantCard({
  name,
  rating,
  imgSrc,
  description,
  status,
}: {
  name: string;
  rating?: number;
  imgSrc?: string;
  description?: string;
  status?: boolean;
}) {
  return (
    <div className="flex flex-row rounded-2xl bg-white shadow-lg">
      <div className="w-2/3 flex flex-col p-4 space-y-2">
        <div className="flex flex-row space-x-4">
          <div className="text-left">{name}</div>
          {rating ? (
            <div className="flex flex-row space-x-1">
              <StarIcon className="text-yellow" />
              <p>{rating}</p>
            </div>
          ) : null}
        </div>
        {description ? <p className="w-full truncate">{description}</p> : null}
        {status ? (
          <p className="text-white-normal-active text-[12px]">{status}</p>
        ) : null}
      </div>
      {imgSrc ? (
        <div className="w-1/3 relative">
          <Image
            fill={true}
            src={imgSrc}
            alt="restuarant picture"
            className="rounded-tr-2xl rounded-br-2xl object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
