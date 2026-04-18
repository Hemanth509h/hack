import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Calendar, Users, SlidersHorizontal } from 'lucide-react';
import api from '../../lib/api';
import { motion } from 'framer-motion';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQ = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(rawQ);
  const [type, setType] = useState<'all' | 'event' | 'club'>(
    (searchParams.get('type') as 'all' | 'event' | 'club') || 'all'
  );
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Only fire full search if query exists or user changed filters
    const fetchData = async () => {
      if (!rawQ) {
         setResults([]); 
         return;
      }
      setIsLoading(true);
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(rawQ)}&type=${type}`);
        setResults(data.results || []);
        setTotal(data.pagination?.total || 0);
      } catch (err) {
        console.error('Search operation failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rawQ, type]);

  const handleSearchCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, type });
    }
  };

  const handleTypeChange = (newType: 'all' | 'event' | 'club') => {
    setType(newType);
    if (rawQ) setSearchParams({ q: rawQ, type: newType });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-24 pb-20">
      <div className="max-w-full md:px-12 lg:px-20 mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl relative top-8 sticky">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                 <SlidersHorizontal size={18} /> Filters
              </h3>

              <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-gray-500 uppercase">Categories</h4>
                 <div className="flex flex-col gap-2">
                   <button 
                     onClick={() => handleTypeChange('all')}
                     className={`text-left px-3 py-2 rounded-lg text-sm transition font-medium ${type === 'all' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800'}`}
                   >
                     Everything
                   </button>
                   <button 
                     onClick={() => handleTypeChange('event')}
                     className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition font-medium ${type === 'event' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800'}`}
                   >
                     <CalendarIcon size={16} /> Events Only
                   </button>
                   <button 
                     onClick={() => handleTypeChange('club')}
                     className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition font-medium ${type === 'club' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800'}`}
                   >
                     <Users size={16} /> Clubs Only
                   </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Search Panel */}
        <div className="md:col-span-3">
           <form onSubmit={handleSearchCommit} className="relative mb-8 shadow-xl">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Search className="text-blue-500" size={24} />
             </div>
             <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-14 pr-6 text-xl text-gray-900 dark:text-white placeholder-gray-500 outline-none focus:border-blue-500 transition shadow-inner"
               placeholder="Search the entire campus..."
             />
             <button 
               type="submit" 
               className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white px-5 py-2 rounded-xl font-bold transition"
             >
               Search
             </button>
           </form>

           {/* Metrics */}
           {rawQ && (
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                 {isLoading ? 'Scanning matrix...' : `Displaying ${total} optimal matches for "${rawQ}"`}
              </div>
           )}

           {isLoading ? (
             <div className="py-20 flex justify-center">
                 <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-xl"></div>
             </div>
           ) : results.length > 0 ? (
             <div className="space-y-4">
                 {results.map((item, i) => {
                    const isEvent = item.title !== undefined;
                    const destination = isEvent ? `/events/${item._id}` : `/clubs/${item._id}`;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={item._id}
                      >
                       <Link 
                         to={destination}
                         className="flex flex-col md:flex-row gap-4 p-5 bg-white dark:bg-gray-900/50 hover:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:border-gray-700 rounded-2xl transition group"
                       >
                          {/* Image or Logo block */}
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${isEvent ? 'bg-indigo-900/40 text-indigo-400' : 'bg-pink-900/40 text-pink-400'}`}>
                              {item.coverImage || item.logo ? (
                                <img src={item.coverImage || item.logo} alt={isEvent ? item.title : item.name} className="w-full h-full object-cover" />
                              ) : isEvent ? <CalendarIcon /> : <Users />}
                          </div>

                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-gray-200 group-hover:text-gray-900 dark:text-white transition">{isEvent ? item.title : item.name}</h3>
                                <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${isEvent ? 'border-indigo-500/30 text-indigo-400' : 'border-pink-500/30 text-pink-400'}`}>
                                    {isEvent ? 'Event' : 'Club'}
                                </span>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {item.description}
                             </p>
                          </div>
                       </Link>
                      </motion.div>
                    )
                 })}
             </div>
           ) : rawQ ? (
             <div className="py-24 text-center">
                 <div className="w-24 h-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-700" size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results matched</h2>
                 <p className="text-gray-500">Check your spelling or drop the filters.</p>
             </div>
           ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
