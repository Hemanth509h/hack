import React, { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Filter, RefreshCw, User } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";
import EventCard from "../components/discovery/EventCard";
import NearbyEvents from "../components/events/NearbyEvents";
import PageContainer from "../components/layout/PageContainer";

const DiscoverPage = () => {
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: trendingData }, { data: recommendedData }] =
        await Promise.all([
          api.get("/discovery/trending/events"),
          api.get("/discovery/recommendations/events"),
        ]);
      setTrending(trendingData.trending);
      setRecommended(recommendedData.recommendations);
    } catch (err) {
      console.error("Failed to fetch discovery data", err);
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
        <p className="font-medium animate-pulse">
          Scanning the campus for updates...
        </p>
      </div>
    );
  }

  return (
    <PageContainer className="space-y-24 py-10">
      {/* Featured / Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl shadow-inner border border-indigo-500/10">
              <TrendingUp className="text-indigo-400" size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                Trending Now
              </h2>
              <p className="text-gray-500 font-medium">
                What's igniting the campus conversation
              </p>
            </div>
          </div>
          <button className="btn-glass text-indigo-400 hover:text-indigo-300 text-sm font-bold uppercase tracking-widest px-8">
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {trending.slice(0, 1).map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <EventCard event={event} featured />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {trending.slice(1, 4).map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nearby Events Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10 rounded-full" />
        <NearbyEvents />
      </section>

      {/* Recommended Section */}
      <section>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl shadow-inner border border-purple-500/10">
              <Sparkles className="text-purple-400" size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                Personalized For You
              </h2>
              <p className="text-gray-500 font-medium">
                Curated based on your campus fingerprint
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-gray-600 dark:text-gray-400 transition-all border border-black/5 dark:border-white/5 shadow-lg group">
              <Filter
                size={20}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
            </button>
            <button
              onClick={fetchData}
              className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-gray-600 dark:text-gray-400 transition-all border border-black/5 dark:border-white/5 shadow-lg group"
            >
              <RefreshCw
                size={20}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommended.length > 0 ? (
            recommended.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center glass rounded-[3rem] border border-dashed border-black/10 dark:border-white/10 group hover:border-indigo-500/30 transition-colors">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="text-indigo-400" size={32} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                Complete your profile to unlock{" "}
                <span className="text-indigo-400">Personalized Insights.</span>
              </p>
              <button className="mt-8 btn-glass">Complete Profile</button>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
};

export default DiscoverPage;
