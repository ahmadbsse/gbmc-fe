import { Search, X } from "lucide-react";
import { useRef } from "react";
import { sanitizeText } from "@/utils";

const SearchBar = ({ setSearchQuery, searchQuery }) => {
  const inputRef = useRef(null);

  const clearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white pl-2 focus:border-primary focus:ring-1 focus:ring-primary md:w-64">
      <Search className="h-8 w-8 pl-1 text-primary" />
      <input
        id="searchbar"
        type="text"
        ref={inputRef}
        placeholder="Search..."
        className="w-full rounded-lg py-2 pr-4 outline-none focus:border-transparent focus:outline-none"
        onChange={(e) => setSearchQuery(sanitizeText(e.target.value.trim()))}
      />
      {searchQuery != "" ? (
        <X className="h-8 w-8 pr-2 text-slate-600" onClick={clearSearch} />
      ) : null}
    </div>
  );
};

export default SearchBar;
