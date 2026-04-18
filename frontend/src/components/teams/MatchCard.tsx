import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Zap } from 'lucide-react';
import type { TeamMatch } from '../../services/teamApi';

interface MatchCardProps {
  match: TeamMatch;
  rank: number;
  onViewDetails: (match: TeamMatch) => void;
}

const matchColors = {
  high: { badge: 'from-emerald-500 to-teal-400', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/20' },
  mid: { badge: 'from-violet-500 to-indigo-400', glow: 'shadow-violet-500/20', border: 'border-violet-500/20' },
  low: { badge: 'from-amber-500 to-orange-400', glow: 'shadow-amber-500/20', border: 'border-amber-500/20' },
};

function getMatchTier(score: number) {
  if (score >= 0.85) return 'high';
  if (score >= 0.65) return 'mid';
  return 'low';
}

const avatarColors = [
  'from-violet-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-cyan-600',
];

export const MatchCard: React.FC<MatchCardProps> = ({ match, rank, onViewDetails }) => {
  const [hovered, setHovered] = useState(false);
  const tier = getMatchTier(match.matchScore);
  const colors = matchColors[tier];
  const pct = Math.round(match.matchScore * 100);
  const avatarGradient = avatarColors[rank % avatarColors.length];
  const initials = match.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative group bg-white dark:bg-gray-900/70 backdrop-blur-xl border ${colors.border} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:${colors.glow} hover:-translate-y-1`}
      onClick={() => onViewDetails(match)}
    >
      {/* Match % Badge */}
      <div className={`absolute -top-3 -right-3 bg-gradient-to-br ${colors.badge} text-gray-900 dark:text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg z-10`}>
        {pct}% Match
      </div>

      {/* Top Row */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg shrink-0 shadow-lg`}>
          {match.user.avatar
            ? <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover rounded-2xl" />
            : initials
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 dark:text-white font-bold text-base truncate">{match.user.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
            {match.user.major || 'Computer Science'}
            {match.user.graduationYear && ` · Class of ${match.user.graduationYear}`}
          </p>
          {match.breakdown.isAvailable && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              <Zap className="w-2.5 h-2.5" /> Open to Team
            </span>
          )}
        </div>
      </div>

      {/* Bio snippet */}
      {match.user.bio && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {match.user.bio}
        </p>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {match.user.skills.slice(0, 5).map((skill) => (
          <span
            key={skill._id}
            className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg"
          >
            {skill.name}
          </span>
        ))}
        {match.user.skills.length > 5 && (
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
            +{match.user.skills.length - 5}
          </span>
        )}
      </div>

      {/* Breakdown mini-bars */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-24 shrink-0">Skill Overlap</span>
          <div className="flex-1 h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${match.breakdown.skillOverlap}%` }}
              transition={{ delay: rank * 0.07 + 0.3, duration: 0.6 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            />
          </div>
          <span className="text-[10px] text-gray-600 dark:text-gray-400 w-8 text-right">{match.breakdown.skillOverlap}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-24 shrink-0">Interests</span>
          <div className="flex-1 h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${match.breakdown.interestAlignment}%` }}
              transition={{ delay: rank * 0.07 + 0.4, duration: 0.6 }}
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
            />
          </div>
          <span className="text-[10px] text-gray-600 dark:text-gray-400 w-8 text-right">{match.breakdown.interestAlignment}%</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={(e) => { e.stopPropagation(); onViewDetails(match); }}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          hovered
            ? `bg-gradient-to-r ${colors.badge} text-gray-900 dark:text-white shadow-lg`
            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-700'
        }`}
      >
        <Users className="w-4 h-4" />
        View Profile
        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
      </button>
    </motion.div>
  );
};
