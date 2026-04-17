import React from 'react';
import { useGetFeedQuery, FeedItem } from '../../services/feedApi';
import PageContainer from '../../components/layout/PageContainer';
import { motion } from 'framer-motion';
import { Calendar, Users, Briefcase, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const CommunityFeedPage: React.FC = () => {
  const { data, isLoading } = useGetFeedQuery({ limit: 10 });
  const items = data?.items || [];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Sparkles size={24} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Campus Pulse</h1>
          </div>
          <p className="text-gray-400 text-lg">Real-time updates from clubs, events, and projects across campus.</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-900/50 border border-gray-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item, index) => (
              <FeedCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

const FeedCard: React.FC<{ item: FeedItem; index: number }> = ({ item, index }) => {
  const Icon = item.type === 'event' ? Calendar : item.type === 'club' ? Users : Briefcase;
  const colorClass = item.type === 'event' ? 'text-indigo-400 bg-indigo-500/10' : 
                    item.type === 'club' ? 'text-emerald-400 bg-emerald-500/10' : 
                    'text-amber-400 bg-amber-500/10';

  const linkPath = item.type === 'event' ? `/events/${item.id}` : 
                  item.type === 'club' ? `/clubs/${item.id}` : 
                  `/teams`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all"
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
        {item.image && (
          <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
            <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-1.5 rounded-lg ${colorClass}`}>
              <Icon size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.type} update</span>
            <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1 ml-auto">
              <Clock size={12} /> {formatDistanceToNow(new Date(item.timestamp))} ago
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h2>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
            {item.description}
          </p>

          <Link 
            to={linkPath}
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-indigo-400 transition-colors group/btn"
          >
            Explore More <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityFeedPage;
