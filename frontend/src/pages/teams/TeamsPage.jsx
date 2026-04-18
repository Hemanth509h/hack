import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  Plus, 
  Briefcase, 
  Clock, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  useGetMatchesQuery, 
  useBrowseProjectsQuery,
  useGetMyProjectsQuery
} from '../../services/teamApi';
import PageContainer from '../../components/layout/PageContainer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreateProjectModal } from '../../components/teams/CreateProjectModal';

const TeamsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'matches' | 'my-projects'>('browse');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: browseData, isLoading: browseLoading } = useBrowseProjectsQuery({});
  const { data: matchesData, isLoading: matchesLoading } = useGetMatchesQuery();
  const { data: myProjectsData } = useGetMyProjectsQuery();

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Projects</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Collaborate on hackathons, research, and campus initiatives.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Post a Project</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-black/5 dark:bg-white/5 rounded-2xl mb-8 w-fit">
        <TabButton 
          active={activeTab === 'browse'} 
          onClick={() => setActiveTab('browse')}
          label="Browse Projects" 
          icon={<Search size={18} />}
        />
        <TabButton 
          active={activeTab === 'matches'} 
          onClick={() => setActiveTab('matches')}
          label="Team Matcher" 
          icon={<Sparkles size={18} />}
        />
        <TabButton 
          active={activeTab === 'my-projects'} 
          onClick={() => setActiveTab('my-projects')}
          label="My Projects" 
          icon={<Briefcase size={18} />}
        />
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by project name, tech stack, or event..." 
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <button className="p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                <Filter size={20} />
              </button>
            </div>

            {browseLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-black/5 dark:bg-white/5 animate-pulse rounded-3xl border border-black/5 dark:border-white/5" />)}
              </div>
            ) : browseData?.projects && browseData.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {browseData.projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No projects found" 
                description="Be the first to start a project for upcoming campus events!"
                icon={<Briefcase size={48} className="text-gray-600" />}
              />
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 mb-8 relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={24} />
                    AI-Powered Team Matcher
                  </h2>
                  <p className="text-blue-100/70 max-w-2xl">
                    Our algorithm analyzes your skills, interests, and past collaborations to suggest the perfect teammates for your next big project.
                  </p>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
            </div>

            {matchesLoading ? (
               <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-black/5 dark:bg-white/5 animate-pulse rounded-2xl border border-black/5 dark:border-white/5" />)}
               </div>
            ) : matchesData?.matches && matchesData.matches.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matchesData.matches.map((match) => (
                  <MatchCard key={match.user._id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No matches yet" 
                description="Complete your profile and add more skills to find your perfect team matches!"
                icon={<Users size={48} className="text-gray-600" />}
              />
            )}
          </div>
        )}

        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            {myProjectsData?.projects && myProjectsData.projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {myProjectsData.projects.map((project) => (
                  <Link 
                    to={`/teams/projects/${project._id}`} 
                    key={project._id}
                    className="flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                          <Briefcase size={24} />
                       </div>
                       <div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                          <p className="text-sm text-gray-500">
                             {project.status === 'open' ? '🟢 Open for members' : '🔴 Team full'} • {project.members.length} members
                          </p>
                       </div>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-gray-900 dark:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="You haven't joined any teams" 
                description="Join an existing team or create your own project to get started."
                icon={<Clock size={48} className="text-gray-600" />}
              />
            )}
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </PageContainer>
  );
};

const TabButton: React.FC void; label; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ProjectCard: React.FC = ({ project }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 hover:bg-black/10 dark:hover:bg-white/10 transition-all flex flex-col h-full"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex -space-x-3">
        {project.members.slice(0, 3).map((member, i) => (
          <img 
            key={i}
            src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
            alt={member.name}
            className="w-10 h-10 rounded-full border-2 border-gray-950 object-cover"
          />
        ))}
        {project.members.length > 3 && (
          <div className="w-10 h-10 rounded-full border-2 border-gray-950 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
            +{project.members.length - 3}
          </div>
        )}
      </div>
      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        project.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
      }`}>
        {project.status}
      </div>
    </div>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{project.title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">{project.description}</p>

    <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
      <div className="flex flex-wrap gap-2">
        {project.requiredSkills.slice(0, 3).map((s, i) => (
          <span key={i} className="text-[10px] bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg border border-black/5 dark:border-white/5">
            {s.skill.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-500 flex items-center">
          <Clock size={12} className="mr-1" /> 
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/teams/projects/${project._id}`} className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
          View Details
        </Link>
      </div>
    </div>
  </motion.div>
);

const MatchCard: React.FC = ({ match }) => (
  <div className="p-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl hover:bg-black/10 dark:hover:bg-white/10 transition-all">
    <div className="flex items-center space-x-4 mb-6">
      <img 
        src={match.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.user.name}`} 
        className="w-16 h-16 rounded-2xl object-cover" 
        alt={match.user.name}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
           <h3 className="font-bold text-gray-900 dark:text-white text-lg">{match.user.name}</h3>
           <div className="flex items-center space-x-1 px-2.5 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold">
              <Sparkles size={12} />
              <span>{Math.round(match.matchScore)}% Match</span>
           </div>
        </div>
        <p className="text-sm text-gray-500">{match.user.major || 'Student'}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
       <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Skill Overlap</p>
          <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500" style={{ width: `${match.breakdown.skillOverlap}%` }} />
          </div>
       </div>
       <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Interest alignment</p>
          <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500" style={{ width: `${match.breakdown.interestAlignment}%` }} />
          </div>
       </div>
    </div>

    <div className="flex items-center justify-between">
       <div className="flex flex-wrap gap-1">
          {match.user.skills.slice(0, 2).map((s) => (
            <span key={s._id} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg">
              {s.name}
            </span>
          ))}
       </div>
       <button className="text-sm font-bold text-gray-900 dark:text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-all">
          Connect
       </button>
    </div>
  </div>
);

const EmptyState: React.FC = ({ title, description, icon }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-[3rem]">
    <div className="mb-6 p-6 bg-black/5 dark:bg-white/5 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 max-w-sm">{description}</p>
  </div>
);

export default TeamsPage;
