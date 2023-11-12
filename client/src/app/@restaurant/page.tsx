"use client";
import restaurantService from "@/libs/restaurantService";
import { IRestaurant } from "@/models/restaurant.model";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsIcon from "@mui/icons-material/Settings";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyRestaurantPage() {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    const getMyRestaurant = async () => {
      if (session) {
        try {
          const restaurantData: IRestaurant =
            await restaurantService.getMyRestaurant(session.user._id);
          setRestaurant(restaurantData);
          setIsOpen(restaurantData.openStatus);
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      }
    };
    getMyRestaurant();
  }, [session]);
  const handleSetStatus = () => {
    if (restaurant && isOpen != undefined)
      restaurantService.setMyRestaurantStatus(restaurant?._id, !isOpen);
    setIsOpen(!isOpen);
  };
  return (
    <main className="h-screen bg-gradient-to-tr from-brown-light-active via-white to-brown-light-active p-8 space-y-4">
      <div className="flex flex-row justify-between">
        <div className="space-y-2">
          <p className="text-xl font-medium">
            Hi, {restaurant?.restaurantName}
          </p>
          <p>
            {session?.user.role === "restaurant"
              ? "Let's cook together"
              : "Are you hungry?"}
          </p>
        </div>
        <div
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={
            "border-2 border-primary rounded-full px-3 text-primary h-fit py-1 flex flex-row justify-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
          }
        >
          <SettingsIcon />
          <div className="font-medium">Log out</div>
        </div>
      </div>
      <button
        className="mt-4 p-4 font-medium text-white w-full bg-primary rounded-full flex flex-row justify-between hover:bg-brown-dark-hover transition-all duration-30"
        onClick={() => {
          router.push("/menu");
        }}
      >
        <div className="">My Restaurant</div>
        <ArrowForwardIcon />
      </button>
      <div className="w-full flex flex-row justify-between">
        <div className="text-2xl font-medium">Orders</div>
        <div className="items-center flex justify-center">
          {restaurant && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOpen}
                onChange={handleSetStatus}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue"></div>
              <span className="ml-1 font-medium text-sm text-black peer-checked:text-blue dark:text-gray-300">
                {isOpen ? "Open" : "Closed"}
              </span>
            </label>
          )}
        </div>
      </div>
    </main>
  );
}
