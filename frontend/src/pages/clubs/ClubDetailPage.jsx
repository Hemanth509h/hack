import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFetchClubByIdQuery, useFetchClubMembersQuery } from '../../services/clubApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ClubDetailHeader } from '../../components/clubs/detail/ClubDetailHeader';
import { LeadershipSection } from '../../components/clubs/detail/LeadershipSection';
import { MemberList } from '../../components/clubs/detail/MemberList';
import { ClubAnnouncements } from '../../components/clubs/detail/ClubAnnouncements';
import { Loader2, ChevronLeft, MapPin, Calendar, Trophy } from 'lucide-react';

export const ClubDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state) => state.auth);
  const { data: detailData, isLoading: isDetailLoading } = useFetchClubByIdQuery(id!);
  const { data: membersData, isLoading: isMembersLoading } = useFetchClubMembersQuery(id!);

  if (isDetailLoading || isMembersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Club Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The club you are looking for might have been moved or deleted.</p>
        <Link to="/clubs" className="text-indigo-400 font-bold hover:underline flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  const { club, leadership } = detailData;
  const isMember = membersData?.members.some(m => m.user._id === user?.id && m.status === 'approved') || false;
  const isPresident = leadership.some(m => m.user._id === user?.id && m.role === 'president');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030303] pb-32">
      <ClubDetailHeader 
        club={club} 
        isMember={isMember} 
        isPresident={isPresident} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-16">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8 px-2">
               <div className="w-2 h-10 bg-indigo-500 rounded-full" />
               <h2 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tighter">
                 Club Manifesto
               </h2>
            </div>
            <div className="glass rounded-[3rem] p-10 md:p-16 border-black/5 dark:border-white/5 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-xl whitespace-pre-line relative z-10">
                {club.description}
              </p>
              {club.tags && club.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-12 relative z-10">
                  {club.tags.map(tag => (
                    <span key={tag} className="glass bg-black/5 dark:bg-white/5 text-gray-500 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-black/5 dark:border-white/5 hover:text-indigo-400 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Announcements Terminal */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass bg-white/2 rounded-[3rem] p-1 border-black/5 dark:border-white/5"
          >
             <ClubAnnouncements />
          </motion.section>

          {/* Members Registry */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-10 px-2">
               <div className="w-2 h-10 bg-purple-500 rounded-full" />
               <h2 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tighter">
                 Confirmed Members
               </h2>
            </div>
            <div className="glass rounded-[3rem] p-1 border-black/5 dark:border-white/5">
              <MemberList members={membersData?.members || []} />
            </div>
          </motion.section>
        </div>

        {/* Tactical Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Logistics Intelligence */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[3rem] p-10 border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 blur-3xl -ml-16 -mb-16" />
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-10">Logistics Protocols</h3>
            <div className="space-y-10 relative z-10">
              <div className="flex gap-6 group">
                <div className="h-14 w-14 glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Weekly Period</div>
                  <div className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">{club.meetingSchedule}</div>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="h-14 w-14 glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Nexus Location</div>
                  <div className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">Campus Activities Center</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* High Command Sidebar */}
          <div className="glass rounded-[3rem] p-2 border-black/5 dark:border-white/5">
            <LeadershipSection leadership={leadership} />
          </div>
          
          {/* Strategic Contact Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="premium-gradient rounded-[3rem] p-10 relative overflow-hidden shadow-[0_30px_60px_rgba(99,102,241,0.3)] group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <Trophy className="h-32 w-32 text-gray-900 dark:text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Lead the Future.</h3>
              <p className="text-indigo-100/70 text-base mb-10 leading-relaxed font-medium">
                Our board is seeking visionaries to scale our impact. Inquire about vacant leadership protocols.
              </p>
              <button className="w-full bg-white text-indigo-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all shadow-xl shadow-black/20">
                Contact High Command
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;
