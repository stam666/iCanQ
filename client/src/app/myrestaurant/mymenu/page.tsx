"use client";
import InputText from "@/components/inputText";
import MenuService from "@/libs/menuService";
import menuService from "@/libs/menuService";
import restaurantService from "@/libs/restaurantService";
import { IMenu } from "@/models/menu.model";
import { IRestaurant } from "@/models/restaurant.model";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StarIcon from "@mui/icons-material/Star";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyMenuPage() {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [restaurantMenu, setRestaurantMenu] = useState<IMenu[]>([]);
  const [isMenuCreated, setIsMenuCreated] = useState<boolean>(false);
  useEffect(() => {
    const getMyRestaurant = async () => {
      if (session) {
        try {
          const restaurantData: IRestaurant =
            await restaurantService.getMyRestaurant(session.user._id);
          setRestaurant(restaurantData);
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      }
    };
    getMyRestaurant();
  }, []);
  useEffect(() => {
    const fetchRestaurantMenu = async () => {
      try {
        if (restaurant) {
          const menu = await restaurantService.getRestaurantMenu(
            restaurant?._id,
          );
          setRestaurantMenu(menu);
        }
      } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching restaurant menu: ", error);
      }
    };

    // Call the async function immediately
    fetchRestaurantMenu();
  }, [restaurant, isMenuCreated]);
  const closeSheet = () => {
    setIsSheetOpen(false);
    setMenuPrice(0);
    setMenuName("");
    setIsMenuCreated(false);
  };
  const handleCreateMenu = async () => {
    setMenuName("");
    setMenuPrice(0);
    if (restaurant) {
      const res = await menuService.createMenu(
        restaurant._id,
        menuName,
        menuPrice,
      );
      setIsMenuCreated(res.success);
    }
  };
  const handleDeleteItem = async (id: string) => {
    const updatedMenu = restaurantMenu.filter((item) => item.menuId !== id);
    setRestaurantMenu(updatedMenu);
    if (restaurant) {
      await MenuService.deleteMenu(restaurant._id, id);
    }
  };
  return (
    <main className="min-h-screen bg-white p-8">
      <>
        <div className="h-[25vh] w-full -m-8 z-0 bg-primary absolute"></div>
        <div className="relative z-10">
          <div className="flex flex-row justify-between pt-[60px] text-white">
            <Link href="/myrestaurant" className="">
              <ArrowBackIosNewIcon />
            </Link>
            <div className="text-2xl font-medium text-center">
              {restaurant?.restaurantName}
            </div>
            <div></div>
          </div>
          <div className="bg-white rounded-2xl flex flex-col p-4 shadow-lg space-y-4 mt-8">
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
          <div className="flex flex-row justify-between items-center mt-8">
            <div className="text-2xl font-medium text-center ">Menu</div>
            <div
              onClick={() => {
                setIsSheetOpen(true);
              }}
              className={
                "rounded-full px-3 bg-blue text-white h-fit py-1 flex flex-row justify-center space-x-2 hover:cursor-pointer transition-all duration-200"
              }
            >
              <AddIcon />
              <div className="font-medium">Menu</div>
            </div>
          </div>
          {restaurantMenu.map((menu: IMenu) => (
            <div key={menu.menuId} className="mt-8">
              <div className="flex flex-row rounded-2xl bg-white shadow-lg">
                <div className="w-4/5 flex flex-col p-4 space-y-2">
                  <div className="flex flex-row space-x-4">
                    <div className="text-left">{menu.name}</div>
                  </div>
                  {menu.price ? (
                    <p className="text-w text-2xl">{menu.price + "฿"}</p>
                  ) : null}
                </div>
                <div className="bg-red text-white justify-center items-center text-center w-1/5 rounded-tr-2xl rounded-br-2xl">
                  <div
                    className="flex w-full h-full justify-center items-center text-center"
                    onClick={() => handleDeleteItem(menu.menuId)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {<div className="w-full"></div>}
        {isSheetOpen && (
          <div className="fixed inset-0 items-center justify-center bg-black bg-opacity-50 z-10 flex">
            <div className="bg-white rounded-t-xl rounded-b-2xl px-4 w-full m-4 space-y-4 py-5">
              <div className="w-full items-end justify-end flex">
                <button
                  className="p-2 rounded-full -m-2"
                  onClick={() => closeSheet()}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="font-medium text-xl">Add Menu</div>
              <InputText
                placeholder={"Menu Name"}
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
              <InputText
                placeholder={"Menu Price"}
                value={menuPrice.toString()}
                onChange={(e) => setMenuPrice(parseInt(e.target.value) || 0)}
              />
              <button
                disabled={menuName === "" || menuPrice === 0}
                onClick={(e) => {
                  handleCreateMenu();
                  closeSheet();
                }}
                className="mt-2 p-4 bg-primary text-white rounded-2xl text-center w-full disabled:bg-white-normal-active"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </>
    </main>
  );
}
