import React from 'react';
import { IClub } from '../../../types/club';
import { Users, Calendar, Globe, Instagram, MessageCircle } from 'lucide-react';
import { useJoinClubMutation, useLeaveClubMutation } from '../../../services/clubApi';


interface ClubDetailHeaderProps {
  club: IClub;
  isMember: boolean;
  isPresident: boolean;
}

export const ClubDetailHeader: React.FC<ClubDetailHeaderProps> = ({ club, isMember, isPresident }) => {
  const [joinClub, { isLoading: isJoining }] = useJoinClubMutation();
  const [leaveClub, { isLoading: isLeaving }] = useLeaveClubMutation();

  const handleAction = () => {
    if (isMember) {
      if (window.confirm('Are you sure you want to leave this club?')) {
        leaveClub(club._id);
      }
    } else {
      joinClub(club._id);
    }
  };

  return (
    <div className="relative mb-12">
      {/* Cover Image */}
      <div className="h-64 md:h-80 w-full overflow-hidden relative">
        {club.coverImage ? (
          <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
      </div>

      {/* Profile/Logo Info */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-20 flex flex-col md:flex-row items-end md:items-center gap-6">
        <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl border-8 border-gray-950 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl">
          {club.logo ? (
            <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-5xl font-bold text-gray-900 dark:text-white">
              {club.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-3 mb-2 justify-center md:justify-start">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {club.category}
            </span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
              <Users className="h-4 w-4" />
              {club.memberCount} Members
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            {club.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 text-sm justify-center md:justify-start">
            {club.meetingSchedule && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                {club.meetingSchedule}
              </span>
            )}
            <div className="flex items-center gap-4">
              {club.socialLinks?.website && (
                <a href={club.socialLinks.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {club.socialLinks?.instagram && (
                <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {club.socialLinks?.discord && (
                <a href={club.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {(!isMember || !isPresident) && (
            <button
              onClick={handleAction}
              disabled={isJoining || isLeaving}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${
                isMember
                  ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-red-500/20 hover:text-red-400 border border-gray-700 hover:border-red-500/30'
                  : 'bg-indigo-600 text-gray-900 dark:text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)]'
              }`}
            >
              {isMember ? 'Joined' : 'Join Club'}
            </button>
          )}
          {isPresident && (
            <button className="flex-1 md:flex-none bg-white text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all">
              Manage Club
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
