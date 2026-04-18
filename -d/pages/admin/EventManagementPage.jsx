import { motion } from "framer-motion";
import {
  PlusCircle,
  Search,
  MoreVertical,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetEventsQuery } from "../../services/eventApi";

export default function EventManagementPage() {
  const { data: eventsData, isLoading } = useGetEventsQuery();

  const events = eventsData?.events || [];

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]"
          >
            Logistics Control
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-3 tracking-tighter text-gray-900 dark:text-white">
            Event Governance
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Oversee, edit, and coordinate all campus-wide occurrences.
          </p>
        </div>
        <Link
          to="/events/create"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
        >
          <PlusCircle size={18} /> Schedule New Event
        </Link>
      </div>

      <div className="glass rounded-[3rem] p-10 border-black/5 dark:border-white/5 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search events by name, organizer, or venue..."
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-gray-900 dark:text-white focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <th className="pb-6 pl-4">Event Identity</th>
                <th className="pb-6">Date & Time</th>
                <th className="pb-6">Venue</th>
                <th className="pb-6 text-center">Engagement</th>
                <th className="pb-6 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs"
                  >
                    Synchronizing Event Streams...
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event._id}
                    className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-6 pl-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold overflow-hidden border border-black/10 dark:border-white/10">
                          {event.coverImage ? (
                            <img
                              src={event.coverImage}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            event.title.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-bold tracking-tight">
                            {event.title}
                          </div>
                          <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">
                            {event.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
                        <Clock size={14} className="text-indigo-500" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
                        <MapPin size={14} className="text-purple-500" />
                        {event.location}
                      </div>
                    </td>
                    <td className="py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">
                        <Users size={12} />
                        {event.attendeeCount}
                      </div>
                    </td>
                    <td className="py-6 text-right pr-4">
                      <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
