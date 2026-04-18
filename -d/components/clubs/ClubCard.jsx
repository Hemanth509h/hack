import React from "react";
import { Users, ChevronRight } from "lucide-react";
import { useJoinClubMutation } from "../../services/clubApi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ClubCard = ({ club, isFeatured }) => {
  const [joinClub, { isLoading: isJoining }] = useJoinClubMutation();

  const handleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    joinClub(club._id);
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-[2.5rem] glass transition-all duration-500 border-black/5 dark:border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
        isFeatured
          ? "ring-2 ring-indigo-500/30"
          : "hover:bg-black/10 dark:hover:bg-white/10 hover:border-indigo-500/30"
      }`}
    >
      <Link to={`/clubs/${club._id}`}>
        {/* Cover Image */}
        <div className="relative h-40 w-full overflow-hidden">
          {club.coverImage ? (
            <img
              src={club.coverImage}
              alt={club.name}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <span className="text-5xl font-black text-gray-900 dark:text-white/5 font-display">
                {club.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />

          {/* Category Badge */}
          <div className="absolute left-4 top-4 rounded-full bg-gray-50 dark:bg-[#030303]/40 backdrop-blur-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-black/10 dark:border-white/10">
            {club.category}
          </div>

          {isFeatured && (
            <div className="absolute right-4 top-4 rounded-full bg-amber-500 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              Hall of Fame
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 pt-0 relative">
          <div className="relative -mt-10 mb-5 flex items-end px-1">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-[#030303] bg-white dark:bg-gray-900 shadow-2xl">
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={club.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center premium-gradient text-3xl font-black text-gray-900 dark:text-white">
                  {club.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <h3 className="mb-2 truncate text-2xl font-display font-black text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors tracking-tighter leading-tight">
            {club.name}
          </h3>

          <p className="mb-8 line-clamp-2 text-sm text-gray-500 font-medium leading-relaxed">
            {club.description}
          </p>

          <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6 mt-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Users className="h-4 w-4 text-indigo-500" />
              <span>{club.memberCount} Elite Members</span>
            </div>

            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="flex items-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-indigo-600 px-5 py-2 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white transition-all duration-300 border border-black/5 dark:border-white/5 group-hover:border-indigo-500/30"
            >
              Join
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ClubCard;
