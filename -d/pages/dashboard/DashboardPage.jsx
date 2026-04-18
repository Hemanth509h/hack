import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  Calendar,
  Users,
  Briefcase,
  Sparkles,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetTrendingEventsQuery,
  useGetEventRecommendationsQuery,
  useGetTrendingClubsQuery,
  useGetUpcomingRsvpsCountQuery,
  useGetIncomingTeamRequestsCountQuery,
} from "../../services/dashboardApi";
import { DashboardSummaryCard } from "../../components/dashboard/DashboardSummaryCard";
import { NotificationPanel } from "../../components/dashboard/NotificationPanel";
import { EventCard } from "../../components/events/EventCard";
import { ClubCard } from "../../components/clubs/ClubCard";
import { clearFilters } from "../../features/events/eventSlice";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data: trendingData, isLoading: trendingLoading } =
    useGetTrendingEventsQuery();
  const { data: recommendedEventsData, isLoading: recEventsLoading } =
    useGetEventRecommendationsQuery();
  const { data: trendingClubsData } = useGetTrendingClubsQuery();
  const { data: rsvpCount } = useGetUpcomingRsvpsCountQuery(user?.id ?? "", {
    skip: !user?.id,
  });
  const { data: reqCount } = useGetIncomingTeamRequestsCountQuery();

  useEffect(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const trendingEvents = trendingData?.trending || [];
  const recommendedEvents = recommendedEventsData?.recommendations || [];
  const trendingClubs = trendingClubsData?.trending || [];

  return (
    <PageContainer className="overflow-hidden">
      <NotificationPanel />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-10">
          {/* Welcome Dashboard */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                  Welcome back, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Here's what's happening around The Quad today.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardSummaryCard
                title="Upcoming RSVPs"
                count={rsvpCount?.count || 0}
                icon={<Calendar className="w-6 h-6 text-indigo-400" />}
                href="/events/my-rsvps"
                color="indigo"
                delay={0.1}
              />

              <DashboardSummaryCard
                title="Team Requests"
                count={reqCount?.count || 0}
                icon={<Users className="w-6 h-6 text-orange-400" />}
                href="/teams/my-projects"
                color="orange"
                delay={0.2}
              />

              <DashboardSummaryCard
                title="Club Updates"
                count={2}
                icon={<Briefcase className="w-6 h-6 text-emerald-400" />}
                href="/clubs/my-clubs"
                color="emerald"
                delay={0.3}
              />
            </div>
          </section>

          {/* Quick Shortcuts */}
          <section className="flex flex-wrap gap-3">
            <Link
              to="/map"
              className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-blue-500/20"
            >
              <Map className="w-4 h-4" /> Interactive Campus Map
            </Link>
            <Link
              to="/teams"
              className="flex items-center gap-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-violet-500/20"
            >
              <Users className="w-4 h-4" /> Find Team Members
            </Link>
          </section>

          {/* Happening Now Carousel */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Happening Now
              </h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {trendingLoading ? (
              <div className="h-64 rounded-2xl bg-white dark:bg-gray-900 animate-pulse border border-gray-200 dark:border-gray-800"></div>
            ) : trendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {trendingEvents.slice(0, 2).map((event, idx) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <EventCard event={event} isRecommended={idx === 0} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-12 text-center border overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <p className="text-gray-600 dark:text-gray-400">
                  No events currently trending.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Space */}
        <div className="xl:col-span-4 space-y-10">
          {/* Suggested For You */}
          <section className="bg-white dark:bg-gray-900/40 rounded-3xl p-6 border border-black/5 dark:border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-6">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Suggested for You
            </h2>

            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Events Based on Interests
                </h3>
                {recEventsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-32 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : recommendedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedEvents.slice(0, 3).map((event) => (
                      <div key={event._id} className="scale-[0.98] origin-left">
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Add more interests to see suggestions.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Clubs To Explore
                </h3>
                {trendingClubs.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {trendingClubs.slice(0, 2).map((club) => (
                      <div
                        key={club._id}
                        className="scale-[0.98] origin-left border border-black/10 dark:border-white/10 rounded-xl overflow-hidden"
                      >
                        <ClubCard club={club} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
