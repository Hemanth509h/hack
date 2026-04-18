import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const EventCard = ({ event, isRecommended }) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
    >
      <Link to={`/events/${event._id}`} className="block h-full">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
          <img
            src={
              event.coverImage ||
              `https://source.unsplash.com/random/800x600/?${event.category},event`
            }
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-950/80 backdrop-blur-md text-xs font-medium text-gray-200 rounded-full border border-gray-200 dark:border-gray-800">
              {event.category}
            </span>
            {isRecommended && (
              <span className="px-3 py-1 bg-indigo-500/90 backdrop-blur-md text-xs font-semibold text-gray-900 dark:text-white rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                AI Recommended
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
              <span className="truncate">
                {typeof event.location === "object" && event.location?.name
                  ? event.location.name
                  : event.locationDetails || "TBA"}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2 text-indigo-400" />
              <span>{event.rsvpCount} Attending</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="flex -space-x-2 overflow-hidden">
              {/* Placeholders for attendee avatars; in app, map over actual attendee avatars */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-900 bg-gray-700"
                >
                  <img
                    className="h-full w-full rounded-full"
                    src={`https://i.pravatar.cc/100?img=${event._id?.charCodeAt(0) + i}`}
                    alt=""
                  />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
              Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
