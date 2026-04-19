import React, { useEffect } from 'react';
import { useGetEventsQuery } from '../../services/eventApi';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useUpdateLocationMutation } from '../../services/profileApi';
import { useAppSelector } from '../../store/hooks';
import EventCard from '../discovery/EventCard';
import { MapPin } from 'lucide-react';
import { getDistance, convertDistance } from 'geolib';

const NearbyEvents = () => {
  const { coordinates, loading, error, requestLocation, permission } = useGeolocation();
  const { user } = useAppSelector(state => state.auth);
  const [updateLocation] = useUpdateLocationMutation();
  const { data, isLoading } = useGetEventsQuery(); // Currently fetches all, in a real scenario use the /nearby endpoint if implemented in RTK Query

  useEffect(() => {
    if (coordinates && user?.id) {
      updateLocation({ userId: user.id, latitude: coordinates.lat, longitude: coordinates.lng });
    }
  }, [coordinates, user?.id, updateLocation]);

  if (loading || isLoading) return <div className="animate-pulse h-40 bg-black/5 dark:bg-white/5 rounded-xl"></div>;

  if (error || permission === 'denied') {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
        <MapPin className="text-red-400 mb-2" size={24} />
        <h3 className="text-red-400 font-medium">Location Access Denied</h3>
        <p className="text-sm text-red-400/80 mb-3">Enable location to see events near you</p>
        <button onClick={requestLocation} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 py-1.5 px-3 rounded-lg transition-colors">
          Retry / Grant Access
        </button>
      </div>
    );
  }
  // Calculate distances locally for robust sorting
  let eventsWithDistance = (data?.events || [])
    .filter(e => {
        const loc = e.location;
        return loc?.coordinates && loc.coordinates.length === 2;
    })
    .map(event => {
      const coords = (event.location).coordinates;
      let distanceMiles = null;
      if (coordinates) {
         const distMeters = getDistance(
            { latitude: coordinates.lat, longitude: coordinates.lng },
            { latitude: coords[1], longitude: coords[0] } // [lng, lat]
         );
         distanceMiles = convertDistance(distMeters, 'mi');
      }
      return { ...event, distanceMiles };
    });

  if (coordinates) {
     eventsWithDistance.sort((a, b) => (a.distanceMiles || 0) - (b.distanceMiles || 0));
  }
  return (
    <div className="mb-10">
       <div className="flex items-center justify-between mb-4">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><MapPin size={18} /></span>
            Nearby Events
         </h2>
       </div>

       {eventsWithDistance.length > 0 ? (
         <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar">
           {eventsWithDistance.slice(0, 5).map(event => (
              <div key={event._id} className="min-w-[280px] md:min-w-[320px] snap-center">
                 <EventCard event={event} />
                 {event.distanceMiles !== null && (
                    <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">{event.distanceMiles.toFixed(1)} miles away</div>
                 )}
              </div>
           ))}
         </div>
       ) : (
         <div className="text-center py-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-400">
            No events with location data found nearby.
         </div>
       )}
    </div>
  );
};

export default NearbyEvents;
