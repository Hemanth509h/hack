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
    <div className="min-h-screen bg-[#030303] pb-32">
      {/* Immersive Cover Image */}
      <div className="h-[50vh] md:h-[65vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent z-10" />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={
            event.coverImage ||
            `https://source.unsplash.com/random/1600x900/?${event.category},event`
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-28 left-6 md:left-12 z-20">
          <Link
            to="/events"
            className="flex items-center text-xs font-black uppercase tracking-widest text-white/70 hover:text-white glass bg-white/5 px-5 py-3 rounded-2xl border-white/10 transition-all hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pulse
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-40 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[3rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-indigo-500/20"
                >
                  <Info className="h-3 w-3" />
                  {event.category}
                </motion.div>
                
                <h1 className="text-4xl md:text-7xl font-display font-black text-white mb-10 leading-[0.9] tracking-tighter">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-12 pb-12 border-b border-white/5">
                  <div className="flex items-center glass bg-white/5 px-6 py-3 rounded-2xl border-white/5">
                    <div className="w-10 h-10 premium-gradient rounded-full flex items-center justify-center font-black text-white mr-4 shadow-lg">
                      {event.category.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Organized By</div>
                      <div className="text-white font-bold tracking-tight uppercase text-xs">The Quad Elite</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-black text-white tracking-tighter flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                    Event Manifesto
                  </h3>
                  <p className="text-gray-400 text-xl leading-relaxed font-light whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Admin/Organizer Terminal */}
            {(currentUser?.id === event.organizer._id || currentUser?.role === 'admin') && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass bg-indigo-500/5 border-indigo-500/20 rounded-[3rem] p-10 md:p-16 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl -mr-20 -mt-20" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 relative z-10">
                  <div>
                    <h3 className="text-3xl font-display font-black text-indigo-300 tracking-tighter flex items-center gap-4">
                      <ShieldCheck className="w-8 h-8" />
                      Command Center
                    </h3>
                    <p className="text-indigo-400/60 font-medium mt-1 uppercase text-[10px] tracking-widest">Operational Oversight</p>
                  </div>
                  <button 
                    onClick={() => setShowScanner(!showScanner)}
                    className="btn-primary py-4 px-8 shadow-indigo-500/30 text-[11px] font-black uppercase tracking-widest"
                  >
                    {showScanner ? 'Deactivate Scanner' : 'Activate Check-in'}
                  </button>
                </div>
                
                <AnimatePresence>
                   {showScanner && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-12 glass bg-white/5 rounded-3xl p-8 border-indigo-500/30"
                      >
                         <QRScanner eventId={event._id} />
                      </motion.div>
                   )}
                </AnimatePresence>

                <div className="flex items-center gap-4 mb-8">
                   <div className="w-2 h-10 bg-indigo-400 rounded-full" />
                   <h3 className="text-2xl font-display font-black text-white tracking-tighter">
                     Confirmed Delegates ({event.rsvpCount})
                   </h3>
                </div>
                <div className="glass bg-white/5 rounded-[2rem] p-8 border-white/5">
                  <AttendeeList eventId={event._id} />
                </div>
              </motion.div>
            )}

            {/* Public Attendee View */}
            {currentUser?.id !== event.organizer._id && currentUser?.role !== 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-[3rem] p-10 md:p-16 border-white/5"
              >
                <h3 className="text-3xl font-display font-black text-white mb-10 tracking-tighter">
                  Attendee Registry ({event.rsvpCount})
                </h3>
                <div className="glass bg-white/5 rounded-[2rem] p-8 border-white/5">
                  <AttendeeList eventId={event._id} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Immersive Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] sticky top-28 border-white/10 relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl -mr-20 -mb-20" />
              
              <div className="mb-10 space-y-6">
                <RSVPButton
                  eventId={event._id}
                  initialIsRsvpd={false}
                  className="w-full py-6 text-sm font-black uppercase tracking-[0.2em] shadow-indigo-500/30"
                />
                <div className="glass bg-white/5 rounded-[2.5rem] p-8 border-white/5 flex flex-col items-center">
                  <QRCodeDisplay eventId={event._id} />
                  <p className="mt-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Digital Access Key</p>
                </div>
              </div>

              <div className="space-y-8 mb-10">
                <div className="flex items-start group">
                  <div className="glass bg-white/5 p-4 rounded-2xl mr-5 text-indigo-400 border-white/10 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Schedule</p>
                    <p className="font-bold text-white tracking-tight">{formattedDate}</p>
                    <p className="text-gray-400 font-medium">
                      {formattedTime} — {formattedEndTime}
                    </p>
                    <div className="mt-4">
                      <AddToCalendarDropdown event={event} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="glass bg-white/5 p-4 rounded-2xl mr-5 text-indigo-400 border-white/10 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nexus Location</p>
                    <p className="font-bold text-white tracking-tight">{locationStr || 'TBA'}</p>
                    <p className="text-gray-400 font-medium">Campus Grounds</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="glass bg-white/5 p-4 rounded-2xl mr-5 text-indigo-400 border-white/10 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Duration</p>
                    <p className="font-bold text-white tracking-tight">{event.durationMinutes} Minutes Experience</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 glass bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all duration-300 border-white/10"
                >
                  <Share2 className="w-4 h-4" /> Synchronize Link
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
