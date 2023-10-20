import MenuCard from "@/components/MenuCard";
import restaurantService from "@/libs/restaurantService";
import { IMenu } from "@/models/menu.model";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

export default async function RestaurantDetailPage({
  params,
}: {
  params: { rid: string };
}) {
  // const restaurantMenu = await restaurantService.getRestaurantMenu(params.rid);
  // console.log(restaurantMenu);
  return (
    <main className="h-screen bg-white p-8">
      <div className="h-1/4 w-full -m-8 z-0 bg-primary absolute"></div>
      <div className="relative space-y-8 z-10">
        <div className="flex flex-row justify-between pt-[60px] text-white">
          <Link href="/" className="">
            <ArrowBackIosNewIcon />
          </Link>
          <div className="text-2xl font-medium text-center">Restaurant</div>
          <div></div>
        </div>
        <div className="bg-white rounded-2xl flex flex-col p-4 shadow-lg space-y-4">
          <div className="bg-brown-light p-2 rounded-lg">
            Caption is still a caption Caption is still a captionCaption is
            still a caption Caption is still a caption
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row space-x-1">
              <StarIcon className="text-yellow" />
              <p className="text-white-normal-active">4.5</p>
              <p className="text-white-dark ">Rating and reviews</p>
            </div>
            <KeyboardArrowRightIcon className="text-white-normal-active" />
          </div>
        </div>
        <div className="text-2xl font-medium">Menu</div>
        {/* {restaurantMenu.map((menu: IMenu) => (
          // Insert Link Component Here!
          <MenuCard
            key={menu.menuId}
            name={menu.name}
            price={menu.price}
            imgSrc={"/images/food1.jpeg"}
          />
        ))} */}
      </div>
    </main>
  );
}
