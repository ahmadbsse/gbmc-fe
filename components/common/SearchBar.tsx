import { Search } from "lucide-react";

const SearchBar = ({ setSearchQuery }) => {
  return (
    <>
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-64 rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-4 outline-none focus:border-primary focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-primary" />
      </div>
    </>
  );
};

export default SearchBar;
