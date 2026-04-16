import React from 'react';
import { IProfile } from '../../types/profile';
import { Download, Edit3, GraduationCap, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  profile: IProfile;
  isOwner: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwner }) => {
  return (
    <div className="relative pt-32 pb-8 bg-gray-900 border-b border-gray-800 rounded-t-xl overflow-hidden shadow-sm">
      {/* Cover / Abstract background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-900 via-primary-800 to-purple-900 opacity-40 mix-blend-overlay" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-start md:items-end gap-6">
        <div className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden flex-shrink-0 -mt-16 shadow-2xl relative">
          <img 
            src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 pb-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400 text-sm">
            {profile.major && (
              <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.major}</span>
            )}
            {profile.graduationYear && (
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Class of {profile.graduationYear}</span>
            )}
            <span className="flex items-center gap-1 text-primary-400 font-medium capitalize px-2 py-0.5 bg-primary-500/10 rounded">
              {profile.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pb-2 mt-4 md:mt-0">
           {isOwner ? (
             <>
               <Link to="/profile/edit" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 shadow-sm">
                 <Edit3 className="w-4 h-4" /> Edit Profile
               </Link>
               <Link to="/portfolio/edit" className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors shadow-lg shadow-primary-500/20">
                 Portfolio Builder
               </Link>
             </>
           ) : (
             <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors shadow-lg shadow-primary-500/20">
               <Download className="w-4 h-4" /> Download CV
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
