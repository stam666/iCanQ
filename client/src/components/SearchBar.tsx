"use client";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  return (
    <form>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <SearchIcon className="text-white-normal-active" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-12 text-sm text-gray-900 border border-white-normal-active rounded-full bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          required
          onChange={() => {}}
        />
      </div>
    </form>
  );
}
