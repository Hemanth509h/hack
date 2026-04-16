import React from 'react';
import { IClub } from '../../types/club';
import { Users, ExternalLink, ChevronRight } from 'lucide-react';
import { useJoinClubMutation } from '../../services/clubApi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ClubCardProps {
  club: IClub;
  isFeatured?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, isFeatured }) => {
  const [joinClub, { isLoading: isJoining }] = useJoinClubMutation();

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    joinClub(club._id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isFeatured 
          ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30' 
          : 'bg-gray-900/50 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-800/50 shadow-xl'
      }`}
    >
      <Link to={`/clubs/${club._id}`}>
        {/* Cover Image */}
        <div className="relative h-32 w-full overflow-hidden bg-gray-800">
          {club.coverImage ? (
            <img 
              src={club.coverImage} 
              alt={club.name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
              <span className="text-4xl font-bold text-white/10">{club.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute left-3 top-3 rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md border border-indigo-500/30">
            {club.category}
          </div>

          {isFeatured && (
            <div className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
              Club of the Month
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pt-0">
          <div className="relative -mt-8 mb-3 flex items-end px-1">
            <div className="h-16 w-16 overflow-hidden rounded-xl border-4 border-gray-900 bg-gray-900 shadow-xl">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-indigo-900 text-2xl font-bold text-indigo-200">
                  {club.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <h3 className="mb-1 truncate text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
            {club.name}
          </h3>
          
          <p className="mb-4 line-clamp-2 text-sm text-gray-400">
            {club.description}
          </p>

          <div className="flex items-center justify-between border-t border-gray-800/50 pt-4 mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              <span>{club.memberCount} Members</span>
            </div>
            
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              Join
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ClubCard;
