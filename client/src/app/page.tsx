"use client";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import restaurantService from "@/libs/restaurantService";
import { IRestaurant } from "@/models/restaurant.model";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const restaurants = await restaurantService.getAllRestaurants();
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-tr from-brown-light-active via-white to-brown-light-active space-y-8">
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <div className="space-y-2">
            <p className="text-xl font-medium">Hi, Jimmy</p>
            <p>Are you hungry?</p>
          </div>
          <button
            className={
              "border-2 border-primary rounded-full text-primary px-3 h-fit py-1 flex flex-row justify-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
            }
            onClick={() => {}}
          >
            <SettingsIcon />
            <div className="font-medium">Log out</div>
          </button>
        </div>
        <button className="mt-4 p-4 font-medium text-white w-full bg-primary rounded-full flex flex-row justify-between hover:bg-brown-dark-hover transition-all duration-30">
          <div className="">History</div>
          <ArrowForwardIcon />
        </button>
      </div>
      <div className="w-full space-y-6 flex flex-col">
        <div className="text-xl font-medium text-left">Restaurant</div>
        <SearchBar />
        <Suspense fallback={<p>Loading ...</p>}>
          {restaurants.map((restaurant: IRestaurant) => (
            <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
              <RestaurantCard
                name={restaurant.restaurantName}
                description={restaurant.restaurantInfo}
                imgSrc={"/images/mcdonald.jpeg"}
                status={restaurant.openStatus}
                // rating={restaurants.rating}
              />
            </Link>
          ))}
        </Suspense>
      </div>
    </main>
  );
}
