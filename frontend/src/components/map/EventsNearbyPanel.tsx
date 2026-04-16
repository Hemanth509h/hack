import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleLayer, setSelectedLocationId, setSearchQuery } from '../../features/map/mapSlice';
import { useGetEventsQuery } from '../../services/eventApi';
import { Map, MapPin, Building, Utensils, Navigation, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventsNearbyPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toggles, selectedLocationId, searchQuery } = useAppSelector((state) => state.map);
  const { data } = useGetEventsQuery();
  const activeEvents = data?.events || [];

  const filteredEvents = activeEvents.filter(e => {
     if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
     return !!(e.location as any)?.coordinates;
  });

  return (
    <div className="h-full w-full bg-gray-950 flex flex-col pt-24 border-r border-white/5 relative z-10 shadow-2xl">
      <div className="px-6 pb-6 border-b border-white/5 shrink-0">
        <h1 className="text-3xl font-black text-white mb-2">Campus Map</h1>
        <p className="text-gray-400 text-sm mb-6">Explore what's happening around you.</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search events, buildings..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button 
           onClick={() => dispatch(toggleLayer('events'))}
           className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all border ${toggles.events ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10' : 'bg-gray-900 border-gray-800 text-gray-500'}`}>
            <MapPin className="w-3.5 h-3.5" /> Events
          </button>
          <button 
           onClick={() => dispatch(toggleLayer('buildings'))}
           className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all border ${toggles.buildings ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-gray-900 border-gray-800 text-gray-500'}`}>
            <Building className="w-3.5 h-3.5" /> Buildings
          </button>
          <button 
           onClick={() => dispatch(toggleLayer('dining'))}
           className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all border ${toggles.dining ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-gray-900 border-gray-800 text-gray-500'}`}>
            <Utensils className="w-3.5 h-3.5" /> Dining
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredEvents.map((event) => (
          <div 
            key={event._id}
            onClick={() => dispatch(setSelectedLocationId(event._id))}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
              selectedLocationId === event._id 
                ? 'bg-indigo-900/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                : 'bg-gray-900/50 border-gray-800 hover:bg-gray-900 hover:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-bold text-sm ${selectedLocationId === event._id ? 'text-indigo-300' : 'text-gray-200'}`}>
                 {event.title}
              </h3>
              {event.status === 'published' && (
                 <span className="shrink-0 text-[9px] font-black tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded uppercase flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                 </span>
              )}
            </div>
            
            <div className="space-y-1.5 mt-3">
               <div className="flex items-center text-xs text-gray-400 gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  <span className="truncate">{(event.location as any)?.name || 'Main Campus'}</span>
               </div>
               <div className="flex items-center text-xs text-gray-400 gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
               </div>
            </div>

            <AnimatePresence>
               {selectedLocationId === event._id && (
                  <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="mt-4 flex gap-2 overflow-hidden"
                  >
                     <Link to={`/events/${event._id}`} className="flex-1 text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors">
                        View Details
                     </Link>
                     <button className="flex-1 text-center py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg transition-colors border border-gray-700 flex items-center justify-center gap-1">
                        <Navigation className="w-3 h-3" /> Route
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
        ))}

        {filteredEvents.length === 0 && (
           <div className="h-40 flex flex-col items-center justify-center text-gray-500 text-center px-4 border border-dashed border-gray-800 rounded-2xl">
              <Map className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No mapped events match your filters right now.</p>
           </div>
        )}
      </div>
    </div>
  );
};
