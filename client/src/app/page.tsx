import HomeTopBar from "@/components/HomeTopBar";
import RestaurantPanel from "@/components/RestaurantPanel";
import SearchBar from "@/components/SearchBar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-tr from-brown-light-active via-white to-brown-light-active space-y-8">
      <div className="w-full">
        <HomeTopBar />
        <button className="mt-4 p-4 font-medium text-white w-full bg-primary rounded-full flex flex-row justify-between hover:bg-brown-dark-hover transition-all duration-30">
          <div className="">History</div>
          <ArrowForwardIcon />
        </button>
      </div>
      <div className="w-full space-y-6 flex flex-col">
        <div className="text-xl font-medium text-left">Restaurant</div>
        <SearchBar />
        <RestaurantPanel />
      </div>
    </main>
  );
}
