import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProfileQuery } from '../../services/profileApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { SkillsList } from '../../components/profile/SkillsList';
import { BadgeGrid } from '../../components/profile/BadgeGrid';
import { ClubMemberships } from '../../components/profile/ClubMemberships';
import { EventHistory } from '../../components/profile/EventHistory';
import { Github, Linkedin, Globe } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // If no userId in URL, assume viewing own profile
  const targetId = userId || currentUser?.id;

  const { data: profile, isLoading, isError } = useGetProfileQuery(targetId as string, {
    skip: !targetId,
  });

  if (isLoading || !profile) return (
     <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
     </div>
  );

  if (isError) return <div className="text-center py-20 text-red-500 font-medium">Profile not found.</div>;

  const isOwner = currentUser?.id === profile._id || currentUser?.id === (profile as any).id;

  return (
    <div className="pb-16 max-w-6xl mx-auto">
      <ProfileHeader profile={profile} isOwner={isOwner} />

      <div className="px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-3">About Me</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
            
            {(profile.portfolioLinks?.github || profile.portfolioLinks?.linkedin || profile.portfolioLinks?.website) && (
              <div className="mt-6 flex flex-col gap-3">
                {profile.portfolioLinks.github && (
                   <a href={profile.portfolioLinks.github} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                     <Github className="w-4 h-4 mr-2" /> GitHub
                   </a>
                )}
                {profile.portfolioLinks.linkedin && (
                   <a href={profile.portfolioLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-400 hover:text-[#0a66c2] transition-colors">
                     <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                   </a>
                )}
                {profile.portfolioLinks.website && (
                   <a href={profile.portfolioLinks.website} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-400 hover:text-primary-400 transition-colors">
                     <Globe className="w-4 h-4 mr-2" /> Portfolio Website
                   </a>
                )}
              </div>
            )}
          </div>

          <div>
             <h3 className="text-lg font-semibold text-white mb-4">Team Matcher Skills</h3>
             <SkillsList skills={profile.skillsList} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Interests</h3>
             {profile.interests && profile.interests.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {profile.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-800/50 text-gray-400 border border-gray-700/50 rounded-full text-xs">
                      {interest}
                    </span>
                 ))}
               </div>
             ) : (
                <p className="text-sm text-gray-500 italic">No interests provided.</p>
             )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Digital Achievements</h3>
            <BadgeGrid badges={profile.badges} />
          </div>

          <div>
             <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">My Clubs</h3>
             <ClubMemberships clubs={[]} /> 
          </div>

          <div>
             <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Events Dashboard</h3>
             <EventHistory events={[]} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
