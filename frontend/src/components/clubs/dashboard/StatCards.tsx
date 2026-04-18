import React from 'react';
import { Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

export const StatCards: React.FC = () => {
  const stats: Stat[] = [
    {
      label: 'Total Members',
      value: '254',
      change: '+12% this month',
      icon: <Users className="h-6 w-6" />,
      color: 'indigo'
    },
    {
      label: 'Event RSVPs',
      value: '42',
      change: 'For next event',
      icon: <Calendar className="h-6 w-6" />,
      color: 'purple'
    },
    {
      label: 'Engagement Rate',
      value: '68%',
      change: '+5% vs last month',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'green'
    },
    {
      label: 'Pending Requests',
      value: '14',
      change: 'Require attention',
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            {stat.change && (
              <span className={`text-[10px] font-bold uppercase tracking-wider ${stat.change.includes('+') ? 'text-green-400' : 'text-gray-500'}`}>
                {stat.change}
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
