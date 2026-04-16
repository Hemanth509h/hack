import React from 'react';
import { useGetEventsQuery } from '../../services/eventApi';
import { useAppSelector } from '../../store/hooks';
import { EventFilters } from '../../components/events/EventFilters';
import { EventCard } from '../../components/events/EventCard';
import { Loader2, Plus, CalendarX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventFilter, IEvent } from '../../types/event';
import { RootState } from '../../store';

const EventsPage: React.FC = () => {
  const { searchQuery, selectedCategory } = useAppSelector((state: RootState) => state.events);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const filters: EventFilter = {
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(selectedCategory !== 'All Events' ? { category: selectedCategory } : {}),
    status: 'published',
  };

  const { data, isLoading, isError, isFetching } = useGetEventsQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const canCreateEvent = user?.role === 'admin' || user?.role === 'club_leader';

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 tracking-tight">
            Happening In The Quad
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover workshops, hackathons, sports, and cultural events. Connect with other students and build your campus portfolio.
          </p>
        </div>

        {canCreateEvent && (
          <Link
            to="/events/create"
            className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] shrink-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters */}
      <EventFilters />

      {/* Results */}
      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-400">
          <p>Failed to load events. Please try again later.</p>
        </div>
      ) : !data?.events || data.events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6">
            <CalendarX className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-400 max-w-md">
            We couldn't find any events matching your current filters. Try adjusting your search or check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.events.map((event: IEvent, i: number) => (
            <EventCard
              key={event._id}
              event={event}
              isRecommended={i === 0 && selectedCategory === 'All Events' && !searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
