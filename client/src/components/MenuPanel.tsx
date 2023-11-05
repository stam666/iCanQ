import InputText from "@/components/inputText";
import MenuCard from "@/components/MenuCard";
import restaurantService from "@/libs/restaurantService";
import { IMenu } from "@/models/menu.model";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MenuPanel({
  params,
  addToCart,
}: {
  params: { rid: string };
  addToCart: Function;
}) {
  const [restaurantMenu, setRestaurantMenu] = useState<IMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  useEffect(() => {
    // Define an async function to fetch restaurant menu
    const fetchRestaurantMenu = async () => {
      try {
        const menu = await restaurantService.getRestaurantMenu(params.rid);
        setRestaurantMenu(menu);
      } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching restaurant menu: ", error);
      }
    };

    // Call the async function immediately
    fetchRestaurantMenu();
  }, [params.rid]);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const handleMenuCardClick = (menu: IMenu) => {
    console.log(menu);
    setSelectedMenu(menu);
  };

  const closeBottomSheet = () => {
    setNote("");
    setAmount(0);
    setSelectedMenu(null);
  };
  const imgSrcPlaceHolder = "/images/food1.jpeg";
  return (
    <>
      {restaurantMenu.map((menu: IMenu) => (
        <div
          key={menu.menuId}
          onClick={() => handleMenuCardClick(menu)}
          className="mt-8"
        >
          <MenuCard
            key={menu.menuId}
            name={menu.name}
            price={menu.price}
            imgSrc={"/images/food1.jpeg"}
          />
        </div>
      ))}
      {selectedMenu && (
        <div className="fixed inset-0 items-center justify-center bg-black bg-opacity-50 z-10 flex">
          <div className="bg-white rounded-t-xl rounded-b-2xl px-4 w-full m-4 space-y-4 py-5">
            <div className="w-full items-end justify-end flex">
              <button
                className="p-2 rounded-full -m-2"
                onClick={closeBottomSheet}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-medium text-xl">{selectedMenu.name}</div>
              <div className="font-medium text-xl">{selectedMenu.price}฿</div>
            </div>
            {selectedMenu.imgSrc || imgSrcPlaceHolder ? (
              <div className="relative w-full h-32 md:h-64 justify-center flex">
                <Image
                  fill={true}
                  src={selectedMenu.imgSrc || imgSrcPlaceHolder}
                  alt="restuarant picture"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="flex flex-row space-x-8 justify-center ">
              <button
                className="bg-primary rounded-full w-7 h-7 text-white"
                onClick={() => {
                  setAmount((prevState) =>
                    prevState != 0 ? prevState - 1 : prevState,
                  );
                }}
              >
                <RemoveIcon />
              </button>
              <div className="text-2xl">{amount}</div>
              <button
                className="bg-primary rounded-full w-7 h-7 text-white"
                onClick={() => {
                  setAmount((prevState) =>
                    prevState < 5 ? prevState + 1 : prevState,
                  );
                }}
              >
                <AddIcon />
              </button>
            </div>
            <div className="w-full text-left">Note (if any)</div>
            <InputText
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note"
            />
            <button
              disabled={amount === 0}
              onClick={(e) => {
                addToCart({
                  id: crypto.randomUUID(),
                  name: selectedMenu?.name,
                  amount: amount,
                  note: note,
                  totalPrice: amount * parseInt(selectedMenu?.price),
                });
                closeBottomSheet();
              }}
              className="mt-2 p-4 bg-primary text-white rounded-2xl text-center w-full disabled:bg-white-normal-active"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
}
