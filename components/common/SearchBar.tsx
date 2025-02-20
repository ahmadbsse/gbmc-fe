import { Search } from "lucide-react";

const SearchBar = ({ setSearchQuery }) => {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-gray-300 pl-2 focus:border-primary focus:ring-1 focus:ring-primary md:w-64">
      <Search className="h-6 w-6 pl-1 text-primary" />
      <input
        type="text"
        placeholder="Search..."
        className="w-52 rounded-lg py-2 pr-4 outline-none focus:border-transparent focus:outline-none"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
