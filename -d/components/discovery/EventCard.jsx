import React from "react";
import { Calendar, MapPin, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EventCard = ({ event, featured }) => {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className={cn(
        "group relative glass rounded-[2.5rem] overflow-hidden hover:bg-white/[0.08] transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
        featured ? "md:flex md:h-[400px]" : "flex flex-col",
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "md:w-3/5" : "h-64",
        )}
      >
        <img
          src={
            event.coverImage ||
            `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80`
          }
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 premium-gradient rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white shadow-2xl">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={cn(
          "p-8 flex flex-col justify-between flex-1",
          featured ? "md:p-12" : "",
        )}
      >
        <div>
          <div className="flex items-center justify-between mb-4 text-xs text-indigo-400 font-bold tracking-widest uppercase">
            <span className="flex items-center space-x-2">
              <Calendar size={14} className="text-indigo-500" />
              <span>
                {new Date(event.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>

          <h3
            className={cn(
              "text-gray-900 dark:text-white font-display font-black mb-4 line-clamp-2 leading-[1.1] tracking-tighter",
              featured ? "text-4xl md:text-5xl" : "text-2xl",
            )}
          >
            {event.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-base line-clamp-2 mb-8 font-light leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium">
              <MapPin size={16} className="text-gray-600" />
              <span className="truncate max-w-[150px]">
                {event.location?.name || "Main Campus"}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
              <Users size={16} className="text-indigo-500" />
              <span className="text-gray-900 dark:text-white font-black text-sm">
                {event.rsvpCount || 0}
              </span>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            </div>
          </div>

          <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-900 dark:text-white transition-all duration-500 group-hover:bg-indigo-600 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:rotate-45">
            <ArrowUpRight
              size={24}
              className="group-hover:-rotate-45 transition-transform duration-500"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
