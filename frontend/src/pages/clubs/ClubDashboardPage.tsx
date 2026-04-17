import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchClubByIdQuery, useFetchClubMembersQuery, useFetchClubAnalyticsQuery } from '../../services/clubApi';
import { StatCards } from '../../components/clubs/dashboard/StatCards';
import { MemberManagementTable } from '../../components/clubs/dashboard/MemberManagementTable';
import { Loader2, LayoutDashboard, Calendar, Bell, Users, Settings, Plus, ArrowLeft, BarChart3 } from 'lucide-react';
// framer-motion intentionally not used in this layout

export const ClubDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: detailData, isLoading: isDetailLoading } = useFetchClubByIdQuery(id!);
  const { data: membersData, isLoading: isMembersLoading } = useFetchClubMembersQuery(id!);
  const { data: _analyticsData } = useFetchClubAnalyticsQuery(id!);

  if (isDetailLoading || isMembersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!detailData) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-full md:px-12 lg:px-20 mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/clubs/${id}`)}
            className="p-3 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-indigo-400" />
              Club Dashboard
            </h1>
            <p className="text-gray-500 font-medium">Managing <span className="text-indigo-400">{detailData.club.name}</span></p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-gray-900 border border-gray-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all">
            <Bell className="h-4 w-4" /> Send Announcement
          </button>
          <button 
            onClick={() => navigate(`/events/create?clubId=${id}`)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Management Section */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Users className="h-6 w-6 text-indigo-400" />
                Member Management
              </h2>
              <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {membersData?.members.length || 0} Total
              </div>
            </div>
            <MemberManagementTable members={membersData?.members || []} clubId={id!} />
          </section>

          {/* Analytics Placeholder */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-indigo-400" />
              Engagement Trends
            </h2>
            <div className="h-64 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 flex">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-indigo-500 border-x border-gray-950" style={{ height: `${Math.random() * 100}%`, alignSelf: 'flex-end' }} />
                  ))}
               </div>
               <p className="text-gray-500 font-medium z-10">Advanced analytics visualization would render here</p>
            </div>
          </section>
        </div>

        {/* Sidebar Actions/Info */}
        <div className="space-y-8">
          <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Leader Actions</h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">Update Schedule</span>
                </div>
                <p className="text-[10px] text-gray-500">Change meeting times or primary locations</p>
              </button>
              <button className="w-full text-left p-4 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-1">
                  <Settings className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">Club Settings</span>
                </div>
                <p className="text-[10px] text-gray-500">Edit branding, social links, and bio</p>
              </button>
            </div>
          </section>

          {/* Recent Joins placeholder */}
          <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-800" />
                  <div className="flex-1">
                    <p className="text-xs text-white font-medium"><span className="text-indigo-400">Student {i}</span> requested to join</p>
                    <p className="text-[10px] text-gray-500">{i}h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboardPage;
