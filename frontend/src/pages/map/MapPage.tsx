import React, { useEffect } from 'react';
import { MapContainer } from '../../components/map/MapContainer';
import { EventsNearbyPanel } from '../../components/map/EventsNearbyPanel';
import { useAppDispatch } from '../../store/hooks';
import { setViewport } from '../../features/map/mapSlice';

const MapPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // On mount, try to get user's live location if permitted to center the map natively before Mapbox loads.
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setViewport({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              zoom: 15,
            })
          );
        },
        (error) => {
          console.warn('Geolocation permission denied or failed.', error);
        }
      );
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen w-full bg-gray-950 overflow-hidden pt-16">
      <div className="w-full md:w-[400px] h-full shrink-0 relative z-20">
        <EventsNearbyPanel />
      </div>
      <div className="flex-1 h-full relative z-10 hidden md:block">
        <MapContainer />
      </div>
      
      {/* Mobile Map Toggle could go here via a floating button if on a smaller screen, but for now we hide map container on mobile to focus on list, or vice versa depending on UI requirements. Currently map hidden on small mobile for simplicity */ }
    </div>
  );
};

export default MapPage;
