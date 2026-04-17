import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import EventCard from '../components/discovery/EventCard';
import NearbyEvents from '../components/events/NearbyEvents';
import PageContainer from '../components/layout/PageContainer';

const DiscoverPage: React.FC = () => {
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: trendingData }, { data: recommendedData }] = await Promise.all([
        api.get('/discovery/trending/events'),
        api.get('/discovery/recommendations/events')
      ]);
      setTrending(trendingData.trending);
      setRecommended(recommendedData.recommendations);
    } catch (err) {
      console.error('Failed to fetch discovery data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 space-y-4">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <p className="font-medium animate-pulse">Scanning the campus for updates...</p>
      </div>
    );
  }

  return (
    <PageContainer className="space-y-16">
      {/* Featured / Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <TrendingUp className="text-orange-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <p className="text-sm text-gray-500">What everyone is talking about on campus</p>
            </div>
          </div>
          <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {trending.slice(0, 1).map((event: any) => (
            <EventCard key={event._id} event={event} featured />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {trending.slice(1, 4).map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>

      {/* Nearby Events Section */}
      <NearbyEvents />

      {/* Recommended Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">For You</h2>
              <p className="text-sm text-gray-500">Based on your interests and activity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all border border-white/5">
                <Filter size={18} />
             </button>
             <button onClick={fetchData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all border border-white/5">
                <RefreshCw size={18} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.length > 0 ? (
            recommended.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
             <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                <p className="text-gray-500">Complete your profile to get personalized suggestions!</p>
             </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
};

export default DiscoverPage;
