import React from 'react';
import { useFetchClubsQuery, useFetchFeaturedClubsQuery } from '../../services/clubApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ClubCard } from '../../components/clubs/ClubCard';
import { ClubFilters } from '../../components/clubs/ClubFilters';
import { Sparkles, Trophy, Plus, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';

export const ClubsPage: React.FC = () => {
  const filters = useSelector((state: RootState) => state.clubs.filters);
  const { data: featuredData } = useFetchFeaturedClubsQuery();
  const { data: clubsData, isLoading } = useFetchClubsQuery(filters);

  return (
    <PageContainer className="pb-20">
      {/* Hero Section */}
      <div className="relative mb-16 rounded-3xl overflow-hidden bg-indigo-600 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent opacity-80" />
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-indigo-100 border border-white/20 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Join the community
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Discover Your <span className="text-indigo-300">Tribe</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
            From coding clubs to sports teams, find the perfect group that shares your passion and elevates your college experience.
          </p>
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <Link to="/clubs/create" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl">
              <Plus className="h-5 w-5" /> Start a Club
            </Link>
            <Link to="/clubs/my-clubs" className="bg-indigo-500/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500/30 transition-all">
              My Clubs
            </Link>
          </div>
        </div>
        <div className="relative z-10 hidden lg:block">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl skew-y-3">
             <Trophy className="h-16 w-16 text-amber-400 mb-4" />
             <div className="text-white font-bold text-xl mb-1">Impact Award</div>
             <p className="text-indigo-200 text-sm max-w-[200px]">Top contributor to campus diversity and engagement.</p>
          </div>
        </div>
      </div>

      {/* Featured Carousel Placeholder */}
      {featuredData?.featured && featuredData.featured.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-amber-500" />
            Top Performing Clubs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredData.featured.map((club) => (
              <ClubCard key={club._id} club={club} isFeatured />
            ))}
          </div>
        </div>
      )}

      {/* Discovery Section */}
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Compass className="h-6 w-6 text-indigo-400" />
            Explore Directory
          </h2>
          <p className="text-gray-500 text-sm mt-1">Found {clubsData?.pagination.total || 0} active clubs on campus</p>
        </div>
      </div>

      <ClubFilters />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-80 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {clubsData?.clubs.map((club) => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
          
          {clubsData?.clubs.length === 0 && (
            <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
              <Compass className="h-12 w-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No clubs found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          )}

          {/* Pagination */}
          {clubsData && clubsData.pagination.pages > 1 && (
            <div className="mt-16 flex justify-center gap-2">
              {Array.from({ length: clubsData.pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    clubsData.pagination.page === i + 1
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-900 text-gray-500 hover:text-white border border-gray-800'
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
