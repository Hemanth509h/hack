import React from 'react';
import { Shield, User } from 'lucide-react';



export const LeadershipSection = ({ leadership }) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <Shield className="h-6 w-6 text-indigo-400" />
        Club Leadership
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leadership.map((member) => (
          <div key={member._id} className="bg-gray-50 dark:bg-gray-800/40 border border-gray-700/50 p-6 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-colors">
              {member.user.avatar ? (
                <img src={member.user.avatar} alt={member.user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <User className="h-8 w-8" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  member.role === 'president' 
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {member.role}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">{member.user.name}</h3>
              <p className="text-xs text-gray-500">{member.user.major || 'Student'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
