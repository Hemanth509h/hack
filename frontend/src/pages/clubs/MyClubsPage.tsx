import React, { useState } from 'react';
import { useFetchMyClubsQuery, useLeaveClubMutation } from '../../services/clubApi';
import { ClubCard } from '../../components/clubs/ClubCard';
import { Loader2, Shield, Users, Compass, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const MyClubsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leading' | 'member'>('leading');
  const { data, isLoading } = useFetchMyClubsQuery();
  const [leaveClub] = useLeaveClubMutation();


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const handleLeave = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to leave ${name}?`)) {
      leaveClub(id);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-full md:px-12 lg:px-20 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">My Clubs</h1>
          <p className="text-gray-500 font-medium">Manage your leadership roles and memberships.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-950 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('leading')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'leading' ? 'bg-indigo-600 text-gray-900 dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
            }`}
          >
            <Shield className="h-4 w-4" />
            Leading
          </button>
          <button
            onClick={() => setActiveTab('member')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'member' ? 'bg-indigo-600 text-gray-900 dark:text-white shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
            }`}
          >
            <Users className="h-4 w-4" />
            Member Of
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'leading' ? (
          <motion.div
            key="leading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data?.leading && data.leading.length > 0 ? (
              data.leading.map((club) => (
                <div key={club._id} className="relative group">
                  <ClubCard club={club} />
                  <Link 
                    to={`/clubs/${club._id}/dashboard`}
                    className="absolute bottom-4 right-20 bg-black/10 dark:bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 dark:text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-all z-20"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <Shield className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">Not leading any clubs</h3>
                <p className="text-gray-500 mt-2 mb-8">Ready to take charge? Start your own movement today.</p>
                <Link to="/clubs/create" className="inline-flex items-center gap-2 bg-indigo-600 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl">
                  Create a Club <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="member"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data?.memberOf && data.memberOf.length > 0 ? (
              data.memberOf.map((club) => (
                <div key={club._id} className="relative group">
                  <ClubCard club={club} />
                  <button 
                    onClick={() => handleLeave(club._id, club.name)}
                    className="absolute bottom-4 right-20 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all z-20"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Leave
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <Users className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">No active memberships</h3>
                <p className="text-gray-500 mt-2 mb-8">Discover communities that align with your interests.</p>
                <Link to="/clubs" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all shadow-xl">
                  Browse Directory <Compass className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClubsPage;
