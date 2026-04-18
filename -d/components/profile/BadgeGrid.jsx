import React from "react";
import { Shield, Sparkles } from "lucide-react";

export const BadgeGrid = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/50">
        <Shield className="w-12 h-12 text-gray-700 mb-3" />
        <p className="text-gray-600 dark:text-gray-400 font-medium text-center">
          No badges earned yet.
        </p>
        <p className="text-gray-500 text-sm mt-1 text-center">
          Participate in events and hackathons to unlock achievements.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge._id}
          className="group flex flex-col items-center justify-center p-5 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-yellow-500/50 hover:from-gray-800/80 hover:to-yellow-900/20 transition-all text-center relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
          <img
            src={badge.imageUrl}
            alt={badge.name}
            className="w-16 h-16 object-contain mb-3 drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
          />

          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 tracking-tight">
            {badge.name}
          </h4>
          {badge.earnedAt && (
            <span className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-gray-950/50 px-2 py-0.5 rounded-full mt-1">
              {new Date(badge.earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
