import React from 'react';
import { useGetEventsQuery } from '../../services/eventApi';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { EventFilters } from '../../components/events/EventFilters';
import { EventCard } from '../../components/events/EventCard';
import { Plus, CalendarX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventFilter, IEvent } from '../../types/event';
import { RootState } from '../../store';
import PageContainer from '../../components/layout/PageContainer';

const EventsPage: React.FC = () => {
  const { searchQuery, selectedCategory } = useAppSelector((state) => state.events);
  const { user } = useAppSelector((state) => state.auth);

  const filters = {
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(selectedCategory !== 'All Events' ? { category: selectedCategory } : {}),
    status: 'published',
  };

  const { data, isLoading, isError, isFetching } = useGetEventsQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const canCreateEvent = user?.role === 'admin';

  return (
    <PageContainer className="pb-24 pt-10">
      {/* Premium Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8 px-4">
        <div className="text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]"
          >
            Live Campus Pulse
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-6 leading-[0.9] tracking-tighter">
            Happening In <br />
            <span className="text-gradient">The Quad.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl font-light leading-relaxed">
            Discover workshops, hackathons, sports, and cultural festivals. Connect with visionaries and build your campus legacy.
          </p>
        </div>

        {canCreateEvent && (
          <Link
            to="/events/create"
            className="btn-primary px-10 shadow-indigo-500/40"
          >
            <Plus className="w-5 h-5 mr-2 inline-block" />
            Create Event
          </Link>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="mb-16">
        <EventFilters />
      </div>

      {/* Dynamic Results Grid */}
      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 bg-indigo-500/10 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Syncing with campus servers...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-32 glass rounded-[3rem] border-red-500/20 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <CalendarX className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-red-400 text-xl font-bold">Failed to load events.</p>
          <button className="mt-8 btn-glass border-red-500/20 text-red-400">Retry Connection</button>
        </div>
      ) : !data?.events || data.events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10">
          <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
            <CalendarX className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Quiet on the Front</h3>
          <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed font-light">
            No events match your current filters. Be the pioneer and <span className="text-indigo-400 font-bold">start something new</span> today!
          </p>
          <button className="mt-10 btn-glass">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.events.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <EventCard
                event={event}
                isRecommended={i === 0 && selectedCategory === 'All Events' && !searchQuery}
              />
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default EventsPage;
