import React from 'react';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EventCardProps {
  event: any;
  featured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, featured }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-[2rem] overflow-hidden hover:bg-gray-900/80 transition-all duration-500",
        featured ? "md:flex md:h-80" : "flex flex-col"
      )}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "md:w-1/2" : "h-52"
      )}>
        <img
          src={event.coverImage || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80`}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        "p-6 flex flex-col justify-between flex-1",
        featured ? "md:p-8" : ""
      )}>
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-blue-400 font-medium tracking-wide">
            <span className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
          </div>
          
          <h3 className={cn(
            "text-white font-bold mb-3 line-clamp-2 leading-tight",
            featured ? "text-2xl md:text-3xl" : "text-xl"
          )}>
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-6">
            {event.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-gray-500 text-xs">
              <MapPin size={14} />
              <span className="truncate max-w-[120px]">{event.location?.name || 'On Campus'}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Users size={14} className="text-blue-500" />
              <span className="text-white font-bold text-xs">{event.rsvpCount || 0}</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            </div>
          </div>

          <button className="p-2 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all duration-300 group-hover:translate-x-1">
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
