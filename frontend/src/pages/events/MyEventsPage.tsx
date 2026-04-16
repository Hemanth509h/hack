import React, { useState } from 'react';
import { useGetMyRsvpsQuery } from '../../services/eventApi';
import { useAppSelector } from '../../store/hooks';
import { EventCard } from '../../components/events/EventCard';
import { Loader2, TicketPercent } from 'lucide-react';
import { motion } from 'framer-motion';
import { RSVPResponse } from '../../types/event';
import { RootState } from '../../store';

type TabType = 'upcoming' | 'past' | 'cancelled';

const MyEventsPage: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const userId = user?.id ?? '';

  const { data, isLoading } = useGetMyRsvpsQuery(userId, {
    skip: !userId,
  });

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const getFilteredEvents = (): RSVPResponse[] => {
    if (!data?.events) return [];
    const now = new Date();

    return data.events.filter((rsvp: RSVPResponse) => {
      const eventDate = new Date(rsvp.event.date);

      if (activeTab === 'cancelled') {
        return rsvp.status === 'cancelled' || rsvp.event.status === 'cancelled';
      }
      if (activeTab === 'upcoming') {
        return eventDate >= now && rsvp.status !== 'cancelled' && rsvp.event.status !== 'cancelled';
      }
      if (activeTab === 'past') {
        return eventDate < now && rsvp.status !== 'cancelled' && rsvp.event.status !== 'cancelled';
      }
      return false;
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center">
          <TicketPercent className="mr-3 text-indigo-400 w-8 h-8" /> My RSVPs
        </h1>
        <p className="text-gray-400">Manage your event schedule and RSVPs.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
        {(['upcoming', 'past', 'cancelled'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-medium text-sm capitalize whitespace-nowrap transition-colors relative ${
              activeTab === tab ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-2xl">
          <p className="text-gray-400">You have no {activeTab} events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((rsvp: RSVPResponse) => (
            <EventCard key={rsvp._id} event={rsvp.event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
