import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFetchClubByIdQuery, useFetchClubMembersQuery, useFetchClubAnalyticsQuery } from '../../services/clubApi';
import { StatCards } from '../../components/clubs/dashboard/StatCards';
import { MemberManagementTable } from '../../components/clubs/dashboard/MemberManagementTable';
import { Loader2, LayoutDashboard, Calendar, Bell, Users, Settings, Plus, ArrowLeft, BarChart3, TrendingUp, Shield, Sparkles } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';

export const ClubDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: detailData, isLoading: isDetailLoading } = useFetchClubByIdQuery(id!);
  const { data: membersData, isLoading: isMembersLoading } = useFetchClubMembersQuery(id!);
  const { data: _analyticsData } = useFetchClubAnalyticsQuery(id!);

  if (isDetailLoading || isMembersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030303]">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
           <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Control Nexus...</p>
        </div>
      </div>
    );
  }

  if (!detailData) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageContainer className="pb-32">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <motion.button 
              variants={itemVariants}
              onClick={() => navigate(`/clubs/${id}`)}
              className="p-5 rounded-[2rem] glass bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all shadow-xl"
            >
              <ArrowLeft className="h-6 w-6" />
            </motion.button>
            <div className="text-center md:text-left">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Shield className="w-3 h-3" /> Collective Governance
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
                Club <br /><span className="text-gradient">Command.</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-gray-500 font-medium text-xl">Managing <span className="text-indigo-400 font-bold">{detailData.club.name}</span></motion.p>
            </div>
          </div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
            <button className="btn-glass px-8 py-5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
              <Bell className="h-4 w-4" /> Send Signal
            </button>
            <button 
              onClick={() => navigate(`/events/create?clubId=${id}`)}
              className="btn-primary px-10 py-5 shadow-indigo-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
            >
              <Plus className="h-4 w-4" /> Initialize Event
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="mb-12">
          <StatCards />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4">
          {/* Main Management Section */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
                  <div className="p-3 glass bg-black/5 dark:bg-white/5 rounded-2xl text-indigo-400">
                    <Users className="h-6 w-6" />
                  </div>
                  Personnel Management
                </h2>
                <div className="px-5 py-2 glass bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                  {membersData?.members.length || 0} Registered
                </div>
              </div>
              <div className="glass rounded-[3rem] border-black/5 dark:border-white/5 shadow-2xl overflow-hidden">
                <MemberManagementTable members={membersData?.members || []} clubId={id!} />
              </div>
            </motion.section>

            {/* Analytics Section */}
            <motion.section variants={itemVariants}>
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
                  <div className="p-3 glass bg-black/5 dark:bg-white/5 rounded-2xl text-purple-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  Engagement Nexus
                </h2>
                <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" /> +12.5% Growth
                </div>
              </div>
              <div className="h-96 glass bg-white/2 border border-black/5 dark:border-white/5 rounded-[3rem] flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-20 flex items-end px-12 pb-12 gap-4">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${20 + Math.random() * 80}%` }}
                        transition={{ delay: 0.5 + (i * 0.05), duration: 1.5, ease: "easeOut" }}
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-xl opacity-40 group-hover:opacity-100 transition-opacity" 
                      />
                    ))}
                 </div>
                 <div className="relative z-10 text-center">
                    <div className="w-20 h-20 glass bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                       <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-black uppercase tracking-[0.3em] text-xs">Analytics Stream Active</p>
                    <p className="text-gray-500 text-sm mt-2">Historical engagement data processing...</p>
                 </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Actions/Info */}
          <div className="space-y-12">
            <motion.section variants={itemVariants} className="glass bg-white/2 border border-black/5 dark:border-white/5 rounded-[3rem] p-10 shadow-2xl">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-10">Administrative Matrix</h3>
              <div className="space-y-6">
                <button className="w-full text-left p-6 rounded-[2rem] glass bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -mr-12 -mt-12" />
                  <div className="flex items-center gap-5 mb-3">
                    <div className="p-3 glass bg-black/5 dark:bg-white/5 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="text-base font-black text-gray-900 dark:text-white tracking-tight">Sync Schedule</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Update collective meeting cycles and logistics.</p>
                </button>
                
                <button className="w-full text-left p-6 rounded-[2rem] glass bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-purple-500/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl -mr-12 -mt-12" />
                  <div className="flex items-center gap-5 mb-3">
                    <div className="p-3 glass bg-black/5 dark:bg-white/5 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                      <Settings className="h-5 w-5" />
                    </div>
                    <span className="text-base font-black text-gray-900 dark:text-white tracking-tight">Nexus Core</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Modify collective branding, metadata, and protocols.</p>
                </button>
              </div>
            </motion.section>

            {/* Recent Signals Section */}
            <motion.section variants={itemVariants} className="glass bg-white/2 border border-black/5 dark:border-white/5 rounded-[3rem] p-10 shadow-2xl">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-10">Recent Signals</h3>
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-5 group">
                    <div className="h-12 w-12 rounded-2xl glass bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-gray-500 font-black text-sm group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-bold tracking-tight">Student <span className="text-indigo-400">#00{i}</span></p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Personnel Request • {i}h ago</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 glass bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-900 dark:text-white transition-colors">
                View Full Audit Log
              </button>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default ClubDashboardPage;
