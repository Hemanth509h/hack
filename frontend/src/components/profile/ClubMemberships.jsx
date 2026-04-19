import React from 'react';
import { Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClubMemberships = ({ clubs }) => {
  if (!clubs || clubs.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/50">
        <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500">Not a member of any clubs yet.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clubs.map((clubMembership) => (
        <div key={clubMembership.club._id} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center hover:border-gray-700 transition-colors shadow-sm group">
          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4 overflow-hidden border border-gray-700 shadow-inner group-hover:border-primary-500/50 transition-colors">
            {clubMembership.club.image ? (
               <img src={clubMembership.club.image} alt={clubMembership.club.name} className="w-full h-full object-cover" />
            ) : (
               <Users className="w-6 h-6 text-primary-500" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-gray-900 dark:text-white font-semibold truncate group-hover:text-primary-400 transition-colors">{clubMembership.club.name}</h4>
            <span className="text-xs font-medium px-2 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-700 text-gray-700 dark:text-gray-300 rounded mt-1.5 inline-block capitalize group-hover:border-gray-600 transition-colors">
              {clubMembership.role.replace('_', ' ')}
            </span>
          </div>
          <Link to={`/clubs/${clubMembership.club._id}`} className="p-2 text-gray-500 hover:text-gray-900 dark:text-white transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
};
