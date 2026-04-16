import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface DashboardSummaryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  color: 'indigo' | 'orange' | 'emerald' | 'amber';
  delay?: number;
}

const colorStyles = {
  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40',
  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:border-orange-500/40',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-500/40',
};

export const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({
  title,
  count,
  icon,
  href,
  color,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 ${colorStyles[color]} hover:-translate-y-1 hover:shadow-xl`}
    >
      <Link to={href} className="block p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/5 rounded-xl shadow-inner">
            {icon}
          </div>
          <span className="text-3xl font-black text-white">{count}</span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="font-semibold text-sm text-gray-300">{title}</h3>
          <div className="flex items-center gap-1 text-xs font-bold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            View <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
