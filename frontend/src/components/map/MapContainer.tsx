import React, { useCallback, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, ViewStateChangeEvent } from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Info, Users, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setViewport, setSelectedLocationId } from '../../features/map/mapSlice';
import { useGetEventsQuery } from '../../services/eventApi';
import 'mapbox-gl/dist/mapbox-gl.css';

// We need an exact token. Given in instructions, or fallback.
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const MapContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { viewport, selectedLocationId, toggles } = useAppSelector((state) => state.map);
  
  // Use generic getEvents to populate map (simulating nearby events endpoint conceptually for mapping)
  const { data } = useGetEventsQuery();
  const activeEvents = data?.events || [];

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    dispatch(setViewport(evt.viewState));
  }, [dispatch]);

  const mapData = useMemo(() => {
    return activeEvents.filter(e => {
      // Must have coordinates
      const loc = e.location as any;
      return loc?.coordinates && loc.coordinates.length === 2 && toggles.events;
    });
  }, [activeEvents, toggles.events]);

  const selectedEvent = useMemo(() => {
    return activeEvents.find(e => e._id === selectedLocationId);
  }, [activeEvents, selectedLocationId]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center p-6 text-center border-l border-white/5">
        <div className="max-w-md">
          <MapPin className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Mapbox Token Missing</h2>
          <p className="text-gray-400">Please provide a valid <code className="bg-gray-800 px-1 rounded text-red-300">VITE_MAPBOX_TOKEN</code> in your environment variables to enable the interactive map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <Map
        {...viewport}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl 
          position="bottom-right" 
          trackUserLocation 
          showUserHeading
          style={{ background: '#1f2937', fill: '#818cf8' }}
        />

        {mapData.map((event) => {
          const coords = (event.location as any).coordinates;
          const isSelected = selectedLocationId === event._id;
          
          return (
            <Marker
              key={event._id}
              longitude={coords[0]}
              latitude={coords[1]}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                dispatch(setSelectedLocationId(event._id));
              }}
              style={{ cursor: 'pointer', zIndex: isSelected ? 10 : 1 }}
            >
              <div className="relative flex items-center justify-center">
                 {isSelected && (
                    <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-indigo-400 opacity-75"></span>
                 )}
                 <div className={`
                   relative z-10 w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center transition-all bg-gray-900
                   ${isSelected ? 'border-indigo-500 scale-125' : 'border-indigo-500/50 hover:border-indigo-400 scale-100'}
                 `}>
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-indigo-200'}`} />
                 </div>
              </div>
            </Marker>
          );
        })}

        {/* Selected Popup logic */}
        {selectedEvent && (selectedEvent.location as any)?.coordinates && (
           <Popup
             longitude={(selectedEvent.location as any).coordinates[0]}
             latitude={(selectedEvent.location as any).coordinates[1]}
             anchor="bottom"
             onClose={() => dispatch(setSelectedLocationId(null))}
             offset={24}
             className="z-50"
             closeButton={false}
             maxWidth="300px"
           >
             <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl p-0 min-w-[240px]">
               {selectedEvent.coverImage && (
                 <img src={selectedEvent.coverImage} className="w-full h-24 object-cover" alt="Event cover" />
               )}
               <div className="p-4">
                 <div className="flex items-start justify-between gap-3 mb-2">
                   <h3 className="font-bold text-white leading-tight">{selectedEvent.title}</h3>
                   <button onClick={() => dispatch(setSelectedLocationId(null))} className="text-gray-500 hover:text-white shrink-0">
                      <X className="w-4 h-4" />
                   </button>
                 </div>
                 
                 <div className="flex flex-col gap-1 text-xs text-gray-400 mb-3">
                   <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-indigo-400" /> {(selectedEvent.location as any).name || 'Campus Resource'}</span>
                   <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-400" /> {selectedEvent.rsvpCount} Attending</span>
                 </div>

                 <a 
                   href={`/events/${selectedEvent._id}`}
                   className="block w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-center rounded-lg text-white font-semibold text-xs transition-colors"
                 >
                   View Details
                 </a>
               </div>
             </div>
           </Popup>
        )}
      </Map>
    </div>
  );
};
