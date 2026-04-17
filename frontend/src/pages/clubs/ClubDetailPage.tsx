import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchClubByIdQuery, useFetchClubMembersQuery } from '../../services/clubApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ClubDetailHeader } from '../../components/clubs/detail/ClubDetailHeader';
import { LeadershipSection } from '../../components/clubs/detail/LeadershipSection';
import { MemberList } from '../../components/clubs/detail/MemberList';
import { ClubAnnouncements } from '../../components/clubs/detail/ClubAnnouncements';
import { Loader2, ChevronLeft, MapPin, Calendar, Info, Trophy } from 'lucide-react';

export const ClubDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
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
        <h1 className="text-4xl font-bold text-white mb-4">Club Not Found</h1>
        <p className="text-gray-400 mb-8">The club you are looking for might have been moved or deleted.</p>
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
    <div className="min-h-screen pb-20">
      <ClubDetailHeader 
        club={club} 
        isMember={isMember} 
        isPresident={isPresident} 
      />

      <div className="max-w-full md:px-12 lg:px-20 mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-indigo-400" />
              About the Club
            </h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {club.description}
              </p>
              {club.tags && club.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {club.tags.map(tag => (
                    <span key={tag} className="bg-gray-800 text-gray-400 px-3 py-1 rounded-lg text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Announcements */}
          <section>
             <ClubAnnouncements />
          </section>

          {/* Members Grid */}
          <section>
            <MemberList members={membersData?.members || []} />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Schedule Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Logistics</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Schedule</div>
                  <div className="text-white font-medium">{club.meetingSchedule}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Primary Location</div>
                  <div className="text-white font-medium">Campus Activities Center</div>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Sidebar */}
          <LeadershipSection leadership={leadership} />
          
          {/* Quick Actions Card */}
          <div className="bg-indigo-600 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Trophy className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Want to lead?</h3>
              <p className="text-indigo-100/80 text-sm mb-6 leading-relaxed">
                Connect with the board members to learn about upcoming leadership opportunities and roles.
              </p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg">
                Contact Board
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;
