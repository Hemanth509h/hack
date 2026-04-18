import React from 'react';
import { useFetchClubsQuery, useFetchFeaturedClubsQuery } from '../../services/clubApi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ClubCard } from '../../components/clubs/ClubCard';
import { ClubFilters } from '../../components/clubs/ClubFilters';
import { Sparkles, Trophy, Plus, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';

export const ClubsPage: React.FC = () => {
  const filters = useSelector((state: RootState) => state.clubs.filters);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: featuredData } = useFetchFeaturedClubsQuery();
  const { data: clubsData, isLoading } = useFetchClubsQuery(filters);

  return (
    <PageContainer className="pb-24 pt-10">
      {/* Premium Hero Section */}
      <div className="relative mb-24 rounded-[3rem] overflow-hidden glass p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 border-black/5 dark:border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full -ml-40 -mb-40" />
        
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black text-indigo-400 border border-indigo-500/20 mb-8 uppercase tracking-[0.2em]"
          >
            <Sparkles className="h-4 w-4" />
            Vibrant Community
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-8 leading-[0.9] tracking-tighter">
            Discover Your <br />
            <span className="text-gradient">Tribe.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl mb-10 leading-relaxed font-light max-w-lg">
            Find the perfect group that shares your passion and elevates your campus experience through shared excellence.
          </p>
          <div className="flex flex-wrap items-center gap-5 justify-center md:justify-start">
            {user?.role === 'admin' && (
              <Link to="/clubs/create" className="btn-primary shadow-indigo-500/40 px-10">
                <Plus className="h-5 w-5 inline-block mr-2" /> Start a Club
              </Link>
            )}
            <Link to="/clubs/my-clubs" className="btn-glass px-10 border-black/10 dark:border-white/10">
              My Clubs
            </Link>
          </div>
        </div>
        
        <div className="relative z-10 hidden lg:block">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="glass rounded-[2.5rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-black/10 dark:border-white/10 max-w-[300px] text-center"
          >
             <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-amber-500" />
             </div>
             <div className="text-gray-900 dark:text-white font-display font-black text-2xl mb-2 tracking-tighter">Impact Award</div>
             <p className="text-gray-500 text-sm font-medium leading-relaxed">Honoring the club that drives the most campus engagement this semester.</p>
          </motion.div>
        </div>
      </div>

      {/* Featured Section */}
      {featuredData?.featured && featuredData.featured.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
             <div className="w-1.5 h-10 bg-indigo-500 rounded-full" />
             <h2 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tighter">
               Hall of Fame
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredData.featured.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ClubCard club={club} isFeatured />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Section */}
      <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-4">
            <Compass className="h-10 w-10 text-indigo-500" />
            Explore Directory
          </h2>
          <p className="text-gray-500 font-medium mt-3">Showing {clubsData?.pagination.total || 0} elite organizations</p>
        </div>
        <ClubFilters />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-96 glass rounded-[2.5rem] animate-pulse opacity-50" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {clubsData?.clubs.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.05 }}
              >
                <ClubCard club={club} />
              </motion.div>
            ))}
          </div>
          
          {clubsData?.clubs.length === 0 && (
            <div className="text-center py-32 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10">
              <Compass className="h-16 w-16 text-gray-700 mx-auto mb-8 opacity-50" />
              <h3 className="text-3xl font-display font-black text-gray-500 tracking-tighter">No Clubs Found</h3>
              <p className="text-gray-600 mt-4 text-lg">Try refining your search or filter parameters.</p>
              <button className="mt-10 btn-glass">Reset Filters</button>
            </div>
          )}

          {/* Pagination */}
          {clubsData && clubsData.pagination.pages > 1 && (
            <div className="mt-24 flex justify-center gap-3">
              {Array.from({ length: clubsData.pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  className={`w-14 h-14 rounded-2xl font-black text-lg transition-all duration-300 ${
                    clubsData.pagination.page === i + 1
                      ? 'bg-indigo-600 text-gray-900 dark:text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-110'
                      : 'glass text-gray-500 hover:text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default ClubsPage;
