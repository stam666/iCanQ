import RestaurantCard from "@/components/RestaurantCard";
import restaurantService from "@/libs/restaurantService";
import { IRestaurant } from "@/models/restaurant.model";
import Link from "next/link";
import { Suspense } from "react";

export default async function RestaurantPanel() {
  const restaurants = await restaurantService.getAllRestaurants();
  return (
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
  );
}
