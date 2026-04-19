import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery, setSelectedCategory } from '../../features/events/eventSlice';
import { motion } from 'framer-motion';

const CATEGORIES = ['All Events', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Career'];

export const EventFilters = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory } = useAppSelector((state) => state.events);
  
  // Local state for debounced search
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-800 rounded-xl leading-5 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
          placeholder="Search events by title, tag, or organization..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Categories Scrollable Row */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0 items-center">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={category}
              onClick={() => dispatch(setSelectedCategory(category))}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center ${
                isSelected
                  ? 'bg-indigo-600 text-gray-900 dark:text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800'
              }`}
            >
              {category === 'All Events' && <SlidersHorizontal className="w-4 h-4 mr-2" />}
              {category}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
