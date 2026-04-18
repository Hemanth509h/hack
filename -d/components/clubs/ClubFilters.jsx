import React from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../features/clubs/clubSlice";

const CATEGORIES = [
  "All Interests",
  "Tech",
  "Arts",
  "Debate",
  "Volley",
  "Music",
  "Sports",
  "Cultural",
  "Business",
];

export const ClubFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.clubs.filters);

  const handleSearch = (e) => {
    dispatch(setFilters({ search: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    dispatch(
      setFilters({
        category: category === "All Interests" ? "" : category,
        page: 1,
      }),
    );
  };

  const handleSortChange = (e) => {
    dispatch(
      setFilters({
        sortBy: e.target.value,
        page: 1,
      }),
    );
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search for clubs, interests, or keywords..."
          className="block w-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
        />
      </div>

      {/* Categories & Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
          <Filter className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                filters.category === cat ||
                (cat === "All Interests" && !filters.category)
                  ? "bg-indigo-600 text-gray-900 dark:text-white shadow-lg shadow-indigo-500/30"
                  : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-gray-900 dark:text-white border border-gray-700/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <SortAsc className="h-4 w-4 text-gray-500" />
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-sm"
          >
            <option value="active">Most Active</option>
            <option value="new">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ClubFilters;
