"use client";
import restaurantService from "@/libs/restaurantService";
import { orderService } from "@/libs/orderService";
import { IRestaurant } from "@/models/restaurant.model";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CompletePanel from "@/components/CompletePanel";
import PendingPanel from "@/components/PendingPanel";
import CookingPanel from "@/components/CookingPanel";
import { IOrder } from "@/models/order.model";
import { io } from "socket.io-client";

// Import statements

export default function MyRestaurantPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [selectedSection, setSelectedSection] = useState<string>("pending");
  const router = useRouter();

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

  const fetchOrders = async () => {
    try {
      const orderItems: IOrder[] = await orderService.restaurantGetAllOrder();
      setOrders(orderItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRestaurantSetStatus = () => {
    if (restaurant && isOpen != undefined)
      restaurantService.setMyRestaurantStatus(restaurant?._id, !isOpen);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getMyRestaurant();
    fetchOrders();
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      query: { token: session?.user.token },
    });

    socket.on("connect", () => {
      console.log("Connected to the server");

      socket.on("orderCreated", (order: IOrder) => {
        setOrders((prevOrders) => [...prevOrders, order]);
      });

      socket.on("orderUpdated", (order: IOrder) => {
        setOrders((prevOrders) => {
          const index = prevOrders.findIndex((o) => o._id === order._id);
          const newOrders = [...prevOrders];
          newOrders[index] = order;
          return newOrders;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-brown-light-active via-white to-brown-light-active p-8 space-y-4">
      {/* Header Section */}
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
        <Link href="/api/auth/signout">
          <div className="border-2 border-primary rounded-full px-3 text-primary h-fit py-1 flex flex-row justify-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200">
            <SettingsIcon />
            <div className="font-medium">Log out</div>
          </div>
        </Link>
      </div>

      {/* My Restaurant Button */}
      <button
        className="mt-4 p-4 font-medium text-white w-full bg-primary rounded-full flex flex-row justify-between hover:bg-brown-dark-hover transition-all duration-30"
        onClick={() => router.push("myrestaurant/mymenu")}
      >
        <div>My Restaurant</div>
        <ArrowForwardIcon />
      </button>

      {/* Orders Section */}
      <div className="w-full flex flex-row justify-between">
        <div className="text-2xl font-medium">Orders</div>
        <div className="items-center flex justify-center">
          {restaurant && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOpen}
                onChange={handleRestaurantSetStatus}
                className="sr-only peer"
              />
              {/* Checkbox Styling */}
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue"></div>
              <span className="ml-1 font-medium text-sm text-black peer-checked:text-blue dark:text-gray-300">
                {isOpen ? "Open" : "Closed"}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Section Buttons */}
      {isOpen && (
        <div className="w-full flex justify-between space-x-2">
          <Button
            className="flex-grow"
            onClick={() => setSelectedSection("pending")}
          >
            <div
              className={`flex-grow font-medium border-2 border-primary rounded-full px-3 text-primary h-fit py-1 flex flex-row justify-center hover:bg-primary hover:text-white transition-all duration-200 ${
                selectedSection === "pending" ? "bg-primary text-white" : ""
              }`}
            >
              pending
            </div>
          </Button>
          <Button
            className="flex-grow"
            onClick={() => setSelectedSection("preparing")}
          >
            <div
              className={`flex-grow font-medium border-2 border-primary rounded-full px-3 text-primary h-fit py-1 flex flex-row justify-center hover:bg-primary hover:text-white transition-all duration-200 ${
                selectedSection === "cooking" ? "bg-primary text-white" : ""
              }`}
            >
              cooking
            </div>
          </Button>
          <Button
            className="flex-grow"
            onClick={() => setSelectedSection("completed")}
          >
            <div
              className={`flex-grow font-medium border-2 border-primary rounded-full px-3 text-primary h-fit py-1 flex flex-row justify-center hover:bg-primary hover:text-white transition-all duration-200 ${
                selectedSection === "complete" ? "bg-primary text-white" : ""
              }`}
            >
              complete
            </div>
          </Button>
        </div>
      )}

      {/* Display Panels based on Section */}
      {isOpen && (
        <>
          {selectedSection === "pending" && (
            <PendingPanel
              orders={orders.filter((order) => order.status === "pending")}
            />
          )}
          {selectedSection === "preparing" && (
            <CookingPanel
              orders={orders.filter((order) => order.status === "preparing")}
            />
          )}
          {selectedSection === "completed" && (
            <CompletePanel
              orders={orders.filter((order) => order.status === "completed")}
            />
          )}
        </>
      )}
    </main>
  );
}
