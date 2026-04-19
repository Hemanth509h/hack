import React from 'react';
import { Download, Edit3, GraduationCap, Briefcase, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';



export const ProfileHeader = ({ profile, isOwner }) => {
  return (
    <div className="relative pt-40 pb-12 glass rounded-t-[3rem] overflow-hidden border-black/5 dark:border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      {/* Immersive Cover */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-blue-900/30 opacity-50 mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-full h-48 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      
      <div className="max-w-6xl mx-auto px-10 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
        <div className="w-40 h-40 rounded-[2.5rem] border-4 border-black/5 dark:border-white/5 glass bg-black/5 dark:bg-white/5 overflow-hidden flex-shrink-0 -mt-20 shadow-2xl relative group">
          <img 
            src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`} 
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex-1 pb-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
             <span className="px-3 py-1 glass bg-black/5 dark:bg-white/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">
               {profile.role.replace('_', ' ')}
             </span>
             <div className="flex items-center gap-2 px-3 py-1 glass bg-black/5 dark:bg-white/5 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-orange-500/20">
                <Trophy className="w-3 h-3" />
                {profile.points || 0} QC Points
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-none">{profile.name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6 text-gray-500 text-xs font-black uppercase tracking-widest">
            {profile.major && (
              <span className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5"><GraduationCap className="w-4 h-4 text-indigo-500" /> {profile.major}</span>
            )}
            {profile.graduationYear && (
              <span className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5"><Briefcase className="w-4 h-4 text-purple-500" /> Class of {profile.graduationYear}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pb-2 mt-8 md:mt-0">
           {isOwner ? (
             <>
               <Link to="/profile/edit" className="btn-glass px-6 py-4 border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest text-[10px]">
                 <Edit3 className="w-4 h-4 mr-2 inline-block" /> Edit Identity
               </Link>
               <Link to="/portfolio/edit" className="btn-primary px-8 py-4 shadow-indigo-500/30 text-[10px] font-black uppercase tracking-widest">
                 Portfolio Builder
               </Link>
             </>
           ) : (
             <button className="btn-primary px-8 py-4 shadow-indigo-500/30 text-[10px] font-black uppercase tracking-widest">
               <Download className="w-4 h-4 mr-2 inline-block" /> Archive Dossier
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
