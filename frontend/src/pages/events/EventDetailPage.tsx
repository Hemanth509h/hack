import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetEventByIdQuery } from '../../services/eventApi';
import { RSVPButton } from '../../components/events/RSVPButton';
import { AttendeeList } from '../../components/events/AttendeeList';
import { Calendar, MapPin, Share2, ArrowLeft, Clock, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AddToCalendarDropdown from '../../components/events/AddToCalendarDropdown';
import QRCodeDisplay from '../../components/events/checkin/QRCodeDisplay';
import QRScanner from '../../components/events/checkin/QRScanner';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useGetEventByIdQuery(id!);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showScanner, setShowScanner] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <h2 className="text-2xl text-red-500 font-bold">Event not found.</h2>
      </div>
    );
  }

  const startDate = new Date(event.date);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60000);
  const formattedEndTime = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const locationStr =
    typeof event.location === 'object' && event.location?.name
      ? event.location.name
      : event.locationDetails ?? '';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Cover Image */}
      <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10" />
        <img
          src={
            event.coverImage ||
            `https://source.unsplash.com/random/1600x900/?${event.category},event`
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-24 left-6 z-20">
          <Link
            to="/events"
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white bg-gray-900/50 backdrop-blur px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-xl"
            >
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full mb-4 border border-indigo-500/30">
                {event.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8 pb-8 border-b border-gray-800">
                <div className="flex items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(event.category)}&background=random`}
                    alt="Organizer"
                    className="w-8 h-8 rounded-full border border-gray-700 mr-3"
                  />
                  <span className="text-sm font-medium">
                    Hosted by <span className="text-indigo-400">The Quad Clubs</span>
                  </span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-indigo-400" /> About this event
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </motion.div>

            {/* Organize & Manage Settings */}
            {(currentUser?._id === event.organizer._id || currentUser?.role === 'admin') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 md:p-10 mt-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Organizer Dashboard
                  </h3>
                  <button 
                    onClick={() => setShowScanner(!showScanner)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition font-medium text-sm shadow-lg shadow-indigo-500/20"
                  >
                    {showScanner ? 'Hide Scanner' : 'Check-in Scanner'}
                  </button>
                </div>
                
                <AnimatePresence>
                   {showScanner && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                      >
                         <QRScanner eventId={event._id} />
                      </motion.div>
                   )}
                </AnimatePresence>

                <h3 className="text-xl font-bold text-white mb-4 mt-4">
                  Attendees ({event.rsvpCount})
                </h3>
                <AttendeeList eventId={event._id} />
              </motion.div>
            )}

            {/* Attendees (Public view if not organizer) */}
            {currentUser?._id !== event.organizer._id && currentUser?.role !== 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-10"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Attendees ({event.rsvpCount})
                </h3>
                <AttendeeList eventId={event._id} />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl sticky top-24"
            >
              <div className="mb-6 space-y-4">
                <RSVPButton
                  eventId={event._id}
                  initialIsRsvpd={false}
                  className="w-full py-4 text-lg"
                />
                {/* Notice: You technically could show this conditionally on RSVP status if it was exposed to this scope */}
                <QRCodeDisplay eventId={event._id} />
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start">
                  <div className="bg-gray-800 p-2 rounded-lg mr-4 text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{formattedDate}</p>
                    <p className="text-gray-400">
                      {formattedTime} — {formattedEndTime}
                    </p>
                    <div className="mt-2 text-indigo-400">
                      <AddToCalendarDropdown event={event} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-800 p-2 rounded-lg mr-4 text-indigo-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{locationStr || 'TBA'}</p>
                    <p className="text-gray-400">On Campus</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-800 p-2 rounded-lg mr-4 text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{event.durationMinutes} Minutes</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-800/50 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Copy Event Link
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
